export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end("Método não permitido");

  const { valor, email } = req.body;

  try {
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer APP_USR-7962833792436627-072523-8ffea118ee1504c171f5b0097b0c3e84-2495062492"
      },
      body: JSON.stringify({
        transaction_amount: Number(valor),
        description: "Depósito via Pix",
        payment_method_id: "pix",
        payer: { email: "pagador@email.com" },
        external_reference: email
      })
    });

    const result = await response.json();
    res.status(200).json({
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64
    });
  } catch (e) {
    console.error(e);
    res.status(500).end("Erro ao gerar Pix");
  }
}