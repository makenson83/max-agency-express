// /api/webhook.js
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  initializeApp();
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método não permitido");
  }

  const evento = req.body || {};

  if (evento?.type !== "payment" || !evento?.data?.id) {
    return res.status(200).send("Evento ignorado.");
  }

  try {
    const MP_TOKEN = process.env.MP_ACCESS_TOKEN || "APP_USR-7962833792436627-072523-8ffea118ee1504c171f5b0097b0c3e84-2495062492";

    const resp = await fetch(`https://api.mercadopago.com/v1/payments/${evento.data.id}`, {
      headers: { Authorization: `Bearer ${MP_TOKEN}` }
    });

    const pagamento = await resp.json();

    if (pagamento?.status !== "approved") {
      return res.status(200).send("Pagamento ainda não aprovado.");
    }

    const email = pagamento?.external_reference || pagamento?.payer?.email;
    const valor = Number(pagamento?.transaction_amount) || 0;

    if (!email || !valor) {
      return res.status(200).send("Dados insuficientes para atualizar saldo.");
    }

    const userRef = db.collection("usuarios").doc(email);
    const snap = await userRef.get();
    const saldoAtual = snap.exists ? Number(snap.data()?.saldo || 0) : 0;
    await userRef.set({ email, saldo: saldoAtual + valor }, { merge: true });

    await db.collection("transacoes").add({
      userId: email,
      tipo: "Depósito Pix",
      valorBRL: valor,
      origem: "Mercado Pago",
      data: new Date().toISOString(),
      status: "Aprovado"
    });

    return res.status(200).send("Saldo atualizado com sucesso.");
  } catch (erro) {
    console.error("Erro no webhook:", erro);
    return res.status(500).send("Erro ao processar pagamento.");
  }
}
