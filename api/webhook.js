import { db } from '../firebase.js';
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

    const paymentId = body?.data?.id;
    if (!paymentId) {
      return res.status(400).json({ error: 'ID do pagamento não encontrado.' });
    }

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer APP_USR-7962833792436627-072523-8ffea118ee1504c171f5b0097b0c3e84-2495062492`,
      },
    });

    const data = await mpResponse.json();

    if (data.status === 'approved') {
      const email = data.payer.email;
      const valor = data.transaction_amount;

      const userRef = doc(db, 'usuarios', email);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const saldoAtual = docSnap.data().saldo || 0;
        await updateDoc(userRef, {
          saldo: saldoAtual + valor,
        });
      } else {
        await setDoc(userRef, {
          email: email,
          saldo: valor,
        });
      }

      return res.status(200).json({ status: 'ok', message: 'Saldo atualizado com sucesso.' });
    }

    return res.status(200).json({ status: 'ok', message: 'Pagamento não aprovado.' });
  } catch (err) {
    console.error('Erro no Webhook:', err);
    return res.status(500).json({ error: 'Erro interno.' });
  }
}
