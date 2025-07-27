
// api/recarga.js
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  initializeApp();
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido" });
  }

  const { pais, ddd, numero, valor, operadora } = req.body;

  if (!pais || !ddd || !numero || !operadora || !valor || valor < 3 || valor > 1000) {
    return res.status(400).json({ mensagem: "Dados inválidos" });
  }

  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(401).json({ mensagem: "Usuário não autenticado" });
  }

  try {
    const userRef = db.collection("usuarios").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const userData = userSnap.data();
    const saldoAtual = userData.saldo || 0;

    if (saldoAtual < valor) {
      return res.status(400).json({ mensagem: "Saldo insuficiente" });
    }

    // Taxa fixa (pode ser substituída por taxa dinâmica futura)
    const taxa = 13;
    const valorHTG = valor * taxa;

    const telefoneCompleto = `+${ddd}${numero}`;

    // Atualiza o saldo do usuário
    await userRef.update({ saldo: saldoAtual - valor });

    // Registra no histórico
    await db.collection("transacoes").add({
      userId,
      tipo: "Recarga",
      pais,
      operadora,
      numero: telefoneCompleto,
      valorBRL: valor,
      valorHTG,
      data: new Date().toISOString(),
      status: "Sucesso"
    });

    return res.status(200).json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao processar recarga:", err);
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}
