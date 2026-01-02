function printTicket() {
  const route = document.getElementById("route").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const seat = document.getElementById("seat").value;
  const price = document.getElementById("price").value;

  const ticketCode = "TKT-" + Date.now();

  document.getElementById("t-route").innerText = route;
  document.getElementById("t-date").innerText = date;
  document.getElementById("t-time").innerText = time;
  document.getElementById("t-seat").innerText = seat;
  document.getElementById("t-price").innerText = price;

  document.getElementById("ticket").style.display = "block";
  document.getElementById("qrcode").innerHTML = "";

  new QRCode(document.getElementById("qrcode"), {
    text: ticketCode,
    width: 100,
    height: 100
  });

  setTimeout(() => {
    window.print();
  }, 300);
}
