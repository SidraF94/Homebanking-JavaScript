function crearMoneda() {
  const plantilla = document.getElementById('plantilla-moneda');
  const moneda = plantilla.cloneNode(true);
  moneda.style.left = Math.random() * window.innerWidth + "px";
  moneda.style.top = "-40px";
  moneda.style.display = "block";
  moneda.style.animationDuration = (5 + Math.random() * 3) + "s";
  moneda.style.transform = `rotate(${Math.random() * 360}deg)`;

  document.body.appendChild(moneda);

  setTimeout(() => {
    moneda.remove();
  }, 6000);
}

setInterval(crearMoneda, 300);
