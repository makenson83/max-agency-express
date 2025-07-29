// api/servidor.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { valor } = req.body;

    if (!valor || valor < 3 || valor > 3000) {
      return res.status(400).json({ message: 'Valor inválido. Mínimo R$3 e máximo R$3000.' });
    }

    try {
      const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          Authorization: "Bearer APP_USR-7962833792436627-072523-8ffea118ee1504c171f5b0097b0c3e84-2495062492", // Token de produção
          "Content-Type": "application/json",
          "X-Idempotency-Key": Math.random().toString(36).substring(2)
        },
        body: JSON.stringify({
          transaction_amount: Number(valor),
          description: "Adicionar saldo Max Agency",
          payment_method_id: "pix",
          payer: {
            email: "maxagencypc83@gmail.com"
          }
        })
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Erro interno: " + error.message });
    }

  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
