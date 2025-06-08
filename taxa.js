
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=BRL&symbols=HTG');
    const data = await response.json();
    const taxa = data.rates.HTG;
    res.status(200).json({ taxa });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar taxa online." });
  }
};
