// Homebanking JavaScript. 

let fechaBaseSimulada = new Date(); // La declaramos al iniciar el programa.
let diasSimulados = 0;
//Estas dos variables manejaran la fecha y la simulación de los dias

let salirPrograma = false
let logueado = false;
let usuarioActivo = null // Lo definimos como una solución para que las acciones 
// de un usuario no afecten a otros y para  no tocar directamente el array usuarios 
// a menos que sea mas explicitamente.

//Provincias que usaremos para el nombre de bancos. 
const provincias = [
    "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba",
    "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa",
    "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
    "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
    "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

//Funciones que manejan el tiempo.

function obtenerFechaSimulada() {
    let fecha = new Date(fechaBaseSimulada);
    fecha.setDate(fecha.getDate() + diasSimulados);
    return fecha
}

function avanzarDias(cantidad) {
    for (let i = 0; i < cantidad; i++) {
        diasSimulados++;
        chequearEventosUsuario(usuarioActivo); //Esto es fundamental para el manejo de eventos temporarios.
    }
    alert(`Se avanzaron ${cantidad} día(s). Nueva fecha: ${obtenerFechaSimulada().toLocaleDateString()}`);
}

function gestionarFechaSimulada() {
    const fechaActual = obtenerFechaSimulada();
    alert(`La fecha simulada actual es ${fechaActual.toLocaleDateString()}`);

    const cantidadDias = parseInt(prompt("¿Cuántos días desea avanzar?"));

    if (!isNaN(cantidadDias) && cantidadDias > 0) {
        avanzarDias(cantidadDias);
    } else {
        alert("Por favor ingrese un número válido de días.");
    }
}

// Base de datos

let usuarios = [
    {
        usuario: "admin",
        contraseña: "1234",
        nombre: "Admi",
        apellido: "Nistrador",
        sexo: "X",
        edad: 30,
        saldo: 500000,
        alias: "ADMI.NISTRADOR",
        banco: "Banco de Córdoba",
        numeroCuenta: 1111111111111111,
        fechaUltimaRevision: new Date(obtenerFechaSimulada()),
        contactos: [],
        movimientos: [
            {
                descripcion: "Deposito inicial",
                monto: 500000,
                saldoResultante: 50000,
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
            { nombre: "Luz", pagado: true, monto: 0, rango: { min: 15000, max: 50000 } },
            { nombre: "Agua", pagado: true, monto: 0, rango: { min: 3000, max: 9000 } },
            { nombre: "Gas", pagado: true, monto: 0, rango: { min: 7000, max: 12000 } },
            { nombre: "Teléfono", pagado: true, monto: 0, rango: { min: 5000, max: 7000 } },
            { nombre: "Internet", pagado: true, monto: 0, rango: { min: 10000, max: 20000 } },
            { nombre: "Impuestos Municipales", pagado: true, monto: 0, rango: { min: 1500, max: 2500 } },
        ],
        prestamos: [],

    }
]


//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------
// FUNCIONES
//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

// Función de transferencia entre usuarios. ---------------------------------------------------------------

function realizarTransferenciaADestino(usuarioActivo, usuarioDestino) {
    if (usuarioDestino.alias === usuarioActivo.alias) {
        alert("No podés transferirte a vos mismo.");
        return;
    }
    const monto = parseFloat(prompt("Ingrese el monto a transferir:"));
    if (isNaN(monto) || monto <= 0) {
        alert("El monto ingresado no es válido.");
        return;
    }
    if (usuarioActivo.saldo < monto) {
        alert("No tenés saldo suficiente para realizar la transferencia.");
        return;
    }
    usuarioActivo.saldo -= monto;
    usuarioDestino.saldo += monto;
    const fecha = obtenerFechaSimulada();

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

    // Agregar notificación usando la función que ya tenés
    agregarNotificacion(
        usuarioDestino,
        `Recibiste una transferencia de ${usuarioActivo.nombre} ${usuarioActivo.apellido} por $${monto}.`
    );

    alert(
        `Transferencia realizada:\n` +
        `Monto: $${monto}\n` +
        `A: ${usuarioDestino.nombre} ${usuarioDestino.apellido}\n` +
        `Banco: ${usuarioDestino.banco}\n` +
        `Cuenta: ${usuarioDestino.numeroCuenta}`
    );
}


function transferirPorContacto(usuarioActivo, usuarios) {
    if (!usuarioActivo.contactos || usuarioActivo.contactos.length === 0) {
        alert("No tenés contactos guardados.");
        return;
    }
    let mensaje = "Elegí un contacto:\n";
    usuarioActivo.contactos.forEach((cont, index) => { //cont = contacto, index = posición
        mensaje += `${index + 1} - ${cont.nombre} ${cont.apellido || ""} (${cont.alias})\n`;
    });
    const opcion = prompt(mensaje);
    const indice = parseInt(opcion) - 1;

    if (isNaN(indice) || indice < 0 || indice >= usuarioActivo.contactos.length) {
        alert("Opción inválida.");
        return;
    }
    const contactoSeleccionado = usuarioActivo.contactos[indice];
    const usuarioDestino = usuarios.find(usuario => usuario.alias.toLowerCase() === contactoSeleccionado.alias.toLowerCase());

    if (!usuarioDestino) {
        alert("No se encontró el usuario correspondiente al contacto.");
        return;
    }
    realizarTransferenciaADestino(usuarioActivo, usuarioDestino);
}

function transferirPorAlias(usuarioActivo, usuarios) {
    const aliasDestino = prompt("Ingrese el alias del destinatario:").trim().toLowerCase(); //.trim elimina espacios
    const usuarioDestino = usuarios.find(usu => usu.alias.toLowerCase() === aliasDestino);

    if (!usuarioDestino) {
        alert("No se encontró ningún usuario con ese alias.");
        return;
    }
    if (usuarioDestino.alias === usuarioActivo.alias) {
        alert("No podés transferirte a vos mismo.");
        return;
    }
    realizarTransferenciaADestino(usuarioActivo, usuarioDestino);

    const yaEsContacto = usuarioActivo.contactos.some(
        cont => cont.alias.toLowerCase() === usuarioDestino.alias.toLowerCase() // .some (como .find) son funciones callback
        // hay que pasarle una funcion como argumento. 
    );
    if (!yaEsContacto) {
        const deseaAgregar = confirm(`Querés agregar a ${usuarioDestino.nombre} ${usuarioDestino.apellido} como contacto?`);
        if (deseaAgregar) {
            usuarioActivo.contactos.push({
                alias: usuarioDestino.alias,
                nombre: usuarioDestino.nombre,
                apellido: usuarioDestino.apellido,
                banco: usuarioDestino.banco,
                numeroCuenta: usuarioDestino.numeroCuenta
            });
            alert("Contacto agregado exitosamente.");
        }
    }
}

function gestionarTransferencias(usuarioActivo, usuarios) {
    while (true) {
        const opcion = prompt(
            "Menú Transferencias:\n" +
            "1 - Transferir por alias\n" +
            "2 - Transferir por contacto\n" +
            "0 - Volver al menú principal"
        );

        if (opcion === null || opcion === "0") break;

        switch (opcion) {
            case "1":
                transferirPorAlias(usuarioActivo, usuarios);
                break;
            case "2":
                transferirPorContacto(usuarioActivo, usuarios);
                break;
            default:
                alert("Opción inválida.");
        }
    }
}


// Funcion de Deposito ------------------------------------------------------------------------------------

function ingresarDinero() {
    const montoString = prompt("Ingrese el monto en pesos a depositar (máximo $200.000):");
    const monto = parseFloat(montoString);

    if (isNaN(monto) || monto <= 0) {
        alert("Monto inválido.");
        return;
    }
    if (monto > 200000) {
        alert("El monto excede el límite permitido por operación ($200.000).");
        return;
    }
    const verificado = generarToken();
    if (!verificado) return;

    usuarioActivo.saldo += monto;

    registraMovimiento("Ingreso de dinero", monto);
    alert(`Depósito exitoso. Nuevo saldo en pesos: $${usuarioActivo.saldo.toFixed(2)}`);
}

// Funciones de Sueldos -----------------------------------------------------------------------------------

function depositarSueldo(usuario, evento) {
    const monto = evento.parametros.monto;
    usuario.saldo += monto;
    registraMovimiento("Sueldo mensual", +monto);
    agregarNotificacion(usuario, `Se depositó tu sueldo del mes.`);
}

function verificarCuentaSueldo(usuario) {
    if (usuario.eventosTemporarios.some(event => event.tipo === "pagoSueldo")) return; // Si ya tiene el evento cuenta sueldo return.

    const deseaCuentaSueldo = confirm("Querés vincular tu cuenta sueldo y recibir tu sueldo automáticamente cada mes?");
    if (deseaCuentaSueldo) {
        const sueldoAleatorio = Math.floor(Math.random() * 300001) + 400000; // entre $700.000 y $1.000.000
        crearEventoTemporario(usuario, "pagoSueldo", {
            monto: sueldoAleatorio,
            diaDelMes: 5 // Dia que cobra
        });
        agregarNotificacion(usuario, `Tu cuenta sueldo de ${usuario.banco} ha sido vinculada con Homebanking`);
    }
}

function generarToken() {
    const token = Math.floor(10000 + Math.random() * 90000);
    alert("Tu token de verificación es: " + token);

    const ingreso = prompt("Por favor, ingresa el token para continuar:");

    if (ingreso === token.toString()) {
        alert("Token correcto.");
        return true;
    } else {
        alert("Token incorrecto. Volviendo al inicio.");
        return false;
    }
}

// Funciones de Descuentos -------------------------------------------------------------------------------

function generarCupones(usuario, evento, fechaActual) {
    const ultima = evento.fechaUltimaRevision || usuario.fechaRegistro; //Buscamos fecha de referencia

    const mesesPasados =
        (fechaActual.getFullYear() - ultima.getFullYear()) * 12 + //Desde la fecha Actual restamos años con años
        (fechaActual.getMonth() - ultima.getMonth()); // y meses con meses, para ver cuantos meses pasaron. 

    if (mesesPasados > 0) {
        for (let i = 0; i < mesesPasados; i++) { //Entonces genero un cupón por cada mes que pasó. 

            const descuentos = ["10%", "15%", "20%", "25%", "30%"];
            const vouchers = ["$5000", "$10000", "$50000", "$200000"];
            const esDescuento = Math.random() < 0.5;

            let cupon;
            if (esDescuento) {
                const porcentaje = descuentos[Math.floor(Math.random() * descuentos.length)];
                cupon = { tipo: "Descuento", valor: porcentaje, descripcion: `${porcentaje} OFF en Supermercados.` };
            } else {
                const monto = vouchers[Math.floor(Math.random() * vouchers.length)];
                cupon = { tipo: "Voucher", valor: monto, descripcion: `Voucher de compra por ${monto}` };
            }

            if (!usuario.cuponera) usuario.cuponera = []; // Agregar a la cuponera (crearla si no existe)
            usuario.cuponera.push(cupon);
        }
        evento.fechaUltimaRevision = new Date(fechaActual);
        agregarNotificacion(usuario, `Se generaron ${mesesPasados} cupón(es) nuevos en tu cuponera.`);
    }
}

function mostrarCuponera() {
    const yaTieneEvento = usuarioActivo.eventosTemporarios.some(evento => evento.tipo === "generarCupones");

    if (!yaTieneEvento) {
        const activar = confirm("Queres activar la suscripción a Homebanking? Recibirás un cupón el día 20 de cada mes.");
        if (activar) {
            crearEventoTemporario(usuarioActivo, "generarCupones", { diaDelMes: 20 });
            alert("Suscripción activada! Recibirás tu primer cupón el próximo día 20.");
        } else {
            alert("No activaste la suscripción.");
            return;
        }
    }

    if (usuarioActivo.cuponera && usuarioActivo.cuponera.length > 0) {
        let lista = "Tus cupones:\n\n";
        for (const cupon of usuarioActivo.cuponera) {
            lista += `${cupon.tipo}: ${cupon.valor} en Supermercados.\n`;
        }
        alert(lista);
    } else {
        alert("Todavía no tenés cupones.");
    }
}

// Funciones de Servicios --------------------------------------------------------------------------

function renovarServicios(usuario) {
    const fechaHoy = new Date(obtenerFechaSimulada());
    const evento = usuario.eventosTemporarios.find(evento => evento.tipo === "renovarServicios");

    if (!evento) return;
    // Evitar procesar más de una vez por mes
    if (evento.fechaUltimaRevision &&
        evento.fechaUltimaRevision.getMonth() === fechaHoy.getMonth() &&
        evento.fechaUltimaRevision.getFullYear() === fechaHoy.getFullYear()) {
        return;
    }
    usuario.servicios.forEach(servicio => {
        const { min, max } = servicio.rango;
        const nuevoMonto = Math.floor(Math.random() * (max - min + 1)) + min; // Aca generamos el monto de cada factura 
        // con forEach que es una funcion callback.
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
            // NO generar notificación si no pagó la anterior para no hacer mil notificaciones.
        }
    });
    evento.fechaUltimaRevision = new Date(fechaHoy);
}

function verServiciosImpagos() {
    const impagos = usuarioActivo.servicios.filter(serv => !serv.pagado && serv.monto > 0); //.filter es una función callback
    if (impagos.length === 0) {
        alert("No hay servicios impagos.");
        return;
    }
    let mensaje = "Servicios impagos:\n";
    impagos.forEach((serv, i) => { // i para enumerar (+1).
        mensaje += `${i + 1}. ${serv.nombre}: $${serv.monto}\n`;
    });
    alert(mensaje);
}


function pagarServicio(usuario, nombreServicio) {
    const servicio = usuario.servicios.find(serv => serv.nombre.toLowerCase() === nombreServicio.toLowerCase());

    if (!servicio) {
        alert(`Servicio ${nombreServicio} no encontrado.`);
        return;
    }
    if (servicio.pagado || servicio.monto <= 0) {
        alert(`No hay deuda para el servicio ${servicio.nombre}.`);
        return;
    }
    if (usuario.saldo < servicio.monto) {
        alert(`Saldo insuficiente para pagar ${servicio.nombre}.`);
        return;
    }
    const confirmar = confirm(`¿Deseás pagar el servicio ${servicio.nombre} por $${servicio.monto}?`);

    if (!confirmar) return;

    const montoPagado = servicio.monto;

    usuario.saldo -= montoPagado;
    registraMovimiento(`Pago servicio ${servicio.nombre}`, -montoPagado);

    servicio.monto = 0;
    servicio.pagado = true;

    alert(`Has pagado el servicio ${servicio.nombre} por $${montoPagado}.`);
}

function pagarTodosLosServicios() {
    const impagos = usuarioActivo.servicios.filter(serv => !serv.pagado && serv.monto > 0);

    if (impagos.length === 0) {
        alert("No hay servicios impagos.");
        return;
    }
    const total = impagos.reduce((acumular, serv) => acumular + serv.monto, 0); //Funcion callback para 
    // acumular un resultado a lo largo del array (en este caso servicios.)
    if (usuarioActivo.saldo < total) {
        alert(`Saldo insuficiente. Total requerido: $${total}`);
        return;
    }
    const confirmar = confirm(`¿Deseás pagar los ${impagos.length} servicios por un total de $${total}?`);

    if (!confirmar) return; // vuelve a gestionarServicios

    impagos.forEach(servicio => {
        usuarioActivo.saldo -= servicio.monto;
        registraMovimiento(`Pago de ${servicio.nombre}`, -servicio.monto);
        servicio.monto = 0;
        servicio.pagado = true;
    });

    alert(`Se pagaron ${impagos.length} servicios por un total de $${total}.`);
}

function gestionarServicios(usuarioActivo) {
    while (true) {
        const opcion = prompt(
            "Pagar Servicios:\n" +
            "1. Ver servicios impagos\n" +
            "2. Pagar un servicio\n" +
            "3. Pagar todos los servicios\n" +
            "0. Salir\n\n" +
            "Ingrese opción:"
        );

        if (opcion === null || opcion === "0") break;

        switch (opcion) {
            case "1":
                verServiciosImpagos();
                break;

            case "2":
                const nombreServicio = prompt("Ingrese el nombre del servicio a pagar:");
                if (nombreServicio) pagarServicio(usuarioActivo, nombreServicio.trim());
                break;

            case "3":
                pagarTodosLosServicios();
                break;

            default:
                alert("Opción inválida. Intente de nuevo.");
        }
    }
}


// Funciones de Plazo fijo ------------------------------------------------------------------------------------

function crearPlazoFijo(usuario, monto, plazoDias, tasaAnual) {
    if (monto <= 0) {
        alert("El monto debe ser mayor que 0.");
        return;
    }
    if (plazoDias < 30) {
        alert("El plazo mínimo es 30 días.");
        return;
    }
    if (tasaAnual <= 0) {
        alert("La tasa anual debe ser mayor que 0.");
        return;
    }
    if (usuario.saldo < monto) {
        alert("Saldo insuficiente para crear el plazo fijo.");
        return;
    }

    usuario.saldo -= monto;
    registraMovimiento(`Creación de plazo fijo: `, -monto);

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

    alert(`Plazo fijo creado por $${monto} a ${plazoDias} días con tasa anual de ${tasaAnual}%.`);
}


function procesarPlazoFijo(usuario) {
    if (!usuario.plazosFijos) return;

    const fechaHoy = new Date(obtenerFechaSimulada());

    usuario.plazosFijos.forEach(pfijo => {
        if (pfijo.retirado || pfijo.cancelado) return;

        const diasTranscurridos = Math.floor((fechaHoy - pfijo.ultimaActualizacion) / (1000 * 60 * 60 * 24));
        if (diasTranscurridos <= 0) return;

        const interesDiario = pfijo.monto * (pfijo.tasaAnual / 100) / 365;
        const interesesNuevos = interesDiario * diasTranscurridos;

        pfijo.interesesAcumulados += interesesNuevos;
        pfijo.ultimaActualizacion = new Date(fechaHoy);
    });
}

function procesarPlazosFijosVencidos(usuario) {
    if (!usuario.plazosFijos) return;

    const fechaHoy = new Date(obtenerFechaSimulada());

    usuario.plazosFijos.forEach(pfijo => {
        if (pfijo.retirado || pfijo.cancelado) return;

        const diasTotales = Math.floor((fechaHoy - new Date(pfijo.fechaInicio)) / (1000 * 60 * 60 * 24));

        if (diasTotales >= pfijo.plazoDias) {
            // Ya cumplió el plazo
            const total = pfijo.monto + pfijo.interesesAcumulados;
            usuario.saldo += total;
            pfijo.retirado = true;

            registraMovimiento(`Plazo fijo vencido: +$${pfijo.monto.toFixed(2)} + intereses: +$${pfijo.interesesAcumulados.toFixed(2)}`, total);
        }
    });
}

function retirarPlazoFijo(usuario, index) {
    if (!usuario.plazosFijos || index < 0 || index >= usuario.plazosFijos.length) {
        alert("Plazo fijo no válido.");
        return false;
    }
    const pfijo = usuario.plazosFijos[index];
    const fechaHoy = new Date(obtenerFechaSimulada());

    if (pfijo.retirado) {
        alert("Este plazo fijo ya fue retirado.");
        return false;
    }
    if (pfijo.cancelado) {
        alert("Este plazo fijo fue cancelado.");
        return false;
    }

    // Verificamos si cumplió el plazo mínimo:
    const diasTranscurridos = Math.floor((fechaHoy - pfijo.fechaInicio) / (1000 * 60 * 60 * 24));
    if (diasTranscurridos < 30) {
        alert("No se puede retirar antes de 30 días.");
        return false;
    }
    const total = pfijo.monto + pfijo.interesesAcumulados;
    usuario.saldo += total;
    // Marcamos como retirado
    pfijo.retirado = true;

    registraMovimiento(`Retiro plazo fijo: $${pfijo.monto.toFixed(2)} + intereses: $${pfijo.interesesAcumulados.toFixed(2)}`, total);
    alert(`Plazo fijo retirado. Se acreditaron $${total.toFixed(2)} a tu saldo.`);
    return true;
}


function mostrarPlazosFijos(usuario) {
    procesarPlazosFijosVencidos(usuario); //este llamado se asegura de actualizar primero

    if (!usuario.plazosFijos || usuario.plazosFijos.length === 0) {
        alert("No hay plazos fijos activos.");
        return false;
    }

    const fechaHoy = new Date(obtenerFechaSimulada());
    let mensaje = "Plazos fijos activos:\n";
    let hayActivos = false;

    usuario.plazosFijos.forEach((pfijo, i) => {
        if (pfijo.retirado || pfijo.cancelado) return;

        hayActivos = true;
        const diasTranscurridos = Math.floor((fechaHoy - new Date(pfijo.fechaInicio)) / (1000 * 60 * 60 * 24));

        mensaje += `${i + 1}. Monto: $${pfijo.monto.toFixed(2)}, Plazo: ${pfijo.plazoDias} días, ` +
            `Tasa anual: ${pfijo.tasaAnual}%, Intereses acumulados: $${pfijo.interesesAcumulados.toFixed(2)}, ` +
            `Días transcurridos: ${diasTranscurridos}\n`;
    });
    if (!hayActivos) {
        alert("No hay plazos fijos activos.");
        return false;
    }
    alert(mensaje);
    return true;
}

function cancelarPlazoFijo(usuario, index) {
    if (!usuario.plazosFijos || index < 0 || index >= usuario.plazosFijos.length) {
        alert("Plazo fijo no válido.");
        return false;
    }
    const pfijo = usuario.plazosFijos[index];
    if (pfijo.retirado) {
        alert("Este plazo fijo ya fue retirado.");
        return false;
    }
    if (pfijo.cancelado) {
        alert("Este plazo fijo ya fue cancelado.");
        return false;
    }
    // Solo devuelve el monto original sin intereses
    usuario.saldo += pfijo.monto;
    pfijo.cancelado = true;

    registraMovimiento(`Cancelación plazo fijo: $${pfijo.monto.toFixed(2)}`, pfijo.monto);
    alert(`Plazo fijo cancelado. Se devolvió $${pfijo.monto.toFixed(2)} a su saldo.`);
    return true;
}

function gestionarPlazoFijo() {
    let opcionPF;

    do {
        opcionPF = prompt(`
      --- Plazo Fijo ---
      1. Crear plazo fijo
      2. Mostrar plazos fijos activos
      3. Retirar plazo fijo
      4. Cancelar plazo fijo (sin intereses)
      0. Volver al menú principal
    `);
        switch (opcionPF) {
            case "1":
                const monto = parseFloat(prompt("Ingrese monto para plazo fijo:"));
                const plazo = parseInt(prompt("Ingrese plazo en días (mínimo 30):"));
                const tasa = parseFloat(prompt("Ingrese tasa anual (%):"));
                crearPlazoFijo(usuarioActivo, monto, plazo, tasa);
                break;
            case "2":
                mostrarPlazosFijos(usuarioActivo);
                break;
            case "3":
                if (!mostrarPlazosFijos(usuarioActivo)) break;
                const numeroRetiro = parseInt(prompt("Ingrese número de plazo fijo a retirar:")) - 1;
                // -1 para que si le pedimos el indice 0 lo podamos pasar como 1, mas amistoso para el usuario.
                if (!retirarPlazoFijo(usuarioActivo, numeroRetiro)) {
                    alert("No se pudo retirar el plazo fijo.");
                }
                break;
            case "4":
                if (!mostrarPlazosFijos(usuarioActivo)) break;
                const numeroCancelar = parseInt(prompt("Ingrese número de plazo fijo a cancelar:")) - 1;
                if (!cancelarPlazoFijo(usuarioActivo, numeroCancelar)) {
                    alert("No se pudo cancelar el plazo fijo.");
                }
                break;
            case "0":
                break;
            default:
                alert("Opción inválida.");
        }

    } while (opcionPF !== "0");
}

// Funciones de Prestamos ---------------------------------------------------------------------------

function solicitarPrestamo(usuario) {
    const tienePrestamoActivo = usuario.prestamos.some(prest => prest.activo); //Chequeamos que no tenga un prestamo ya
    if (tienePrestamoActivo) {
        alert("Ya tenes un prestamo activo, primero tenes que terminar de saldarlo.");
        return
    }
    const montoInput = prompt("Cuanto queres solicitar? (Máximo de $500.000)");
    if (!montoInput) return
    const montoSolicitado = parseInt(montoInput); //Lo vuelvo numero.

    if (isNaN(montoSolicitado) || montoSolicitado <= 0 || montoSolicitado > 500000) {
        alert("Monto invalido. Maximo de $500.000");
        return
    }

    const interes = 0.4; //40% para todos.
    const cuotasTotales = 12;
    const montoTotalConInteres = Math.round(montoSolicitado * (1 + interes)); // Math.round para redondear
    const valorCuota = Math.round(montoTotalConInteres / cuotasTotales)
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

    alert("Se aprobó tu prestamo!");
    registraMovimiento("Prestamo acreditado", montoSolicitado);
    agregarNotificacion(usuario, `Se acredito tu prestamo de $${montoSolicitado} El valor de cada cuota será $${valorCuota}. `);
    crearEventoTemporario(usuario, "pagoPrestamo", { valorCuota });
}


function procesarCuotasPrestamo(usuario, evento) {
    const prestamo = usuario.prestamos.find(prest => prest.activo);
    if (!prestamo) return;

    const valorCuota = evento.parametros.valorCuota;
    if (usuario.saldo >= valorCuota) {
        usuario.saldo -= valorCuota;
        prestamo.cuotasPagadas++;

        registraMovimiento("Pago de cuota de prestamo", -valorCuota);
        agregarNotificacion(usuario, `Se pago la cuota ${prestamo.cuotasPagadas}/12.`);

        if (prestamo.cuotasPagadas >= prestamo.cuotasTotales) {
            prestamo.activo = false;
            agregarNotificacion(usuario, "Terminaste de pagar tu préstamo.");
        }
    } else {
        agregarNotificacion(usuario, "No tenes saldo suficiente para pagar tu cuota. Ingresá dinero.");
    }
}

function mostrarPrestamos(usuario) {
    if (!usuario.prestamos || usuario.prestamos.length === 0) {
        alert("No tenes prestamos.");
        return;
    }
    const prestamo = usuario.prestamos.find(prest => prest.activo);
    if (!prestamo) {
        alert("No tenes prestamos activos ahora mismo.");
        return;
    }
    const cuotasRestantes = prestamo.cuotasTotales - prestamo.cuotasPagadas;
    const deudaRestante = cuotasRestantes * prestamo.valorCuota;

    alert(
        `Préstamo activo:\n` +
        `Monto solicitado: $${prestamo.montoSolicitado}\n` +
        `Monto total con interés: $${prestamo.montoTotalConInteres}\n` +
        `Cuotas totales: ${prestamo.cuotasTotales}\n` +
        `Cuotas restantes: ${cuotasRestantes}\n` +
        `Deuda restante: $${deudaRestante}`
    )
}

function gestionarPrestamos(usuario) {
    if (!usuario.prestamos || usuario.prestamos.length === 0) {
        alert("No tiene préstamos activos.");
    }

    let opcion;
    do {
        opcion = prompt(
            "Seleccione una opción de préstamos:\n" +
            "1 - Solicitar préstamo\n" +
            "2 - Ver estado del préstamo\n" +
            "0 - Salir"
        );
        if (!opcion) break;
        opcion = opcion.trim();

        switch (opcion) {
            case "1":
                solicitarPrestamo(usuario);
                break;
            case "2":
                if (!usuario.prestamos || usuario.prestamos.length === 0) {
                    alert("No tiene préstamos activos.");
                } else {
                    mostrarPrestamos(usuario);
                }
                break;
            case "0":
                // Salir del menú
                break;
            default:
                alert("Opción inválida.");
        }
    } while (opcion !== "0");
}

// Funciones de Notificaciones ----------------------------------------------------------------------

function agregarNotificacion(usuario, mensaje) {
    usuario.notificaciones.push({
        mensaje: mensaje,
        leida: false, //Marcamos si el usuario la vio o no.
        fecha: new Date(obtenerFechaSimulada()) //Fecha simulada.
    });
}

function contarNotificacionesPendientes(usuario) {
    return usuario.notificaciones.filter(noti => !noti.leida).length;
    // FILTRAMOS solo las notificaciones no leidas dentro de ese usuario
}

function mostrarNotificaciones(usuario) {
    const pendientes = contarNotificacionesPendientes(usuario);
    //vemos cuantas notificaciones tiene el usuario y la guardamos en pendientes.
    if (usuario.notificaciones.length === 0) {
        alert("No tienes notificaciones.");
        return
    }
    let texto = `Tienes ${pendientes} notificación(es) pendiente(s):\n\n`; //En texto guardaremos todo lo que se mostrara:
    usuario.notificaciones.slice().reverse().forEach((n, i) => { // n representa cada notificacion, i representa la posicion o indice
        texto += `${i + 1}. [${n.leida ? "Leída" : "Nueva"}] ${n.mensaje} (${n.fecha.toLocaleDateString()})\n`;
    });
    alert(texto)
    //Marcamos como leidas una vez se mostraron. 
    usuario.notificaciones.forEach(n => n.leida = true)
}

// Funciones de Historial --------------------------------------------------------------------------------------

function registraMovimiento(descripcion, monto) {
    usuarioActivo.movimientos.push({
        descripcion: descripcion,
        monto: monto,
        saldoResultante: usuarioActivo.saldo,
        fecha: new Date(obtenerFechaSimulada())
    })
}

function mostrarHistorial(usuario) {
    if (usuario.movimientos.length === 0) {
        alert("No hay movimientos para mostrar.");
        return
    }
    let mensaje = "Historial de movimientos:\n"; //Si hay movimientos se agregaran aqui. 

    usuario.movimientos.slice().reverse().forEach(mov => { // Usé slice para hacer reverse sin modificar el array.
        let fechaString = mov.fecha.toLocaleDateString(); //Fecha a formato legible.
        let signo = mov.monto >= 0 ? "+$" : "-$"; //Operador ternario
        mensaje += `${fechaString} - ${mov.descripcion}: ${signo}${Math.abs(mov.monto.toFixed(2))} - Saldo: $${mov.saldoResultante.toFixed(2)}\n`;
        //Math.abs hace que el movimiento se muestre sin signo el cual tengo que pasar en los parametros.  
    });

    alert(mensaje)
}

// Funcion de Divisas ------------------------------------------------------------------------------------------

function gestionarDivisas() {
    const tipoOperacion = prompt(
        "Gestión de Divisas:\n" +
        "1 - Comprar divisas\n" +
        "2 - Vender divisas\n" +
        "0 - Volver"
    );
    if (tipoOperacion === "0" || tipoOperacion === null) return;

    const divisa = prompt("Ingrese la divisa (USD, EUR o BRL):").toUpperCase();

    if (!["USD", "EUR", "BRL"].includes(divisa)) {
        alert("Divisa no válida.");
        return;
    }
    // Agregar mostrar saldo si es operación de venta
    if (tipoOperacion === "2") {
        let saldoDivisa = 0;
        if (divisa === "USD") saldoDivisa = usuarioActivo.saldoDolares || 0;
        if (divisa === "EUR") saldoDivisa = usuarioActivo.saldoEuros || 0;
        if (divisa === "BRL") saldoDivisa = usuarioActivo.saldoReales || 0;
        alert(`Tu saldo en ${divisa} es de ${saldoDivisa.toFixed(2)}.`);
    }
    const monto = parseFloat(prompt("Ingrese el monto a operar"));

    if (isNaN(monto) || monto <= 0) {
        alert("Monto inválido.");
        return;
    }
    const tasas = {
        USD: 1150,
        EUR: 1310,
        BRL: 200
    };
    const equivalenteEnPesos = monto * tasas[divisa];
    // Inicializa saldo si no existe
    if (usuarioActivo.saldoDolares === undefined) usuarioActivo.saldoDolares = 0;
    if (usuarioActivo.saldoEuros === undefined) usuarioActivo.saldoEuros = 0;
    if (usuarioActivo.saldoReales === undefined) usuarioActivo.saldoReales = 0;

    if (tipoOperacion === "1") {
        if (usuarioActivo.saldo < equivalenteEnPesos) {
            alert("No tenés saldo suficiente en pesos.");
            return;
        }
        usuarioActivo.saldo -= equivalenteEnPesos;

        if (divisa === "USD") usuarioActivo.saldoDolares += monto;
        if (divisa === "EUR") usuarioActivo.saldoEuros += monto;
        if (divisa === "BRL") usuarioActivo.saldoReales += monto;

        registraMovimiento(`Compra de ${monto} ${divisa}`, -equivalenteEnPesos);
        alert(`Compra realizada con éxito. Se descontaron $${equivalenteEnPesos.toFixed(2)}.`);

    } else if (tipoOperacion === "2") {
        let saldoDivisa = 0;
        if (divisa === "USD") saldoDivisa = usuarioActivo.saldoDolares;
        if (divisa === "EUR") saldoDivisa = usuarioActivo.saldoEuros;
        if (divisa === "BRL") saldoDivisa = usuarioActivo.saldoReales;

        if (saldoDivisa < monto) {
            alert(`No tenés suficiente saldo en ${divisa}.`);
            return;
        }
        const confirmar = confirm(
            `Estás por vender ${monto} ${divisa}, lo que en pesos son $${equivalenteEnPesos.toFixed(2)}.\n` +
            "¿Deseás continuar?"
        );
        if (!confirmar) return;

        if (divisa === "USD") usuarioActivo.saldoDolares -= monto;
        if (divisa === "EUR") usuarioActivo.saldoEuros -= monto;
        if (divisa === "BRL") usuarioActivo.saldoReales -= monto;

        usuarioActivo.saldo += equivalenteEnPesos;
        registraMovimiento(`Venta de ${monto} ${divisa}`, equivalenteEnPesos);
        alert(`Venta realizada con éxito. Se acreditaron $${equivalenteEnPesos.toFixed(2)}.`);
    }
}

// Funciones de Contactos --------------------------------------------------------------------------------------

function agregarContactoAUsuario(usuarioActivo, aliasContacto) {
    aliasContacto = aliasContacto.trim().toLowerCase();

    if (!usuarioActivo.contactos) {
        usuarioActivo.contactos = []; // Creamos el array si no existe
    }
    if (usuarioActivo.contactos.some(cont => cont.alias.toLowerCase() === aliasContacto)) {
        alert("Este contacto ya está en tu lista.");
        return;
    }
    const usuarioBuscado = usuarios.find(usuario => usuario.alias.toLowerCase() === aliasContacto);

    if (!usuarioBuscado) {
        alert("No se encontró ningún usuario con ese alias.");
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
    alert(`Contacto agregado exitosamente.\n${contacto.nombre}.`);
}

function verContactosDeUsuario(usuarioActivo) {
    if (!usuarioActivo.contactos || usuarioActivo.contactos.length === 0) {
        alert("No tenés ningún contacto agendado.");
        return;
    }
    let mensaje = "Tus contactos:\n";
    usuarioActivo.contactos.forEach(cont => {
        mensaje += `${cont.nombre} | ${cont.banco} | ${cont.numeroCuenta}\n`;
    });
    alert(mensaje);
}

function gestionarContactos(usuarioActivo, usuarios) {
    while (true) {
        const opcionContactos = prompt(
            "Menú Contactos:\n" +
            "1 - Agendar contacto\n" +
            "2 - Ver contactos\n" +
            "3 - Ver alias\n" +
            "4 - Cambiar alias\n" +
            "0 - Volver al menú principal"
        );

        if (opcionContactos === null || opcionContactos === "0") break;

        switch (opcionContactos) {
            case "1":
                const alias = prompt("Ingrese el alias del contacto para agregar:");
                if (alias) {
                    agregarContactoAUsuario(usuarioActivo, alias);
                } else {
                    alert("Alias inválido.");
                }
                break;
            case "2":
                verContactosDeUsuario(usuarioActivo);
                break;
            case "3":
                verAliasUsuario(usuarioActivo);
                break;
            case "4":
                const cambiado = cambiarAliasUsuario(usuarioActivo, usuarios);
                if (!cambiado) {
                    alert("No se cambió el alias.");
                }
                break;
            default:
                alert("Opción inválida.");
        }
    }
}

// Funciones de Alias -----------------------------------------------------------------------------------------

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
    let alias = seleccionadas.join(".").toUpperCase(); // Unimos con un "." con join y llevamos a Mayusculas.
    return alias
}

function verAliasUsuario(usuarioActivo) {
    alert(`Tu alias es: ${usuarioActivo.alias}`);
}

function cambiarAliasUsuario(usuarioActivo, usuarios) {
    if (!generarToken()) {
        alert("No se cambió el alias porque el token es incorrecto.");
        return false; // No cambia
    }
    //Expresion regular (Sacada de internet) para que compruebe que el formato del alias sea una palabra separada por un "."
    const aliasRegex = /^[a-z]+(\.[a-z]+){1,2}$/i;

    let nuevoAlias = prompt("Ingresá el nuevo alias (2 o 3 palabras separadas por punto):");
    if (!nuevoAlias) {
        alert("No ingresaste un alias.");
        return false;
    }
    nuevoAlias = nuevoAlias.trim();

    if (!aliasRegex.test(nuevoAlias)) { //.test chequea que se cumpla la expresion regular que ingresamos a nuevoAlias
        alert("Alias inválido. Debe tener 2 o 3 palabras separadas por punto. Ej: juan.perez o maria.lopez.diaz");
        return false;
    }

    nuevoAlias = nuevoAlias.toUpperCase();
    //Chequeamos que el alias no esté en uso.
    const aliasEnUso = usuarios.some(u => u.alias === nuevoAlias);
    if (aliasEnUso) {
        alert("Ese alias ya está en uso.");
        return false;
    }
    const aliasAnterior = usuarioActivo.alias; // Guardar alias anterior para notificación
    usuarioActivo.alias = nuevoAlias;

    agregarNotificacion(usuarioActivo, `Alias cambiado de ${aliasAnterior} a ${nuevoAlias}`);
    alert(`Alias actualizado. Tu nuevo alias es: ${nuevoAlias}`);
    return true; // Cambio exitoso
}
// Funciones de Datos --------------------------------------------------------------------------------------

function pedirDato(mensaje, minLength = 4, maxLength = 20, soloLetras = false) {
    let valor;
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; 
    // Expresion regular para permitir letras incluso acentuadasñ.
    do {
        valor = prompt(mensaje);
        if (!valor) {
            alert("Este campo no puede quedar vacío.");
        } else if (valor.length < minLength) {
            alert(`Debe tener al menos ${minLength} caracteres.`);
            valor = null;
        } else if (valor.length > maxLength) {
            alert(`Debe tener como máximo ${maxLength} caracteres.`);
            valor = null;
        } else if (soloLetras && !regexLetras.test(valor)) {
            alert("Solo se permiten letras y espacios.");
            valor = null;
        }
    } while (!valor);
    return valor;
}

function validarEdad(mensaje) {
    let edad;
    do {
        let entrada = prompt(mensaje);
        if (!entrada) {
            alert("Este campo no puede quedar vacio.");
            continue
        }
        edad = Number(entrada);

        if (isNaN(edad) || edad <= 0) {
            alert("Por favor ingresar una edad válida.")
            edad = null
        } else if (edad < 16) {
            alert("No podes registrarte si tenes menos de 16 años.");
            return null; // return null cancela el registro.
        }
    } while (edad === null);
    return edad;
}

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

// Funciones de Eventos mensuales o diarios ----------------------------------------------------------------

function crearEventoTemporario(usuario, tipo, parametros) {
    const evento = {
        tipo,
        fechaUltimaRevision: null,
        parametros, // Datos especificos del evento, monto, cantidad de dias.
        activo: true
    };
    usuario.eventosTemporarios.push(evento);
}

function procesarEventoMensual(usuario, evento, fechaActual, funcionEjecutora, diaEjecucion) {
    const ultima = evento.fechaUltimaRevision || usuario.fechaRegistro || new Date();

    // Calculamos meses transcurridos entre la última ejecución y la fecha actual
    let mesesPasados =
        (fechaActual.getFullYear() - ultima.getFullYear()) * 12 +
        (fechaActual.getMonth() - ultima.getMonth());

    if (mesesPasados > 0) {
        // Para cada mes transcurrido, verificamos si ya pasó el día para ejecutar
        for (let i = 1; i <= mesesPasados; i++) {
            // Calculamos la fecha del evento para el mes i
            const fechaEvento = new Date(ultima.getFullYear(), ultima.getMonth() + i, diaEjecucion);

            if (fechaActual >= fechaEvento) {
                // Ejecutar la función pasando usuario, evento y fechaEvento
                funcionEjecutora(usuario, evento, fechaEvento);
                // Actualizar la fechaUltimaRevision para evitar múltiples ejecuciones
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
    // Procesar intereses de plazos fijos antes de revisar eventos. 
    procesarPlazoFijo(usuario);

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
}


// Otras funciones -----------------------------------------------------------------------------------------
function saludarUsuario(usuario) {
    let saludo;
    if (usuario.sexo === "M") {
        saludo = `Bienvenido ${usuario.nombre} ${usuario.apellido}!`;
    } else if (usuario.sexo === "F") {
        saludo = `Bienvenidad ${usuario.nombre} ${usuario.apellido}!`;
    } else {
        saludo = `Bienvenid@ ${usuario.nombre} ${usuario.apellido}!`
    }
    alert(saludo);
}

function consultarSaldo() {
    let mensaje = `Tu saldo actual:\n`;

    if (usuarioActivo.saldo && usuarioActivo.saldo > 0) {
        mensaje += `Pesos: $${usuarioActivo.saldo.toFixed(2)}\n`;
    }
    if (usuarioActivo.saldoDolares && usuarioActivo.saldoDolares > 0) {
        mensaje += `Dólares: $${usuarioActivo.saldoDolares.toFixed(2)}\n`;
    }
    if (usuarioActivo.saldoEuros && usuarioActivo.saldoEuros > 0) {
        mensaje += `Euros: €${usuarioActivo.saldoEuros.toFixed(2)}\n`;
    }
    if (usuarioActivo.saldoReales && usuarioActivo.saldoReales > 0) {
        mensaje += `Reales: R$${usuarioActivo.saldoReales.toFixed(2)}\n`;
    }
    if (mensaje === `Tu saldo actual:\n`) {
        alert("No tenés saldo en ninguna moneda.");
    } else {
        alert(mensaje);
    }
}

// Funciones de Inicio de sesión y registro. ------------------------------------------------------------------------

function iniciarSesion() {
    let intentos = 5;
    while (intentos > 0) {
        let user = pedirDato("Usuario:");
        let pass = pedirDato("Contraseña:");

        let usuarioEncontrado = usuarios.find(u => u.usuario === user); // Esto: Busca dentro del array 
        // usuarios un valor estrictamente igual al ingresado en user. Y lo devuelve en "u" para almacenarlo 
        // en usuario encontrado

        if (usuarioEncontrado && usuarioEncontrado.contraseña === pass) {
            saludarUsuario(usuarioEncontrado);
            usuarioActivo = usuarioEncontrado; //ACA SE DEFINE EL USUARIO ACTIVO

            return true
        } else {
            intentos--;
            if (intentos > 0) {
                alert(`Usuario o contraseña incorrectos. Intentos restantes: ${intentos}`);
            } else {
                alert("Has agotado el numero de intentos. Intenta nuevamente mas tarde.")
            }
        }
    }
}

function registrarUsuario() {
    let nuevoUsuario = pedirDato("Elegi un nombre de usuario (Entre 4 y 20 caracteres)", 4, 20);
    let existe = usuarios.some(u => u.usuario === nuevoUsuario);

    if (existe) {
        alert("Ese nombre de usuario ya está en uso.");
        return;
    }

    let nuevaContraseña = pedirDato("Elegi una contraseña", 4, 20);
    let nombre = pedirDato("Tu(s) nombre(s)", 2, 30, true);
    let apellido = pedirDato("Tu(s) apellido(s)", 2, 30, true);

    let sexo;
    do {
        sexo = prompt("Por favor ingresá una opción:\nM - Masculino\nF - Femenino\nX - Otros");
        if (!sexo || !["M", "F", "X"].includes(sexo.toUpperCase())) {
            alert("Por favor ingresá M, F o X");
            sexo = null;
        } else {
            sexo = sexo.toUpperCase();
        }
    } while (!sexo);

    let edad = validarEdad("Tu edad");
    if (edad === null) return;

    let alias = generarAlias();

    usuarios.push({
        usuario: nuevoUsuario,
        contraseña: nuevaContraseña,
        nombre: nombre,
        apellido: apellido,
        sexo: sexo,
        edad: edad,
        saldo: 0,
        banco: generarNombreBanco(),
        numeroCuenta: generarNumeroCuenta(),
        fechaRegistro: new Date(obtenerFechaSimulada()),
        alias: alias,
        contactos: [],
        movimientos: [],
        notificaciones: [],
        eventosTemporarios: [],
        servicios: [
            { nombre: "Luz", pagado: true, monto: 0, rango: { min: 15000, max: 50000 } },
            { nombre: "Agua", pagado: true, monto: 0, rango: { min: 3000, max: 9000 } },
            { nombre: "Gas", pagado: true, monto: 0, rango: { min: 7000, max: 12000 } },
            { nombre: "Teléfono", pagado: true, monto: 0, rango: { min: 5000, max: 7000 } },
            { nombre: "Internet", pagado: true, monto: 0, rango: { min: 10000, max: 20000 } },
            { nombre: "Impuestos Municipales", pagado: true, monto: 0, rango: { min: 1500, max: 2500 } },
        ],
        prestamos: [],
    });

    alert("Te registraste exitosamente!");
}


//------------------------------------------------------------------------------------------------------
// Funcion Homebanking, actua como el menu principal del sitio. ----------------------------------------
//------------------------------------------------------------------------------------------------------
function homebanking() {
    let logueado = true;

    while (logueado) {
        chequearEventosUsuario(usuarioActivo);
        let pendientes = contarNotificacionesPendientes(usuarioActivo)
        const opcion = prompt(
            `Bienvenido al Homebanking\n\nSelecciona una opción:\n
                1. Saldos
                2. Depósito
                3. Transferencia
                4. Pagar servicios
                5. Compra de divisas
                6. Préstamos
                7. Descuentos
                8. Notificaciones (${pendientes})
                9. Movimientos
                10. Plazo fijo
                11. Contactos
                12. Avanzar dias
                0. Cerrar sesión
                `
        );
        switch (opcion) {
            case "1":
                verificarCuentaSueldo(usuarioActivo);
                consultarSaldo();
                break;
            case "2":
                ingresarDinero();
                break;
            case "3":
                gestionarTransferencias(usuarioActivo, usuarios);
                break;
            case "4":
                gestionarServicios(usuarioActivo);
                break;
            case "5":
                gestionarDivisas();
                break;
            case "6":
                gestionarPrestamos(usuarioActivo);
                break;
            case "7":
                mostrarCuponera(usuarioActivo);
                break;
            case "8":
                mostrarNotificaciones(usuarioActivo);
                break;
            case "9":
                mostrarHistorial(usuarioActivo);
                break;
            case "10":
                gestionarPlazoFijo();
                break;
            case "11":
                gestionarContactos(usuarioActivo, usuarios);
                break;
            case "12":
                gestionarFechaSimulada();
                break;
            case "0":
                alert("Sesión cerrada. Gracias por usar nuestro servicio!");
                logueado = false;
                break;

            default:
                alert("Opción no válida. Por favor, elegí un número del 1 al 12, o ingrese 0 para salir.");
        }
    }
}

//------------------------------------------------------------------------------------------------------
//-----------------------------------       FLUJO PRINCIPAL      ---------------------------------------
//------------------------------------------------------------------------------------------------------

while (!salirPrograma) {
    if (confirm("Desea iniciar sesión o registrarse?")) {
        while (!logueado) {
            let opcion = prompt("Elegi una opción:\n1- Iniciar sesión.\n2- Registrarse\n0- Salir");
            switch (opcion) {
                case "1":
                    logueado = iniciarSesion();
                    if (logueado) {
                        alert("¡Estás logueado!");
                        procesarPlazoFijo(usuarioActivo);
                        homebanking();
                        logueado = false;
                    }
                    break;
                case "2":
                    registrarUsuario();
                    break;
                case "0":
                    alert("Te vas tan pronto?");
                    salirPrograma = true
                    break;
                default:
                    alert("Opcion invalida, ingrese 1, 2 o 0.");
            }
            if ((!logueado && opcion === "1") || opcion === "0") {
                break;
            }
        }
    } else {
        alert("Hasta luego!")
        salirPrograma = true;
    }
}