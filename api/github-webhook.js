export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log("✅ Webhook recebido do GitHub:");
    console.log(req.body);
    return res.status(200).json({ status: 'ok', message: 'Webhook processado com sucesso.' });
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
