// /api/servidor.js
import crypto from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { valor, email } = req.body || {};
    const num = Number(valor);

    if (!num || num < 3 || num > 3000) {
      return res.status(400).json({ message: "Valor inválido. Mínimo R$3 e máximo R$3000." });
    }

    // Ajuste o token via variável de ambiente na Vercel (recomendado).
    const MP_TOKEN = process.env.MP_ACCESS_TOKEN || "APP_USR-7962833792436627-072523-8ffea118ee1504c171f5b0097b0c3e84-2495062492";
    const WEBHOOK_URL = process.env.MP_WEBHOOK_URL || "https://max-agency-express.vercel.app/api/webhook";

    const idemp = req.headers["x-idempotency-key"] || crypto.randomUUID();

    const body = {
      transaction_amount: num,
      description: "Adicionar saldo Max Agency",
      payment_method_id: "pix",
      payer: { email: email || "sem-email@exemplo.com" },
      external_reference: email || "sem-email",
      notification_url: WEBHOOK_URL
    };

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": idemp
      },
      body: JSON.stringify(body)
    });

    const data = await mpRes.json();
    if (!mpRes.ok) {
      return res.status(mpRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro interno:", error);
    return res.status(500).json({ message: "Erro interno: " + error.message });
  }
}
