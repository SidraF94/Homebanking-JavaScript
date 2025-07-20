// Proyecto homebanking con DOM incluido. 
// Guardamos y cargamos usuarios -----------------------------------------------------------------------------
let usuarios = cargarUsuarios();
let usuarioActivo = null;
//-------------------------------------------------------------------------------------------------------------
function inicializarFondo() {
  const fondos = [
    "img/familia1.jpg",
    "img/familia2.jpg",
    "img/familia3.jpg",
  ];

  const fondoDiv = document.getElementById("fondoDinamico");
  let indiceActual = 0;

  function cambiarFondo() {
    const fondo = fondos[indiceActual];

    fondoDiv.style.backgroundImage = `
      url("${fondo}"),
      linear-gradient(to top right, rgba(102, 144, 236, 0.53) 0%, rgba(245, 244, 244, 0.03) 60%, rgba(24, 23, 23, 0.74) 100%)
    `;
    fondoDiv.style.backgroundBlendMode = "overlay";
    indiceActual = (indiceActual + 1) % fondos.length;
  }
  cambiarFondo(); // fondo inicial
  setInterval(cambiarFondo, 15000); // cambia cada 15s
}

// ------------------------------------------------------------------------------------------------------------
// Funciones que controlan el tiempo
//-------------------------------------------------------------------------------------------------------------

let fechaBaseSimulada = new Date();
let diasSimulados = Number(localStorage.getItem("diasSimulados")) || 0;

function guardarFechaSimulada() {
  localStorage.setItem("diasSimulados", diasSimulados);
}

// Es un numero no hace falta JSONparse pero si parseInt para hacerlo number
function cargarFechaSimulada() {
  diasSimulados = parseInt(localStorage.getItem("diasSimulados")) || 0;
}

function obtenerFechaSimulada() {
  const base = new Date(fechaBaseSimulada);
  const simulada = new Date(base);
  simulada.setDate(base.getDate() + diasSimulados);
  return simulada;
}
// Función para mostrar la fecha simulada
function iniciarRelojSimulado() {
  const relojSimu = document.getElementById("relojSimulado");

  function actualizarReloj() {
    const fecha = obtenerFechaSimulada(); // funcin que devuelve la fecha simulada actual
    relojSimu.textContent = `Fecha simulada: ${fecha.toLocaleDateString()}`;
  }
  actualizarReloj(); // Mostrar inmediatamente
  setInterval(actualizarReloj, 1000); // Actualizar cada segundo
}

function avanzarDias(cantidad) {
  diasSimulados += cantidad;
  guardarFechaSimulada();
  chequearEventosUsuario(usuarioActivo);
  miAlerta(`Se avanzaron ${cantidad} día(s). Nueva fecha: ${obtenerFechaSimulada().toLocaleDateString()}`);
}
//-----------------------------------------------------------------------------------------------------------

function inicializarUsuariosBase() {
  //Chequeo que no exista en localStorage ningun array de Usuarios
  if (!localStorage.getItem("usuarios")) {
    usuarios = [
      {
        usuario: "admin",
        contraseña: "1234",
        nombre: "Admi",
        apellido: "Nistrador",
        sexo: "X",
        edad: 30,
        saldo: 500000,
        saldoDolares: 0,
        saldoEuros: 0,
        saldoReales: 0,
        alias: "ADMI.NISTRADOR",
        banco: "Banco de Córdoba",
        numeroCuenta: 1111111111111111,
        fechaUltimaRevision: new Date(obtenerFechaSimulada()),
        contactos: [],
        movimientos: [
          {
            descripcion: "Deposito inicial",
            monto: 500000,
            saldoResultante: 500000,
            fecha: new Date(obtenerFechaSimulada())
          }
        ],
        notificaciones: [
          {
            mensaje: "Bienvenido al nuevo Homebanking!",
            leida: false,
            fecha: new Date(obtenerFechaSimulada())
          }
        ],
        eventosTemporarios: [
          {
            tipo: "pagoSueldo",
            fechaUltimaRevision: null,
            parametros: { monto: 500000 },
            activo: true
          }
        ],
        servicios: [
          { nombre: "Luz", pagado: true, monto: 0, rango: { min: 15000, max: 50000 }, imagen: "luz.png" },
          { nombre: "Agua", pagado: true, monto: 0, rango: { min: 3000, max: 9000 }, imagen: "agua.png" },
          { nombre: "Gas", pagado: true, monto: 0, rango: { min: 7000, max: 12000 }, imagen: "gas.png" },
          { nombre: "Teléfono", pagado: true, monto: 0, rango: { min: 5000, max: 7000 }, imagen: "telefono.png" },
          { nombre: "Internet", pagado: true, monto: 0, rango: { min: 10000, max: 20000 }, imagen: "internet.png" },
          { nombre: "Impuestos Municipales", pagado: true, monto: 0, rango: { min: 1500, max: 2500 }, imagen: "impuestos.png" },
        ],
        prestamos: []
      }
    ];
    //Lo guardo en local storage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}

// Función miAlerta que recibe mensaje y muestra modal alerta ------------------------------------------

function miAlerta(mensaje, callbackCerrar) { // Puedo o no pasar una funcion que siga despues del 
  // alerta (lo hago en generarToken por ejemplo)
  const overlay = document.getElementById("modalAlertaOverlay");//modal 
  const mensajeP = document.getElementById("modalAlertaMensaje");// parrafo p
  const btn = document.getElementById("modalAlertaBtn");// boton
  //para que se asegure de obtener los tres. 
  if (!overlay || !mensajeP || !btn) return;

  mensajeP.innerHTML = mensaje.replace(/\n/g, "<br>"); //El mensaje que le pasamos a la funcion. 
  overlay.classList.remove("oculto"); //Lo hacemos visible

  let enterListoParaCerrar = false;
  //Esto lo puse para que el enter anterior no me lo cierre. 
  setTimeout(() => { enterListoParaCerrar = true; }, 300);

  function cerrarModal() {
    overlay.classList.add("oculto"); //Lo oculto
    //evito que quede en memoria
    overlay.removeEventListener("keydown", teclaCerrar);
    btn.removeEventListener("click", cerrarModal);
    if (typeof callbackCerrar === "function") callbackCerrar();
    //Si le paso una funcion a miAlerta la llama
  }

  function teclaCerrar(e) {
    if (e.key === "Escape") {
      e.preventDefault(); //Evito que el navegador haga cualquier cosa (por defecto)
      e.stopPropagation();//Evito que la accion se propague a otros elementos. 
      cerrarModal(); //se cierra
    } else if (e.key === "Enter" && enterListoParaCerrar) {
      e.preventDefault();
      e.stopPropagation();
      cerrarModal();
    }
  }
  btn.addEventListener("click", cerrarModal);
  overlay.addEventListener("keydown", teclaCerrar); //teclaCerrar de escape o enter
  overlay.focus(); //Para que el modal escuche al teclado
}

// Funcion miPrompt -----------------------------------------------------------------------------------

function miPrompt(mensaje, callback) {
  //referencias necesarias 
  const overlay = document.getElementById("modalPromptOverlay");
  const mensajeP = document.getElementById("modalPromptMensaje");
  const input = document.getElementById("modalPromptInput");
  const btnAceptar = document.getElementById("modalPromptAceptar");
  const btnCancelar = document.getElementById("modalPromptCancelar");
  //No se ejecuta si falta algo
  if (!overlay || !mensajeP || !input || !btnAceptar || !btnCancelar) return;

  mensajeP.textContent = mensaje;
  input.value = ""; //Vacio
  overlay.classList.remove("oculto");

  function cerrarModal() {
    overlay.classList.add("oculto");
    overlay.removeEventListener("keydown", teclaCerrar);
    btnAceptar.removeEventListener("click", aceptar);
    btnCancelar.removeEventListener("click", cancelar);
  }
  function aceptar() {
    const valor = input.value.trim();
    cerrarModal();
    callback(valor); //Devolvemos el string
  }
  function cancelar() {
    cerrarModal();
    callback(null);//Devolvemos null
  }
  // Lo mismo que para miAlerta
  function teclaCerrar(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      cancelar();
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      aceptar();
    }
  }
  btnAceptar.addEventListener("click", aceptar);
  btnCancelar.addEventListener("click", cancelar);
  overlay.addEventListener("keydown", teclaCerrar);

  input.focus(); //En este caso el focus al input.
}

// Función miConfirm  ----------------------------------------------------------------------------------

function miConfirm(mensaje, callback) {

  const overlay = document.getElementById("modalConfirmOverlay");
  const mensajeP = document.getElementById("modalConfirmMensaje");
  const btnOk = document.getElementById("modalConfirmBtnOk");
  const btnCancel = document.getElementById("modalConfirmBtnCancel");

  if (!overlay || !mensajeP || !btnOk || !btnCancel) return;

  mensajeP.textContent = mensaje;
  overlay.classList.remove("oculto");

  function cerrarModal() {
    overlay.classList.add("oculto");
    btnOk.removeEventListener("click", enOk); //Si preSiono ok nos va a devolver true
    btnCancel.removeEventListener("click", enCancelar); // si es cancelar nos devuelve false
    document.removeEventListener("keydown", teclaCerrar); // Si es enter sera true, si es Escape sera false
  }
  function enOk() {
    cerrarModal();
    if (typeof callback === "function") callback(true);
  }
  function enCancelar() {
    cerrarModal();
    if (typeof callback === "function") callback(false);
  }
  function teclaCerrar(e) {
    if (e.key === "Enter") {
      enOk();
    } else if (e.key === "Escape") {
      enCancelar();
    }
  }
  btnOk.addEventListener("click", enOk);
  btnCancel.addEventListener("click", enCancelar);
  document.addEventListener("keydown", teclaCerrar);

  btnCancel.focus(); //Aca lo ponemos a que por defecto venga en cancelar
}

function cerrarFormularios() {
  const formInicio = document.getElementById("formInicioSesion");
  const formRegistro = document.getElementById("formRegistro");

  formInicio.classList.add("oculto");
  formRegistro.classList.add("oculto");

  //solo si es un formulario lo va a resetear cada vez que lo abra. 
  if (formInicio.tagName === "FORM") formInicio.reset();
  if (formRegistro.tagName === "FORM") formRegistro.reset();
}

// Manejo de usuarios desde localStorage ----------------------------------------------------------------------
function cargarUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(listaUsuarios) {
  localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
  actualizarSaldoEnPantalla(); // Cada vez que llame a guardarUsuarios se actualizan los saldos en pantalla. 
}

//-------------------------------------------------------------------------------------------------------------
function actualizarTitulo() {
  const titulo = document.getElementById("tituloBienvenida");
  if (usuarioActivo && usuarioActivo.nombre && usuarioActivo.apellido && usuarioActivo.sexo) {
    let saludo;
    switch (usuarioActivo.sexo.toLowerCase()) {
      case "m":
        saludo = "Bienvenido";
        break;
      case "f":
        saludo = "Bienvenida";
        break;
      default:
        saludo = "Bienvenid@";
        break;
    }
    titulo.textContent = `${saludo} ${usuarioActivo.nombre} ${usuarioActivo.apellido}`;
  } else {
    titulo.textContent = "Bienvenido";
  }
}
//-------------------------------------------------------------------------------------------------------------

function iniciarSesionDOM(user, pass) {
  let usuarioEncontrado = usuarios.find(u => u.usuario === user);

  if (usuarioEncontrado && usuarioEncontrado.contraseña === pass) {
    usuarioActivo = usuarioEncontrado;
    const saludo = saludarUsuario(usuarioActivo);

    //setTimeOut para retrasar un poquito (siempre en milisegundos)
    setTimeout(() => {
      miAlerta(saludo, () => {
        pantallaLoginRegistro.classList.add("oculto");
        pantallaHomebanking.classList.remove("oculto");
        homebanking(); //Homebanking inicia multiples funciones
      });
    }, 10);

    return true;
  } else {
    setTimeout(() => miAlerta("Usuario o contraseña incorrectos."), 10);
    return false;
  }
}

function registrarUsuarioDOM(data) {
  let { usuario, contraseña, nombre, apellido, sexo, edad } = data;

  if (!validarTexto(nombre, "Nombre", 2, 30, true)) return false;
  if (!validarTexto(apellido, "Apellido", 2, 30, true)) return false;
  if (!validarTexto(usuario, "Usuario", 4, 20, false)) return false;
  if (!validarTexto(contraseña, "Contraseña", 4, 30, false)) return false;
  if (!validarSexo(sexo)) return false;
  if (!validarEdad(edad)) return false;

  if (usuarios.some(u => u.usuario === usuario)) {
    miAlerta("Ese nombre de usuario ya está en uso.");
    return false;
  }
  edad = Number(edad); //este dato no debe ser String

  let alias = generarAlias();
  let nuevoUsuario = {
    usuario,
    contraseña,
    nombre,
    apellido,
    sexo,
    edad,
    saldo: 0,
    saldoDolares: 0,
    saldoEuros: 0,
    saldoReales: 0,
    banco: generarNombreBanco(),
    numeroCuenta: generarNumeroCuenta(),
    fechaRegistro: new Date(obtenerFechaSimulada()),
    alias,
    contactos: [],
    movimientos: [],
    notificaciones: [],
    eventosTemporarios: [],
    servicios: [
      { nombre: "Luz", pagado: true, monto: 0, rango: { min: 15000, max: 50000 }, imagen: "luz.png" },
      { nombre: "Agua", pagado: true, monto: 0, rango: { min: 3000, max: 9000 }, imagen: "agua.png" },
      { nombre: "Gas", pagado: true, monto: 0, rango: { min: 7000, max: 12000 }, imagen: "gas.png" },
      { nombre: "Teléfono", pagado: true, monto: 0, rango: { min: 5000, max: 7000 }, imagen: "telefono.png" },
      { nombre: "Internet", pagado: true, monto: 0, rango: { min: 10000, max: 20000 }, imagen: "internet.png" },
      { nombre: "Impuestos Municipales", pagado: true, monto: 0, rango: { min: 1500, max: 2500 }, imagen: "impuestos.png" },
    ],
    prestamos: [],
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  usuarioActivo = nuevoUsuario;

  miAlerta("¡Registro exitoso!", () => {
    cerrarFormularios();
  });

  return true;
}

//-------------------------------------------------------------------------------------------------------------

function saludarUsuario(usuario) {
  if (usuario.sexo === "M") {
    return `¡Bienvenido ${usuario.nombre} ${usuario.apellido}!`;
  } else if (usuario.sexo === "F") {
    return `¡Bienvenida ${usuario.nombre} ${usuario.apellido}!`;
  } else {
    return `¡Bienvenid@ ${usuario.nombre} ${usuario.apellido}!`;
  }
}

//-------------------------------------------------------------------------------------------------------------

function generarAlias() {
  const palabras = ["sol", "luna", "estrella", "nube", "agua", "fuego", "tierra", "aire", "bosque", "rio",
    "mar", "cielo", "montaña", "trueno", "viento", "lluvia", "flor", "roca", "noche", "dia",
    "hoja", "nieve", "desierto", "volcan", "caverna", "isla", "aurora", "eco", "piedra", "lago"];

  let seleccionadas = [];
  while (seleccionadas.length < 3) {
    let palabra = palabras[Math.floor(Math.random() * palabras.length)]
    // Math random aleatoriza multiplicando en este caso por 30 palabras del array
    // Math floor redondea hacia abajo.
    if (!seleccionadas.includes(palabra)) { // Para evitar que se repitan palabras.
      seleccionadas.push(palabra);
    }
  }
  let alias = seleccionadas.join(".").toUpperCase(); // Unimos con un "." con join y llevo a Mayusculas.
  return alias
}

// Provincias para nombre de bancos 
const provincias = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa",
  "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
  "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

function generarNombreBanco() {
  let provincia = provincias[Math.floor(Math.random() * provincias.length)];
  return `Banco de ${provincia}`;
}

function generarNumeroCuenta() {
  let cuenta = "";
  for (let i = 0; i < 16; i++) {
    cuenta += Math.floor(Math.random() * 10);
  }
  return cuenta;
}

//-------------------------------------------------------------------------------------------------------------

function validarTexto(valor, campo, minLength = 2, maxLength = 30, soloLetras = false) {
  //Expresion regular para que solo me tome letras, ni numeros ni simbolos.
  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!valor) {
    miAlerta(`El campo ${campo} no puede estar vacío.`);
    return false;
  }
  if (valor.length < minLength) {
    miAlerta(`${campo} debe tener al menos ${minLength} caracteres.`);
    return false;
  }
  if (valor.length > maxLength) {
    miAlerta(`${campo} debe tener como máximo ${maxLength} caracteres.`);
    return false;
  }
  if (soloLetras && !regexLetras.test(valor)) {
    miAlerta(`${campo} solo puede contener letras y espacios.`);
    return false;
  }
  return true;
}

function validarSexo(sexo) {
  const valoresValidos = ["M", "F", "Otro"];
  if (!valoresValidos.includes(sexo)) {
    miAlerta("Por favor seleccioná un sexo válido.");
    return false;
  }
  return true;
}

function validarEdad(edad) {
  const edadNum = Number(edad);
  if (!edad || isNaN(edadNum)) {
    miAlerta("Edad inválida.");
    return false;
  }
  if (edadNum < 16) {
    miAlerta("No podés registrarte si tenés menos de 16 años.");
    return false;
  }
  if (edadNum > 120) {
    miAlerta("Edad demasiado alta, revisá el dato.");
    return false;
  }
  return true;
}

//-------------------------------------------------------------------------------------------------------------

function mostrarHistorialModal(usuario) {
  const overlay = document.getElementById("modalMovimientosOverlay");
  const tablaBody = document.querySelector("#tablaMovimientos tbody");

  if (usuario.movimientos.length === 0) {
    miAlerta("No hay movimientos para mostrar.");
    return;
  }

  tablaBody.innerHTML = "";
  //Para cada movimiento se crea una tr, y con sus datos va llenando su td.
  usuario.movimientos.slice().reverse().forEach(mov => { //Los ultimos aparecen primero
    const tr = document.createElement("tr");

    const fechaTd = document.createElement("td");
    fechaTd.textContent = mov.fecha ? new Date(mov.fecha).toLocaleDateString() : "Fecha no disponible";
    //Operador ternario por si no hay una fecha. 

    const descripcionTd = document.createElement("td");
    descripcionTd.textContent = mov.descripcion;

    const montoTd = document.createElement("td");
    const signo = mov.monto >= 0 ? "+$" : "-$";
    montoTd.textContent = `${signo}${Math.abs(mov.monto).toFixed(2)}`;
    montoTd.style.color = mov.monto >= 0 ? "green" : "red";

    const saldoTd = document.createElement("td");
    saldoTd.textContent = `$${mov.saldoResultante.toFixed(2)}`;

    //Se van a ejecutar en orden.
    tr.appendChild(fechaTd);
    tr.appendChild(descripcionTd);
    tr.appendChild(montoTd);
    tr.appendChild(saldoTd);

    //Se crea una nueva fila. 
    tablaBody.appendChild(tr);
  });

  overlay.classList.remove("oculto");
  const btnDescargar = document.getElementById("btnDescargarMovimientos");
  btnDescargar.onclick = () => descargarHistorialPDF(usuario);

  const btnCerrar = document.getElementById("btnCerrarMovimientos");

  // Limpio primero cualquier evento anterior
  const cerrar = () => {
    overlay.classList.add("oculto");
    overlay.removeEventListener("click", clickFuera);
    btnCerrar.removeEventListener("click", cerrar);
  };

  const clickFuera = (e) => {
    if (e.target === overlay) cerrar();
  };

  btnCerrar.addEventListener("click", cerrar);
  overlay.addEventListener("click", clickFuera);
}

function registraMovimiento(descripcion, monto) {
  const movimiento = {
    descripcion: descripcion,
    monto: monto,
    saldoResultante: usuarioActivo.saldo,
    fecha: new Date(obtenerFechaSimulada())
  };

  usuarioActivo.movimientos.push(movimiento);

  // Guardar en localStorage igual
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const index = usuarios.findIndex(u => u.usuario === usuarioActivo.usuario);
  if (index !== -1) {
    usuarios[index] = usuarioActivo;
  } else {
    usuarios.push(usuarioActivo);
  }
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function descargarHistorialPDF(usuario) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.setTextColor(33, 126, 185);
  doc.text("Historial de Movimientos", 20, 20);

  // Usuario
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Cliente: ${usuario.nombre} ${usuario.apellido}`, 20, 28);

  const encabezados = [["Fecha", "Descripción", "Monto", "Saldo"]];

  const filas = usuario.movimientos.slice().reverse().map(mov => {
    const fecha = mov.fecha ? new Date(mov.fecha).toLocaleDateString() : "Sin fecha";
    const descripcion = mov.descripcion;
    const monto = `${mov.monto >= 0 ? "+" : "-"}$${Math.abs(mov.monto).toFixed(2)}`;
    const saldo = `$${mov.saldoResultante.toFixed(2)}`;
    return [fecha, descripcion, monto, saldo];
  });

  // Tabla con pie de página
  doc.autoTable({
    head: encabezados,
    body: filas,
    startY: 35,
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [33, 126, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    willDrawPage: (data) => {
      const { width, height } = doc.internal.pageSize;
      doc.setFontSize(60);
      doc.setTextColor(240, 240, 240); 
      doc.setFont("helvetica", "bold");
      doc.text("HomeBanking", width / 2, height / 2, {
        angle: 45,
        align: "center"
      });
    },
    didDrawPage: (data) => {
      doc.setFontSize(10);
      doc.setTextColor(150);
      const pageHeight = doc.internal.pageSize.height;
      doc.text(`Página ${data.pageNumber}`, data.settings.margin.left, pageHeight - 10);
    }
  });

  // Saldo final
  const saldoFinal = `$${usuario.saldo.toFixed(2)}`;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Saldo actual: ${saldoFinal}`, 20, doc.lastAutoTable.finalY + 10);

  doc.save("historial_movimientos.pdf");
}

//-------------------------------------------------------------------------------------------------------------

function agregarNotificacion(usuario, mensaje) {
  if (!usuario.notificaciones) {
    usuario.notificaciones = [];
  }
  usuario.notificaciones.push({
    mensaje: mensaje,
    leida: false,
    fecha: new Date(obtenerFechaSimulada())
  });
  // Actualizar lista de usuarios y guardar
  const usuarios = cargarUsuarios();
  const index = usuarios.findIndex(u => u.usuario === usuario.usuario);
  if (index !== -1) {
    usuarios[index] = usuario;
    guardarUsuarios(usuarios);
  }
  //Para que aparezcan de inmediato.
  actualizarContadorNotificaciones(usuario);
}

function contarNotificacionesPendientes(usuario) {
  return usuario.notificaciones.filter(numero => !numero.leida).length;
}

function actualizarContadorNotificaciones(usuario) {
  const contador = document.getElementById("contadorNotificaciones");
  const pendientes = contarNotificacionesPendientes(usuario);
  if (pendientes > 0) {
    contador.textContent = pendientes;
    contador.classList.remove("oculto");
  } else {
    contador.classList.add("oculto");
  }
}

function mostrarNotificaciones(usuario) {
  const overlay = document.getElementById("modalNotificacionesOverlay");
  const lista = document.getElementById("listaNotificaciones");
  const btnCerrar = document.getElementById("btnCerrarNotificaciones");

  if (usuario.notificaciones.length === 0) {
    miAlerta("No tienes notificaciones.");
    return;
  }

  lista.innerHTML = "";
  //forEach para cada notificacion un li.
  usuario.notificaciones.slice().reverse().forEach((noti) => {
    const li = document.createElement("li");
    li.textContent = `[${noti.leida ? "Leída" : "Nueva"}] ${noti.mensaje} (${new Date(noti.fecha).toLocaleDateString()})`;
    lista.appendChild(li);
  });

  // Marcar todas como leídas
  usuario.notificaciones.forEach(n => n.leida = true);
  const usuarios = cargarUsuarios();
  const index = usuarios.findIndex(u => u.usuario === usuario.usuario);
  if (index !== -1) {
    usuarios[index] = usuario;
    guardarUsuarios(usuarios);
  }

  actualizarContadorNotificaciones(usuario);
  overlay.classList.remove("oculto");

  // Limpiar y agregar eventos
  function cerrar() {
    overlay.classList.add("oculto");
    btnCerrar.removeEventListener("click", cerrar);
    overlay.removeEventListener("click", clickFuera);
  }

  function clickFuera(e) {
    if (e.target === overlay) cerrar();
  }
  btnCerrar.addEventListener("click", cerrar);
  overlay.addEventListener("click", clickFuera);
}

//-------------------------------------------------------------------------------------------------------------

function depositarSueldo(usuario, evento) {
  const monto = Number(evento.parametros.monto);

  usuario.saldo += monto;
  registraMovimiento("Sueldo mensual", monto);
  agregarNotificacion(usuario, `Se depositó tu sueldo del mes.`);
}

//-------------------------------------------------------------------------------------------------------------

function suscribirseACupones() {
  const yaSuscripto = usuarioActivo.eventosTemporarios?.some(e => e.tipo === "generarCupones");

  if (yaSuscripto) {
    mostrarCuponesModal(usuarioActivo);
    return;
  }

  miConfirm(
    "¿Querés activar la suscripción a la Cuponera? Recibirás un cupón el día 20 de cada mes.",
    (respuesta) => {
      if (respuesta) {
        crearEventoTemporario(usuarioActivo, "generarCupones", { diaDelMes: 20 });
        miAlerta("¡Suscripción activada! Recibirás tu primer cupón el próximo día 20.");
      } else {
        miAlerta("No activaste la suscripción.");
      }
    }
  );
}

function mostrarCuponesModal(usuario) {
  const overlay = document.getElementById("modalCuponesOverlay");
  const contenedor = document.getElementById("contenedorCupones");

  contenedor.innerHTML = ""; // limpiar anteriores

  if (!usuario.cuponera || usuario.cuponera.length === 0) {
    contenedor.innerHTML = "<p>Todavía no tenés cupones disponibles.</p>";
  } else {
    usuario.cuponera.slice().reverse().forEach((cupon) => {
      const div = document.createElement("div");
      div.className = "cupon";

      div.innerHTML = `
        <strong>${cupon.tipo}: ${cupon.valor}</strong>
        <em>${cupon.descripcion}</em>
      `;

      contenedor.appendChild(div);
    });
  }
  overlay.classList.remove("oculto");

  document.getElementById("btnCerrarCupones").addEventListener("click", () => {
    overlay.classList.add("oculto");
  });
}

function generarCupones(usuario, evento, fechaActual) {
  let ultimaFecha = evento.fechaUltimaRevision || usuario.fechaRegistro;

  if (!(ultimaFecha instanceof Date)) { //Si la ultima fecha fue creada con "new Date"
    ultimaFecha = new Date(ultimaFecha);
  }

  const mesesPasados =
    (fechaActual.getFullYear() - ultimaFecha.getFullYear()) * 12 +
    (fechaActual.getMonth() - ultimaFecha.getMonth());

  if (mesesPasados > 0) {
    if (!usuario.cuponera) usuario.cuponera = [];

    const descuentos = ["10%", "15%", "20%", "25%", "30%"];
    const vouchers = ["$5000", "$10000", "$50000", "$200000"];

    for (let i = 0; i < mesesPasados; i++) {
      const esDescuento = Math.random() < 0.5;

      if (esDescuento) {
        const descuento = descuentos[Math.floor(Math.random() * descuentos.length)];
        usuario.cuponera.push({
          tipo: "Descuento",
          valor: descuento,
          descripcion: `${descuento} OFF en Supermercados.`
        });
      } else {
        const voucher = vouchers[Math.floor(Math.random() * vouchers.length)];
        usuario.cuponera.push({
          tipo: "Voucher",
          valor: voucher,
          descripcion: `Voucher de compra por ${voucher}`
        });
      }
    }
  }
}

//-------------------------------------------------------------------------------------------------------------
// Funciones que manejan eventos-------------------------------------------------------------------------------

function crearEventoTemporario(usuario, tipo, parametros) {
  const evento = {
    tipo,
    fechaUltimaRevision: null,
    parametros, // Datos específicos del evento, monto, cantidad de días.
    activo: true
  };
  usuario.eventosTemporarios.push(evento);
  // la función que llame (chequearEventosUsuario) debería guardar luego.
}

function procesarEventoMensual(usuario, evento, fechaActual, funcionEjecutora, diaEjecucion) {
  const ultimaRevision = evento.fechaUltimaRevision || usuario.fechaRegistro || new Date();
  const ultima = new Date(ultimaRevision);

  let mesesPasados =
    (fechaActual.getFullYear() - ultima.getFullYear()) * 12 +
    (fechaActual.getMonth() - ultima.getMonth());

  if (mesesPasados > 0) {
    for (let i = 1; i <= mesesPasados; i++) {
      const fechaEvento = new Date(ultima.getFullYear(), ultima.getMonth() + i, diaEjecucion);

      if (fechaActual >= fechaEvento) {
        if (
          evento.fechaUltimaRevision &&
          new Date(evento.fechaUltimaRevision).getFullYear() === fechaEvento.getFullYear() &&
          new Date(evento.fechaUltimaRevision).getMonth() === fechaEvento.getMonth() &&
          new Date(evento.fechaUltimaRevision).getDate() === fechaEvento.getDate()
        ) {
          continue;
        }
        funcionEjecutora(usuario, evento, fechaEvento);
        evento.fechaUltimaRevision = new Date(fechaEvento);
      }
    }
  }
}

function chequearEventosUsuario(usuario) {
  const fechaActual = obtenerFechaSimulada();

  // Crear evento renovarServicios si no existe para asegurar que siempre se procese
  if (!usuario.eventosTemporarios.some(evento => evento.tipo === "renovarServicios")) {
    crearEventoTemporario(usuario, "renovarServicios", { diaDelMes: 10 });
  }

  procesarPlazoFijo(usuario);
  procesarPlazosFijosVencidos(usuario);

  for (const evento of usuario.eventosTemporarios) {
    if (!evento.activo) continue;

    if (evento.tipo === "pagoSueldo") {
      procesarEventoMensual(usuario, evento, fechaActual, depositarSueldo, 5);
    }
    if (evento.tipo === "generarCupones") {
      procesarEventoMensual(usuario, evento, fechaActual, generarCupones, 20);
    }
    if (evento.tipo === "renovarServicios") {
      procesarEventoMensual(usuario, evento, fechaActual, renovarServicios, 10);
    }
    if (evento.tipo === "pagoPrestamo") {
      procesarEventoMensual(usuario, evento, fechaActual, procesarCuotasPrestamo, 15);
    }
  }
  // Guardar usuario actualizado en localStorage
  const usuarios = cargarUsuarios();
  const index = usuarios.findIndex(u => u.alias === usuario.alias);
  if (index !== -1) {
    usuarios[index] = usuario;
    guardarUsuarios(usuarios);
  }
}

//-------------------------------------------------------------------------------------------------------------

function pagarServicio(usuario, nombreServicio, callback) { //Le paso el callback para que permita cargar carrusel de servicios una vez pagado.
  const servicio = usuario.servicios.find(serv => serv.nombre.toLowerCase() === nombreServicio.toLowerCase());

  if (!servicio) {
    miAlerta(`Servicio ${nombreServicio} no encontrado.`);
    return;
  }
  if (servicio.pagado || servicio.monto <= 0) {
    miAlerta(`No hay deuda para el servicio ${servicio.nombre}.`);
    return;
  }
  if (usuario.saldo < servicio.monto) {
    miAlerta(`Saldo insuficiente para pagar ${servicio.nombre}.`);
    return;
  }

  miConfirm(`¿Deseás pagar el servicio ${servicio.nombre} por $${servicio.monto}?`, (respuesta) => {
    if (!respuesta) return;

    const montoPagado = servicio.monto;

    usuario.saldo -= montoPagado;
    registraMovimiento(`Pago servicio ${servicio.nombre}`, -montoPagado);

    servicio.monto = 0;
    servicio.pagado = true;

    guardarUsuarios(usuarios);
    actualizarSaldoEnPantalla();

    miAlerta(`Has pagado el servicio ${servicio.nombre} por $${montoPagado}.`);

    // Ejecutar callback si se pasó
    if (typeof callback === "function") callback();
  });
}

function pagarTodosLosServicios() {
  const impagos = usuarioActivo.servicios.filter(serv => !serv.pagado && serv.monto > 0);

  if (impagos.length === 0) {
    miAlerta("No hay servicios impagos.");
    return;
  }
  const total = impagos.reduce((acumular, serv) => acumular + serv.monto, 0);

  if (usuarioActivo.saldo < total) {
    miAlerta(`Saldo insuficiente. Total requerido: $${total}`);
    return;
  }

  miConfirm(`¿Deseás pagar los ${impagos.length} servicios por un total de $${total}?`, (respuesta) => {
    if (!respuesta) return;

    impagos.forEach(servicio => {
      usuarioActivo.saldo -= servicio.monto;
      registraMovimiento(`Pago de ${servicio.nombre}`, -servicio.monto);
      servicio.monto = 0;
      servicio.pagado = true;
    });

    guardarUsuarios(usuarios);
    actualizarSaldoEnPantalla();

    miAlerta(`Se pagaron ${impagos.length} servicios por un total de $${total}.`);
    cargarCarruselServicios();
  });
}

function renovarServicios(usuario) {
  const fechaHoy = new Date(obtenerFechaSimulada());
  const evento = usuario.eventosTemporarios.find(evento => evento.tipo === "renovarServicios");
  if (!evento) return;

  let ultimaFecha = evento.fechaUltimaRevision || usuario.fechaRegistro;


  if (!(ultimaFecha instanceof Date)) ultimaFecha = new Date(ultimaFecha);
  if (evento.fechaUltimaRevision && !(evento.fechaUltimaRevision instanceof Date)) {
    evento.fechaUltimaRevision = new Date(evento.fechaUltimaRevision);
    //Si no es instancia de Date se hace acá
  }
  if (
    evento.fechaUltimaRevision &&
    evento.fechaUltimaRevision.getMonth() === fechaHoy.getMonth() &&
    evento.fechaUltimaRevision.getFullYear() === fechaHoy.getFullYear()
  ) {
    return;
  }
  usuario.servicios.forEach(servicio => {
    const { min, max } = servicio.rango;
    const nuevoMonto = Math.floor(Math.random() * (max - min + 1)) + min; // Defino el monto aleatoriamente

    if (servicio.pagado) {
      servicio.monto = nuevoMonto;
      servicio.pagado = false;

      usuario.notificaciones.push({
        mensaje: `Se generó una nueva factura de ${servicio.nombre} por $${nuevoMonto}`,
        fecha: new Date(fechaHoy),
        leida: false
      });
    } else {
      servicio.monto += nuevoMonto;
      // No notificar si no pagó
    }
  });

  evento.fechaUltimaRevision = new Date(fechaHoy);

  // Guardar usuario actualizado
  const usuarios = cargarUsuarios();
  const index = usuarios.findIndex(u => u.usuario === usuario.usuario);
  if (index !== -1) {
    usuarios[index] = usuario;
    guardarUsuarios(usuarios);
  }
  actualizarContadorNotificaciones(usuario);
}


function cargarCarruselServicios() {
  const contenedor = document.getElementById("slider");
  contenedor.innerHTML = "";

  const impagos = usuarioActivo.servicios.filter(serv => !serv.pagado && serv.monto > 0);

  const btnTodos = document.getElementById("btnPagarTodosServicios");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");

  if (impagos.length === 0) {
    //Si no hay servicios por pagar
    contenedor.innerHTML = `<div class="tarjeta-servicio"><p>No hay servicios impagos.</p></div>`;
    btnTodos.style.display = "none";
    btnPrev.style.display = "none";
    btnNext.style.display = "none";
    return;
  }

  btnTodos.style.display = "inline-block";
  btnPrev.style.display = impagos.length > 1 ? "inline-block" : "none";
  btnNext.style.display = impagos.length > 1 ? "inline-block" : "none";

  impagos.forEach(servicio => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-servicio");

    tarjeta.innerHTML = `
      <img src="img/servicios/${servicio.imagen}" alt="${servicio.nombre}">
      <p>${servicio.nombre}</p>
      <p class="monto">$${servicio.monto}</p>
      <button class="btnPagarServicio boton-modal">Pagar</button>
    `;

    tarjeta.querySelector(".btnPagarServicio").addEventListener("click", () => {
      pagarServicio(usuarioActivo, servicio.nombre, () => {
        cargarCarruselServicios();
      });
    });
    contenedor.appendChild(tarjeta);
  });
  //Ajusto el ancho en porcentaje
  contenedor.style.width = `${impagos.length * 100}%`;
  //volvemos a 0%
  indiceSlider = 0;
  contenedor.style.transform = `translateX(0%)`;
}

//-------------------------------------------------------------------------------------------------------------

function crearPlazoFijo(usuario, monto, plazoDias, tasaAnual) {
  if (monto <= 0) {
    miAlerta("El monto debe ser mayor que 0.");
    return;
  }
  if (plazoDias < 30) {
    miAlerta("El plazo mínimo es 30 días.");
    return;
  }
  if (tasaAnual <= 0) {
    miAlerta("La tasa anual debe ser mayor que 0.");
    return;
  }
  if (usuario.saldo < monto) {
    miAlerta("Saldo insuficiente para crear el plazo fijo.");
    return;
  }

  usuario.saldo -= monto;
  registraMovimiento("Creación de plazo fijo", -monto);

  const fechaInicio = new Date(obtenerFechaSimulada());
  const fechaVencimiento = new Date(fechaInicio);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoDias);

  const plazoFijo = {
    monto,
    plazoDias,
    tasaAnual,
    fechaInicio,
    fechaVencimiento,
    interesesAcumulados: 0,
    retirado: false,
    cancelado: false,
    ultimaActualizacion: new Date(fechaInicio),
  };

  usuario.plazosFijos = usuario.plazosFijos || [];
  usuario.plazosFijos.push(plazoFijo);

  guardarUsuarios(usuarios);
  actualizarSaldoEnPantalla();

  miAlerta(`Plazo fijo creado por $${monto} a ${plazoDias} días con una tasa anual de ${tasaAnual}%.`);
}

function retirarPlazoFijo(usuario, index) {
  if (!usuario.plazosFijos || index < 0 || index >= usuario.plazosFijos.length) {
    miAlerta("Plazo fijo no válido.");
    return false;
  }
  const pfijo = usuario.plazosFijos[index];
  const fechaHoy = new Date(obtenerFechaSimulada());

  if (pfijo.retirado) {
    miAlerta("Este plazo fijo ya fue retirado.");
    return false;
  }
  if (pfijo.cancelado) {
    miAlerta("Este plazo fijo fue cancelado.");
    return false;
  }

  // Verifico si cumplió el plazo minimo:
  const diasTranscurridos = Math.floor((fechaHoy - new Date(pfijo.fechaInicio)) / (1000 * 60 * 60 * 24));
  if (diasTranscurridos < 30) {
    miAlerta("No se puede retirar antes de 30 días.");
    return false;
  }
  const total = pfijo.monto + pfijo.interesesAcumulados;
  usuario.saldo += total;
  pfijo.retirado = true;

  registraMovimiento(`Retiro plazo fijo: $${pfijo.monto.toFixed(2)} + intereses: $${pfijo.interesesAcumulados.toFixed(2)}`, total);
  miAlerta(`Plazo fijo retirado. Se acreditaron $${total.toFixed(2)} a tu saldo.`);

  let usuarios = cargarUsuarios();

  const indiceUsuario = usuarios.findIndex(u => u.usuario === usuario.usuario);
  if (indiceUsuario >= 0) {
    usuarios[indiceUsuario] = usuario;
    guardarUsuarios(usuarios);
    actualizarSaldoEnPantalla();
  }
  return true;
}

function cancelarPlazoFijo(usuario, index) {
  if (!usuario.plazosFijos || index < 0 || index >= usuario.plazosFijos.length) {
    miAlerta("Plazo fijo no válido.");
    return false;
  }

  const pfijo = usuario.plazosFijos[index];

  if (pfijo.retirado) {
    miAlerta("Este plazo fijo ya fue retirado.");
    return false;
  }
  if (pfijo.cancelado) {
    miAlerta("Este plazo fijo ya fue cancelado.");
    return false;
  }

  const fechaHoy = new Date(obtenerFechaSimulada());
  const diasTranscurridos = Math.floor((fechaHoy - new Date(pfijo.fechaInicio)) / (1000 * 60 * 60 * 24));

  // Penalización si se cancela antes de 30 dias
  const penalizacion = diasTranscurridos < 30 ? pfijo.monto * 0.05 : 0;
  const montoDevuelto = pfijo.monto - penalizacion;

  usuario.saldo += montoDevuelto;
  pfijo.cancelado = true;

  registraMovimiento(
    `Cancelación de plazo fijo: $${pfijo.monto.toFixed(2)} - penalización: $${penalizacion.toFixed(2)}`,
    montoDevuelto
  );
  miAlerta(`Plazo fijo cancelado. Se devolvieron $${montoDevuelto.toFixed(2)} a tu cuenta.`);

  const usuarios = cargarUsuarios();
  const i = usuarios.findIndex(u => u.alias === usuario.alias);
  if (i !== -1) {
    usuarios[i] = usuario;
    guardarUsuarios(usuarios);
    actualizarSaldoEnPantalla();
  }

  return true;
}

function mostrarPlazosFijos(usuario) {

  const modal = document.getElementById("modalMostrarPlazosOverlay");
  const tbody = document.querySelector("#tablaPlazosFijos tbody");
  tbody.innerHTML = ""; // limpia contenido anterior

  if (!usuario.plazosFijos || usuario.plazosFijos.length === 0) {
    miAlerta("No hay plazos fijos activos.");
    return false;
  }

  const fechaHoy = new Date(obtenerFechaSimulada());
  let hayActivos = false;

  usuario.plazosFijos.forEach((pfijo, i) => {
    if (pfijo.retirado || pfijo.cancelado) return;

    hayActivos = true;
    const diasTranscurridos = Math.floor(
      (fechaHoy - new Date(pfijo.fechaInicio)) / (1000 * 60 * 60 * 24)
    );

    const fila = document.createElement("tr");

    const intereses = Number(pfijo.interesesAcumulados) || 0;
    fila.innerHTML = `
  <td>${i + 1}</td>
  <td>$${pfijo.monto.toFixed(2)}</td>
  <td>${pfijo.plazoDias}</td>
  <td>${pfijo.tasaAnual}%</td>
  <td>$${intereses.toFixed(2)}</td>
  <td>${diasTranscurridos}</td>
`;
    tbody.appendChild(fila);
  });

  if (!hayActivos) {
    miAlerta("No hay plazos fijos activos.");
    return false;
  }

  modalPlazosFijosOverlay.classList.add("oculto");
  modal.classList.remove("oculto");
  return true;
}

function procesarPlazoFijo(usuario) {
  if (!usuario.plazosFijos) return;

  const fechaHoy = new Date(obtenerFechaSimulada());
  let huboCambios = false;

  usuario.plazosFijos.forEach(pfijo => {
    if (pfijo.retirado || pfijo.cancelado) return;
    //chequeo que los datos sean validos
    if (typeof pfijo.interesesAcumulados !== "number") {
      pfijo.interesesAcumulados = 0;
    }
    if (!(pfijo.ultimaActualizacion instanceof Date)) {
      pfijo.ultimaActualizacion = new Date(pfijo.fechaInicio);
    }

    const diasTranscurridos = Math.floor((fechaHoy - new Date(pfijo.ultimaActualizacion)) / (1000 * 60 * 60 * 24));
    if (diasTranscurridos <= 0) return;

    const interesDiario = pfijo.monto * (pfijo.tasaAnual / 100) / 365;
    const interesesNuevos = interesDiario * diasTranscurridos;

    pfijo.interesesAcumulados += interesesNuevos;
    pfijo.ultimaActualizacion = new Date(fechaHoy);
    huboCambios = true;
  });

  if (huboCambios) {
    const usuarios = cargarUsuarios();
    const index = usuarios.findIndex(u => u.alias === usuario.alias);
    if (index !== -1) {
      usuarios[index] = usuario;
      guardarUsuarios(usuarios);
    }
  }
}

function procesarPlazosFijosVencidos(usuario) {
  if (!usuario.plazosFijos) return;

  const fechaHoy = new Date(obtenerFechaSimulada());
  let huboVencimientos = false;

  usuario.plazosFijos.forEach(pfijo => {
    if (pfijo.retirado || pfijo.cancelado) return;

    const diasTotales = Math.floor((fechaHoy - new Date(pfijo.fechaInicio)) / (1000 * 60 * 60 * 24));

    if (diasTotales >= pfijo.plazoDias) {
      const total = pfijo.monto + pfijo.interesesAcumulados;
      usuario.saldo += total;
      pfijo.retirado = true;

      registraMovimiento(`Plazo fijo vencido: +$${pfijo.monto.toFixed(2)} + intereses: +$${pfijo.interesesAcumulados.toFixed(2)}`, total);
      agregarNotificacion(usuario, `Un plazo fijo venció y se acreditaron $${total.toFixed(2)} a tu cuenta.`);
      huboVencimientos = true;
    }
  });

  if (huboVencimientos) {
    const usuarios = cargarUsuarios();
    const index = usuarios.findIndex(u => u.alias === usuario.alias);
    if (index !== -1) {
      usuarios[index] = usuario;
      guardarUsuarios(usuarios);
    }
  }
}

//-------------------------------------------------------------------------------------------------------------

function generarToken(callback) {
  const token = generarTokenAleatorio();
  console.log(token);
  miAlerta(`Tu token de verificación es: ${token}`, () => {
    // Una vez cerrado el miAlerta, abrimos el miPrompt
    miPrompt("Por favor, ingresa el token para continuar:", (ingreso) => {
      if (ingreso === null) {
        miAlerta("Operación cancelada.");
        callback(false);
        return;
      }
      if (ingreso.toUpperCase().trim() === token) {
        miAlerta("Token correcto.", () => callback(true));
      } else {
        miAlerta("Token incorrecto. Volviendo al inicio.", () => callback(false));
      }
    });

  });
}

function generarTokenAleatorio() {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let resultado = "";
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

function verificarCuentaSueldo(usuario) {
  const yaTieneCuentaSueldo = usuario.eventosTemporarios.some(evento => evento.tipo === "pagoSueldo");

  if (yaTieneCuentaSueldo) {
    miAlerta("Ya tenés una cuenta sueldo vinculada.");
    return;
  }

  miConfirm("¿Querés vincular tu cuenta sueldo y recibir tu sueldo automáticamente cada mes?", (respuesta) => {
    if (!respuesta) return;

    const sueldoAleatorio = Math.floor(Math.random() * 300001) + 400000; // entre 400.000 y 700.000
    crearEventoTemporario(usuario, "pagoSueldo", {
      monto: sueldoAleatorio,
      diaDelMes: 5 // Día del pago
    });

    agregarNotificacion(usuario, `Tu cuenta sueldo de ${usuario.banco} ha sido vinculada con Homebanking`);
    // Guardar cambios en localStorage
    const index = usuarios.findIndex(u => u.usuario === usuario.usuario);
    if (index !== -1) {
      usuarios[index] = usuario;
      guardarUsuarios(usuarios);
    }

    miAlerta(`Cuenta sueldo vinculada exitosamente. Monto mensual: $${sueldoAleatorio.toLocaleString()}`);
  });
}

function ingresarDinero() {
  miPrompt("Ingrese el monto en pesos a depositar (máximo $200.000):", (montoString) => {
    const monto = parseFloat(montoString);

    if (isNaN(monto) || monto <= 0) {
      miAlerta("Monto inválido.");
      return;
    }
    if (monto > 200000) {

      miAlerta("El monto excede el límite permitido por operación ($200.000).");
      return;
    }
    const token = generarTokenAleatorio().toUpperCase();
    console.log(token)

    miAlerta(`Tu token de verificación es: ${token}`, () => {
      miPrompt("Por favor, ingresa el token para continuar:", (ingreso) => {
        if (ingreso === null) {
          miAlerta("Operación cancelada.");
          return;
        }
        if (ingreso.trim().toUpperCase() === token) {
          usuarioActivo.saldo += monto;
          registraMovimiento("Ingreso de dinero", monto);

          const index = usuarios.findIndex(u => u.alias === usuarioActivo.alias);
          if (index !== -1) {
            usuarios[index] = usuarioActivo;
            guardarUsuarios(usuarios);
          }
          miAlerta(`Depósito exitoso. Nuevo saldo: $${usuarioActivo.saldo.toFixed(2)}`);
        } else {
          miAlerta("Token incorrecto. Operación cancelada.");
        }
      });
    });
  });
}

//-------------------------------------------------------------------------------------------------------------

function verAliasUsuario() {
  if (!usuarioActivo) return;
  miAlerta(`Tu alias es: ${usuarioActivo.alias}`);
}

function cambiarAliasUsuario() {
  if (!usuarioActivo) return;
  //Expresion regular para que el alias sea PALABRA.PALBRA(.PALABRA )
  const aliasRegex = /^[a-z]+(\.[a-z]+){1,2}$/i;

  miPrompt("Ingresá el nuevo alias (2 o 3 palabras separadas por punto):", (nuevoAlias) => {
    if (!nuevoAlias) {
      miAlerta("No ingresaste un alias.");
      return;
    }
    nuevoAlias = nuevoAlias.trim();

    if (!aliasRegex.test(nuevoAlias)) {
      miAlerta("Alias inválido. Debe tener 2 o 3 palabras separadas por punto. Ej: juan.perez o maria.lopez.diaz");
      return;
    }
    nuevoAlias = nuevoAlias.toUpperCase();

    const aliasEnUso = usuarios.some(u => u.alias === nuevoAlias);
    if (aliasEnUso) {
      miAlerta("Ese alias ya está en uso.");
      return;
    }
    const aliasAnterior = usuarioActivo.alias;
    usuarioActivo.alias = nuevoAlias;
    agregarNotificacion(usuarioActivo, `Alias cambiado de ${aliasAnterior} a ${nuevoAlias}`);

    const index = usuarios.findIndex(u => u.alias === aliasAnterior);
    if (index !== -1) {
      usuarios[index] = usuarioActivo;
      guardarUsuarios(usuarios);
    }
    miAlerta(`Alias actualizado. Tu nuevo alias es: ${nuevoAlias}`);
  });
}

function agregarContactoAUsuario() {
  if (!usuarioActivo) return;

  miPrompt("Ingrese el alias del contacto para agregar:", (aliasContacto) => {
    if (!aliasContacto) {
      miAlerta("Alias inválido.");
      return;
    }
    aliasContacto = aliasContacto.trim().toLowerCase();

    if (!usuarioActivo.contactos) usuarioActivo.contactos = [];

    if (usuarioActivo.contactos.some(cont => cont.alias.toLowerCase() === aliasContacto)) {
      miAlerta("Este contacto ya está en tu lista.");
      return;
    }
    const usuarioBuscado = usuarios.find(u => u.alias.toLowerCase() === aliasContacto);
    if (!usuarioBuscado) {
      miAlerta("No se encontró ningún usuario con ese alias.");
      return;
    }
    const contacto = {
      alias: usuarioBuscado.alias,
      nombre: `${usuarioBuscado.nombre} ${usuarioBuscado.apellido}`,
      banco: usuarioBuscado.banco,
      numeroCuenta: usuarioBuscado.numeroCuenta
    };
    usuarioActivo.contactos.push(contacto);
    agregarNotificacion(usuarioActivo, `Nuevo contacto agregado: ${contacto.nombre}.`);

    const index = usuarios.findIndex(u => u.alias === usuarioActivo.alias);
    if (index !== -1) {
      usuarios[index] = usuarioActivo;
      guardarUsuarios(usuarios);
    }
    miAlerta(`Contacto agregado exitosamente.\n${contacto.nombre}`);
  });
}

function mostrarListaDeContactos() {
  const modalLista = document.getElementById("modalListaContactos");
  const contenedorTabla = document.getElementById("tablaContactos");

  contenedorTabla.innerHTML = ""; // Limpiar contenido previo

  if (!usuarioActivo || !usuarioActivo.contactos || usuarioActivo.contactos.length === 0) {
    contenedorTabla.innerHTML = "<p>No tenés ningún contacto agendado.</p>";
    modalLista.classList.remove("oculto");
    return;
  }

  const tabla = document.createElement("table");
  tabla.className = "tabla-estandar";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Nombre</th>
      <th>Banco</th>
      <th>Nro. Cuenta</th>
    </tr>
  `;
  tabla.appendChild(thead);

  const tbody = document.createElement("tbody");
  usuarioActivo.contactos.forEach(contacto => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${contacto.nombre}</td>
      <td>${contacto.banco}</td>
      <td>${contacto.numeroCuenta}</td>
    `;
    tbody.appendChild(fila);
  });

  tabla.appendChild(tbody);
  contenedorTabla.appendChild(tabla);
  modalLista.classList.remove("oculto");
}

//-------------------------------------------------------------------------------------------------------------

function realizarTransferenciaADestino(usuarioActivo, usuarioDestino) {
  if (usuarioDestino.alias === usuarioActivo.alias) {
    miAlerta("No podés transferirte a vos mismo.");
    return;
  }
  miPrompt("Ingrese el monto a transferir:", (montoString) => {
    const monto = parseFloat(montoString);

    if (isNaN(monto) || monto <= 0) {
      miAlerta("El monto ingresado no es válido.");
      return;
    }
    if (usuarioActivo.saldo < monto) {
      miAlerta("No tenés saldo suficiente para realizar la transferencia.");
      return;
    }
    usuarioActivo.saldo -= monto;
    usuarioDestino.saldo += monto;
    const fecha = obtenerFechaSimulada();

    //Registro movimiento en ambos usuarios.
    usuarioActivo.movimientos.push({
      descripcion: `Transferencia a ${usuarioDestino.nombre} ${usuarioDestino.apellido}`,
      monto: -monto,
      saldoResultante: usuarioActivo.saldo,
      fecha: new Date(fecha)
    });

    usuarioDestino.movimientos.push({
      descripcion: `Transferencia recibida de ${usuarioActivo.nombre} ${usuarioActivo.apellido}`,
      monto: monto,
      saldoResultante: usuarioDestino.saldo,
      fecha: new Date(fecha)
    });

    const usuarios = cargarUsuarios();
    const indexOrigen = usuarios.findIndex(u => u.alias === usuarioActivo.alias);
    const indexDestino = usuarios.findIndex(u => u.alias === usuarioDestino.alias);

    if (indexOrigen !== -1) usuarios[indexOrigen] = usuarioActivo;
    if (indexDestino !== -1) usuarios[indexDestino] = usuarioDestino;

    guardarUsuarios(usuarios);
    generarComprobanteTransferenciaPDF(usuarioActivo, usuarioDestino, monto, fecha);

    // Notificación y alerta
    agregarNotificacion(
      usuarioDestino,
      `Recibiste una transferencia de ${usuarioActivo.nombre} ${usuarioActivo.apellido} por $${monto}.`
    );
    miAlerta(
      `Transferencia realizada:\n` +
      `Monto: $${monto}\n` +
      `A: ${usuarioDestino.nombre} ${usuarioDestino.apellido}\n` +
      `Banco: ${usuarioDestino.banco}\n` +
      `Cuenta: ${usuarioDestino.numeroCuenta}`
    );
  });
}

function transferirPorContacto(usuarioActivo, usuarios) {
  if (!usuarioActivo.contactos || usuarioActivo.contactos.length === 0) {
    miAlerta("No tenés contactos guardados.");
    return;
  }
  const modal = document.getElementById("modalSeleccionContacto");
  const select = document.getElementById("selectContacto");
  const btnConfirmar = document.getElementById("btnConfirmarContacto");
  // limpiar select previo
  select.innerHTML = "";
  // Lleno select con contactos con forEach
  usuarioActivo.contactos.forEach((cont, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = `${cont.nombre} - ${cont.banco}`;
    select.appendChild(option);
  });
  modal.classList.remove("oculto");

  // Evento de confirmación (una sola vez)
  const cuandoConfirmasContacto = () => {
    const index = parseInt(select.value);
    const contactoSeleccionado = usuarioActivo.contactos[index];
    const usuarioDestino = usuarios.find(
      usuario => usuario.alias.toUpperCase() === contactoSeleccionado.alias.toUpperCase()
    );
    if (!usuarioDestino) {
      miAlerta("No se encontró el usuario correspondiente al contacto.");
      return;
    }
    modal.classList.add("oculto");
    // limpiar el listener para evitar múltiples llamadas si se vuelve a abrir
    btnConfirmar.removeEventListener("click", cuandoConfirmasContacto);
    // continuar con la transferencia
    realizarTransferenciaADestino(usuarioActivo, usuarioDestino);
  };
  btnConfirmar.addEventListener("click", cuandoConfirmasContacto);
}

function transferirPorAlias(usuarioActivo) {
  const usuarios = cargarUsuarios();

  miPrompt("Ingrese el alias del destinatario:", (aliasDestinoPrompt) => {
    if (!aliasDestinoPrompt) {
      miAlerta("Alias inválido.");
      return;
    }
    const aliasDestino = aliasDestinoPrompt.trim().toUpperCase();
    const usuarioDestino = usuarios.find(usu => usu.alias.toUpperCase() === aliasDestino);

    if (!usuarioDestino) {
      miAlerta("No se encontró ningún usuario con ese alias.");
      return;
    }
    if (usuarioDestino.alias === usuarioActivo.alias) {
      miAlerta("No podés transferirte a vos mismo.");
      return;
    }
    realizarTransferenciaADestino(usuarioActivo, usuarioDestino);

    const yaEsContacto = usuarioActivo.contactos?.some(
      cont => cont.alias.toUpperCase() === usuarioDestino.alias.toUpperCase()
    );
    if (!yaEsContacto) {
      miConfirm(
        `¿Querés agregar a ${usuarioDestino.nombre} ${usuarioDestino.apellido} como contacto?`,
        (deseaAgregar) => {
          if (deseaAgregar) {
            if (!usuarioActivo.contactos) usuarioActivo.contactos = [];
            usuarioActivo.contactos.push({
              alias: usuarioDestino.alias,
              nombre: usuarioDestino.nombre,
              apellido: usuarioDestino.apellido,
              banco: usuarioDestino.banco,
              numeroCuenta: usuarioDestino.numeroCuenta
            });
            miAlerta("Contacto agregado exitosamente.");
          }
        }
      );
    }
  });
}

function generarComprobanteTransferenciaPDF(origen, destino, monto, fecha) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Estilos generales
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Título
  doc.setFontSize(35);
  doc.setTextColor(33, 126, 185);
  doc.text("Comprobante de Transferencia", 20, 20);

  // Fecha
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha: ${new Date(fecha).toLocaleString()}`, 20, 28);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  // Datos del origen
  doc.text("Emisor:", 20, 40);
  doc.text(`Nombre: ${origen.nombre} ${origen.apellido}`, 30, 48);
  doc.text(`Alias: ${origen.alias}`, 30, 56);
  doc.text(`Banco: ${origen.banco}`, 30, 64);
  doc.text(`Cuenta: ${origen.numeroCuenta}`, 30, 72);

  // Datos del destino
  doc.text("Receptor:", 20, 88);
  doc.text(`Nombre: ${destino.nombre} ${destino.apellido}`, 30, 96);
  doc.text(`Alias: ${destino.alias}`, 30, 104);
  doc.text(`Banco: ${destino.banco}`, 30, 112);
  doc.text(`Cuenta: ${destino.numeroCuenta}`, 30, 120);

  // Monto transferido
  doc.setFontSize(25);
  doc.setTextColor(0, 100, 0);
  doc.text(`Monto transferido: $${monto.toFixed(2)}`, 20, 140);

  doc.save(`comprobante_transferencia_${Date.now()}.pdf`);
}


//-------------------------------------------------------------------------------------------------------------

function actualizarSaldoEnPantalla() {
  const pSaldoPesos = document.getElementById("saldoPesos");
  const iconoOjo = document.getElementById("iconoOjo");

  if (!pSaldoPesos || !usuarioActivo) return;
  // Si el ojo está en modo "mostrar saldo"
  const estaVisible = iconoOjo.alt === "Ocultar saldo";
  if (estaVisible) {
    pSaldoPesos.textContent = `$${usuarioActivo.saldo.toFixed(2)}`;
  } else {
    pSaldoPesos.textContent = "$**********";
  }
}

//-------------------------------------------------------------------------------------------------------------

function solicitarPrestamo(usuario) {
  const tienePrestamoActivo = usuario.prestamos.some(prest => prest.activo);
  if (tienePrestamoActivo) {
    miAlerta("Ya tenés un préstamo activo. Primero tenés que terminar de saldarlo.");
    return;
  }
  miPrompt("¿Cuánto querés solicitar? (Máximo de $500.000)", (montoPrompt) => {
    if (!montoPrompt) return;

    const montoSolicitado = parseInt(montoPrompt);

    if (isNaN(montoSolicitado) || montoSolicitado <= 0 || montoSolicitado > 500000) {
      miAlerta("Monto inválido. Máximo de $500.000.");
      return;
    }
    const interes = 0.4; // 40%
    const cuotasTotales = 12;
    const montoTotalConInteres = Math.round(montoSolicitado * (1 + interes));
    const valorCuota = Math.round(montoTotalConInteres / cuotasTotales);

    const prestamo = {
      montoSolicitado,
      montoTotalConInteres,
      cuotasTotales,
      cuotasPagadas: 0,
      valorCuota,
      fechaInicio: new Date(obtenerFechaSimulada()),
      activo: true
    };
    usuario.prestamos.push(prestamo);
    usuario.saldo += montoSolicitado;

    miAlerta("¡Se aprobó tu préstamo!");
    registraMovimiento("Préstamo acreditado", montoSolicitado);
    agregarNotificacion(usuario, `Se acreditó tu préstamo de $${montoSolicitado}. El valor de cada cuota será $${valorCuota}.`);
    crearEventoTemporario(usuario, "pagoPrestamo", { valorCuota });
    guardarUsuarios(usuarios);
    actualizarSaldoEnPantalla();
  });
}

function mostrarPrestamos(usuario) {
  if (!usuario.prestamos || usuario.prestamos.length === 0) {
    miAlerta("No tenes prestamos.");
    return;
  }
  const prestamo = usuario.prestamos.find(prest => prest.activo);
  if (!prestamo) {
    miAlerta("No tenes prestamos activos ahora mismo.");
    return;
  }
  const cuotasRestantes = prestamo.cuotasTotales - prestamo.cuotasPagadas;
  const deudaRestante = cuotasRestantes * prestamo.valorCuota;

  const mensaje =
    `Préstamo activo:\n` +
    `Monto solicitado: $${prestamo.montoSolicitado}\n` +
    `Monto total con interés: $${prestamo.montoTotalConInteres}\n` +
    `Cuotas totales: ${prestamo.cuotasTotales}\n` +
    `Cuotas restantes: ${cuotasRestantes}\n` +
    `Deuda restante: $${deudaRestante}`;
  miAlerta(mensaje);
}

function procesarCuotasPrestamo(usuario, evento) {
  const prestamo = usuario.prestamos.find(prest => prest.activo);
  if (!prestamo) return;

  const valorCuota = evento.parametros.valorCuota;
  if (usuario.saldo >= valorCuota) {
    usuario.saldo -= valorCuota;
    prestamo.cuotasPagadas++;

    registraMovimiento("Pago de cuota de prestamo", -valorCuota);
    agregarNotificacion(usuario, `Se pagó la cuota ${prestamo.cuotasPagadas}/12.`);

    if (prestamo.cuotasPagadas >= prestamo.cuotasTotales) {
      prestamo.activo = false;
      agregarNotificacion(usuario, "Terminaste de pagar tu préstamo.");
    }
    guardarUsuarios(usuarios);
  } else {
    agregarNotificacion(usuario, "No tenes saldo suficiente para pagar tu cuota. Ingresá dinero.");
  }
}

//-------------------------------------------------------------------------------------------------------------

function eliminarDatosLocalStorage() {
  miConfirm("¿Estás seguro de que querés eliminar todos los datos guardados?", (respuesta) => {
    if (respuesta) {
      localStorage.clear();
      inicializarUsuariosBase()
      miAlerta("Los datos han sido eliminados.");
    }
  });
}

//-------------------------------------------------------------------------------------------------------------

let tasas = {};

// USO de promesas y fetch con la API de DolarApi.com

async function cargarTasasActuales() { // Funcion asincornica, trabaja con promesa try y catch
  const proxy = "https://corsproxy.io/?";
  //Solucion que encontre para poder usar DolarApi ya que me devolvia problema con CORS, este proxy 
  // hace de intermediario para que el navegador no bloquee la solicitud. 
  try {
    const respuestaUSD = await fetch(proxy + "https://dolarapi.com/v1/dolares"); //Hacemos la peticion
    const datosUSD = await respuestaUSD.json(); //La parseo y la guardo en datosUSD
    const dolarOficial = datosUSD.find(item => item.casa === "oficial"); //Dolar oficial en este caso
    tasas.USD = dolarOficial.venta;

    const respuestaCotiz = await fetch(proxy + "https://dolarapi.com/v1/cotizaciones"); //Peticion para euro y real
    const datosCotiz = await respuestaCotiz.json();
    const euro = datosCotiz.find(item => item.moneda === "EUR");
    const real = datosCotiz.find(item => item.moneda === "BRL");
    tasas.EUR = euro.venta;
    tasas.BRL = real.venta;

  } catch (error) {
    console.error("Error cargando tasas:", error);
    tasas = { USD: 1150, EUR: 1310, BRL: 200 }; // Si no cargan desde dolarApi, establece estas
    miAlerta("No se pudieron cargar las tasas. Usando valores por defecto.");
  }
}

const saldosDivisas = {
  USD: "saldoDolares",
  EUR: "saldoEuros",
  BRL: "saldoReales"
};

function manejarCompra(divisa) {
  const tasa = tasas[divisa]; //Dentro de los corchetes la moneda que va a tratarse
  const enPropiedad = saldosDivisas[divisa];
  if (!tasa || !enPropiedad) return miAlerta(`No se encontró información para la divisa "${divisa}".`);
  miPrompt(`¿Cuántos ${divisa} querés comprar?`, (montoStr) => {
    const monto = parseFloat(montoStr);
    if (isNaN(monto) || monto <= 0) return miAlerta("Monto inválido.");
    const costo = monto * tasa;
    if (usuarioActivo.saldo < costo) return miAlerta("No tenés saldo suficiente.");
    usuarioActivo.saldo -= costo;
    usuarioActivo[enPropiedad] = parseFloat(usuarioActivo[enPropiedad]) || 0;
    usuarioActivo[enPropiedad] += monto;
    registraMovimiento(`Compra de ${monto} ${divisa}`, -costo);
    guardarUsuarios(usuarios);
    actualizarSaldoEnPantalla();
    miAlerta(`Compra realizada. Se descontaron $${costo.toFixed(2)}.`);
  });
}

function manejarVenta(divisa) {
  const tasa = tasas[divisa];
  const enPropiedad = saldosDivisas[divisa];

  if (!tasa || !enPropiedad) return miAlerta(`No se encontró información para la divisa "${divisa}".`);

  usuarioActivo[enPropiedad] = parseFloat(usuarioActivo[enPropiedad]) || 0;

  miPrompt(`¿Cuántos ${divisa} querés vender?`, (montoStr) => {
    const monto = parseFloat(montoStr);
    if (isNaN(monto) || monto <= 0) return miAlerta("Monto inválido.");
    if (usuarioActivo[enPropiedad] < monto) return miAlerta(`No tenés suficiente saldo en ${divisa}.`);

    const ganancia = monto * tasa;
    usuarioActivo[enPropiedad] -= monto;
    usuarioActivo.saldo += ganancia;

    registraMovimiento(`Venta de ${monto} ${divisa}`, ganancia);
    guardarUsuarios(usuarios);
    actualizarSaldoEnPantalla();
    miAlerta(`Venta realizada. Se acreditaron $${ganancia.toFixed(2)}.`);
  });
}


function actualizarMontosTarjetas() {
  if (!tasas || Object.keys(tasas).length === 0) return;
  //Por si la api no responde bien. 
  const usdEl = document.getElementById("montoUSD");
  const eurEl = document.getElementById("montoEUR");
  const brlEl = document.getElementById("montoBRL");
  //Cambia el valor por defecto de todas las monedas 
  if (usdEl) usdEl.textContent = `USD - $${tasas.USD.toFixed(2)}`;
  if (eurEl) eurEl.textContent = `EUR - $${tasas.EUR.toFixed(2)}`;
  if (brlEl) brlEl.textContent = `BRL - $${tasas.BRL.toFixed(2)}`;
}

//-------------------------------------------------------------------------------------------------------------

async function cargarClimaDesdeUbicacion() {
  const divClima = document.getElementById("clima-info");
  if (!divClima) return;

  // Muestra la temperatura en el DOM
  function mostrarTemp(ciudad, temp) {
    divClima.textContent = `Temperatura en ${ciudad}: ${temp}°C`;
  }

  // Muestra mensaje de error si no se puede obtener el clima
  function mostrarError() {
    divClima.textContent = "Clima no disponible";
  }

  // Consulta la API de Open-Meteo con las coordenadas y ciudad
  function usarCoords(lat, lon, ciudad) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
      .then(res => res.json())
      .then(data => {
        const temperatura = data.current_weather.temperature;
        mostrarTemp(ciudad, temperatura);
      })
      .catch(err => {
        console.error("Error al cargar clima:", err);
        mostrarError();
      });
  }

  // Si el navegador no soporta geolocalización, usar Córdoba como fallback
  if (!navigator.geolocation) {
    usarCoords(-31.4167, -64.1833, "Córdoba");
    return;
  }

  // Obtener la ubicación del usuario
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Consultar Nominatim (OpenStreetMap) para obtener el nombre de la ciudad
      const nominatimURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      const proxiedURL = `https://corsproxy.io/?${encodeURIComponent(nominatimURL)}`;

      fetch(proxiedURL)
        .then(res => res.json())
        .then(data => {
          const ciudad = data.address.city || data.address.town || data.address.village || "Tu ciudad";
          usarCoords(latitude, longitude, ciudad);
        })
        .catch(() => {
          usarCoords(latitude, longitude, "Tu ciudad");
        });
    },
    () => {
      // Si el usuario deniega el acceso a la ubicación, usar Córdoba como fallback
      usarCoords(-31.4167, -64.1833, "Córdoba");
    }
  );
}

//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

function homebanking() {
  procesarPlazoFijo(usuarioActivo);
  procesarPlazosFijosVencidos(usuarioActivo);
  guardarUsuarios(usuarios); // Para que persista apenas entra
  iniciarRelojSimulado();
  cargarFechaSimulada();
  actualizarContadorNotificaciones(usuarioActivo);
  chequearEventosUsuario(usuarioActivo);
  actualizarTitulo();
}