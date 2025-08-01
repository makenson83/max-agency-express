async function gerarPix() {
  const valor = parseFloat(document.getElementById("valor").value);

  if (isNaN(valor) || valor < 3 || valor > 3000) {
    alert("Informe um valor entre R$3 e R$3000.");
    return;
  }

  // Tenta pegar o e-mail do usuário (ex: salvo após login)
  let email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
  if (!email) {
    email = prompt("Digite seu e-mail de login para creditar o saldo:");
    if (!email) {
      alert("E-mail é obrigatório para gerar o Pix.");
      return;
    }
    localStorage.setItem("userEmail", email);
  }

  let res;
  try {
    res = await fetch("/api/servidor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor, email })
    });
  } catch (e) {
    alert("Falha de rede ao tentar gerar o Pix. Verifique sua conexão.");
    return;
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    alert("Não foi possível ler a resposta do servidor.");
    return;
  }

  if (!res.ok) {
    const msg = data && (data.message || data.error || data.cause?.[0]?.description);
    alert("Erro ao gerar Pix: " + (msg || "tente novamente"));
    return;
  }

  // Campos retornados pelo Mercado Pago
  const tdata = data?.point_of_interaction?.transaction_data;
  if (!tdata?.qr_code) {
    alert("Não foi possível obter o QR Code do Pix.");
    return;
  }

  document.getElementById("pixCode").value = tdata.qr_code;
  document.getElementById("pixResult").style.display = "block";

  if (tdata.qr_code_base64) {
    const img = document.getElementById("qrCodeImg");
    img.src = "data:image/png;base64," + tdata.qr_code_base64;
    img.style.display = "block";
  }
}
