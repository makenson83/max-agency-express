export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('📦 Webhook recebido do GitHub!');
    console.log(req.body); // Para testes, pode visualizar os dados enviados

    return res.status(200).json({ status: 'Recebido com sucesso' });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
