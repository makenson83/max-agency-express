async function gerarPix() {
  const valor = parseFloat(document.getElementById("valor").value);

  if (isNaN(valor) || valor < 3) {
    alert("O valor mínimo para gerar Pix é R$3");
    return;
  }

  const res = await fetch("/api/servidor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ valor })
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById("pixCode").value = data.point_of_interaction.transaction_data.qr_code;
    document.getElementById("pixResult").style.display = "block";

    const qrBase64 = data.point_of_interaction.transaction_data.qr_code_base64;
    if (qrBase64) {
      const img = document.getElementById("qrCodeImg");
      img.src = "data:image/png;base64," + qrBase64;
      img.style.display = "block";
    }
  } else {
    alert(data.message || "Erro ao gerar Pix");
  }
}
