let qrCode;

function generateQRCode() {
  const type = document.getElementById("qr-type").value;
  const input = document.getElementById("qr-input").value.trim();
  const ssid = document.getElementById("wifi-ssid").value.trim();
  const pass = document.getElementById("wifi-pass").value.trim();
  const qrContainer = document.getElementById("qrcode");
  const saveBtn = document.getElementById("save-btn");

  if (!input && type !== "wifi") {
    alert("Lütfen içerik giriniz.");
    return;
  }

  let data = "";

  switch (type) {
    case "url":
      data = input.startsWith("http") ? input : "https://" + input;
      break;
    case "tel":
      data = "tel:" + input;
      break;
    case "email":
      data = "mailto:" + input;
      break;
    case "sms":
      data = "sms:" + input;
      break;
    case "wifi":
      if (!ssid || !pass) {
        alert("Wi-Fi SSID ve Şifre giriniz.");
        return;
      }
      data = `WIFI:T:WPA;S:${ssid};P:${pass};;`;
      break;
    case "geo":
      data = `https://maps.google.com/?q=${input}`;
      break;
    default:
      data = input;
  }

  qrContainer.innerHTML = "";
  qrCode = new QRCode(qrContainer, {
    text: data,
    width: 200,
    height: 200,
    colorDark: "#ffffff",
    colorLight: "#1e1e1e",
    correctLevel: QRCode.CorrectLevel.H
  });

  saveBtn.classList.remove("hidden");
}

function downloadQR() {
  const img = document.querySelector("#qrcode img");
  if (!img) return;
  const url = img.src;
  const a = document.createElement("a");
  a.href = url;
  a.download = "qr-kod.png";
  a.click();
}

document.getElementById("qr-type").addEventListener("change", function () {
  const type = this.value;
  const wifiExtra = document.getElementById("wifi-extra");
  const inputField = document.getElementById("qr-input");

  if (type === "wifi") {
    wifiExtra.classList.remove("hidden");
    inputField.classList.add("hidden");
  } else {
    wifiExtra.classList.add("hidden");
    inputField.classList.remove("hidden");
  }
});
