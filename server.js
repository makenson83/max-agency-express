
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = 'APP_USR-7962833792436627-072523-8ffea118ee1504c171f5b0097b0c3e84-2495062492';
const CHAVE_PIX = 'maxagencypc83@gmail.com';

app.post('/criar-pagamento', async (req, res) => {
  try {
    const valor = parseFloat(req.body.valor);

    if (valor < 3 || valor > 3000) {
      return res.status(400).json({ erro: 'Valor deve ser entre R$3 e R$3000.' });
    }

    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        transaction_amount: valor,
        description: 'Adicionar saldo Max Agency',
        payment_method_id: 'pix',
        payer: { email: 'pagador@email.com' }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { qr_code, qr_code_base64 } = response.data.point_of_interaction.transaction_data;
    res.json({ qr_code, qr_code_base64 });

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar pagamento', detalhe: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
