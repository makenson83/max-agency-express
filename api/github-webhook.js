// api/webhook.js (ou github-webhook.js, se preferir)
import { db } from './firebase.js';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const buf = await buffer(req);
    const body = JSON.parse(buf.toString());

    const payment = body?.data?.id;

    // Buscar detalhes do pagamento
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${payment}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer APP_USR-7962833792436627-072523-8ffea118ee1504c171f5b0097b0c3e84-2495062492",
      },
    });

    const data = await response.json();

    if (data.status === "approved") {
      const emailPagador = data.payer?.email || "";
      const valorRecebido = data.transaction_amount || 0;

      if (!emailPagador) {
        return res.status(400).json({ error: "Email do pagador não encontrado." });
      }

      // Referência do documento
      const docRef = doc(db, "usuarios", emailPagador);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const saldoAtual = docSnap.data().saldo || 0;
        await updateDoc(docRef, {
          saldo: saldoAtual + valorRecebido,
        });
      } else {
        // Cria novo usuário se não existir
        await setDoc(docRef, {
          email: emailPagador,
          saldo: valorRecebido,
        });
      }

      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ status: data.status });
    }
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
