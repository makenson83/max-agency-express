
// api/webhook.js
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

if (!admin.apps.length) {
  initializeApp();
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método não permitido");
  }

  const evento = req.body;

  if (evento?.type === "payment" && evento?.data?.id) {
    const paymentId = evento.data.id;

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: "Bearer APP_USR-7962833792436627-072523-8ffea118ee1504c171f5b0097b0c3e84-2495062492"
        }
      });

      const pagamento = await response.json();

      if (pagamento.status === "approved") {
        const email = pagamento.payer?.email || "";
        const valor = pagamento.transaction_amount;
        const userId = pagamento.payer?.id?.toString();

        if (!userId || !valor) {
          return res.status(400).send("Dados do pagador incompletos.");
        }

        const userRef = db.collection("usuarios").doc(userId);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
          await userRef.set({
            email: email || "desconhecido",
            saldo: valor
          });
        } else {
          const userData = userSnap.data();
          const saldoAtual = userData.saldo || 0;
          await userRef.update({ saldo: saldoAtual + valor });
        }

        await db.collection("transacoes").add({
          userId,
          tipo: "Depósito Pix",
          valorBRL: valor,
          origem: "Mercado Pago",
          data: new Date().toISOString(),
          status: "Aprovado"
        });

        return res.status(200).send("Saldo atualizado com sucesso.");
      } else {
        return res.status(200).send("Pagamento ainda não aprovado.");
      }
    } catch (erro) {
      console.error("Erro ao consultar ou processar pagamento:", erro);
      return res.status(500).send("Erro ao processar pagamento.");
    }
  } else {
    return res.status(400).send("Evento inválido.");
  }
}
