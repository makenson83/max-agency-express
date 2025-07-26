const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = 'APP_USR-7962833792436627-072523-8ffea118ee1504c171f5b0097b0c3e84-2495062492';
const CHAVE_PIX = 'maxagencypc83@gmail.com';

app.post('/api/gerar-pix', async (req, res) => {
  const { valor } = req.body;

  if (!valor || valor < 3 || valor > 3000) {
    return res.status(400).json({ error: 'Valor inválido (mínimo R$3, máximo R$3000).' });
  }

  try {
    const pagamento = await axios.post('https://api.mercadopago.com/v1/payments', {
      transaction_amount: Number(valor),
      description: "Adicionar saldo via Pix - Max Agency",
      payment_method_id: "pix",
      payer: {
        email: "comprador@gmail.com"
      }
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const resposta = pagamento.data;
    return res.json({
      qr_code_base64: resposta.point_of_interaction.transaction_data.qr_code_base64,
      qr_code: resposta.point_of_interaction.transaction_data.qr_code
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao gerar Pix.' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});