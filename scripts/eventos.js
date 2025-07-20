document.addEventListener("DOMContentLoaded", () => {
    // Inicializar fondo y usuario base 
    inicializarFondo();
    inicializarUsuariosBase();

    // referencias a botones y formularios de iniciar sesion y cerrarla. 
    const btnInicio = document.getElementById("btnInicioSesion");
    const btnRegistro = document.getElementById("btnRegistro");
    const formInicio = document.getElementById("formInicioSesion");
    const formRegistro = document.getElementById("formRegistro");
    const pantallaLoginRegistro = document.getElementById("pantallaLoginRegistro");
    const pantallaHomebanking = document.getElementById("pantallaHomebanking");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    //Mostrar formularios
    btnInicio.addEventListener("click", () => {
        cerrarFormularios();
        formInicio.classList.remove("oculto");
        document.getElementById("loginUsuario").focus();
    });
    btnRegistro.addEventListener("click", () => {
        cerrarFormularios();
        formRegistro.classList.remove("oculto");
        document.getElementById("registroNombre").focus();
    });

    //Selecciono todos los que tengan la clase cerrar-formulario y los cierro. 
    document.querySelectorAll(".cerrar-formulario").forEach(btn => {
        btn.addEventListener("click", cerrarFormularios);
    });

    formInicio.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const user = document.getElementById("loginUsuario").value.trim();
        const pass = document.getElementById("loginPassword").value;
        const exitoso = iniciarSesionDOM(user, pass);

        if (exitoso) {
            //Si coincide vamos a pantalla homebanking.
            pantallaLoginRegistro.classList.add("oculto");
            pantallaHomebanking.classList.remove("oculto");
            cerrarFormularios();
        } else {
            miAlerta("Usuario o contraseña incorrectos");
        }
    });
    formRegistro.addEventListener("submit", function (evento) {
        evento.preventDefault();
        //tomo cada dato de donde esta en el formulario.
        const nombre = document.getElementById("registroNombre").value.trim();
        const apellido = document.getElementById("registroApellido").value.trim();
        const usuario = document.getElementById("registroUsuario").value.trim();
        const contraseña = document.getElementById("registroPassword").value;
        const sexo = document.getElementById("registroSexo").value;
        const edad = document.getElementById("registroEdad").value.trim();
        registrarUsuarioDOM({ nombre, apellido, usuario, contraseña, sexo, edad });
    });

    // Botón "cerrar sesión"
    btnCerrarSesion.addEventListener("click", () => {
        pantallaHomebanking.classList.add("oculto");
        pantallaLoginRegistro.classList.remove("oculto");
    });
    // Botón "Avanzar días"
    document.getElementById("btnAvanzarDias").addEventListener("click", () => {
        miPrompt("Cuántos días desea avanzar?", (respuesta) => {
            const cantidad = parseInt(respuesta);
            if (!isNaN(cantidad) && cantidad > 0) {
                avanzarDias(cantidad);
            } else if (respuesta !== null) {
                miAlerta("Por favor, ingrese un número válido de días.");
            }
            // si fue null se cancela
        });
    });

    document.getElementById("iconoNotificaciones")
        .addEventListener("click", () => mostrarNotificaciones(usuarioActivo));

    const titulo = document.getElementById("tituloBienvenida");
    if (usuarioActivo && usuarioActivo.nombre && usuarioActivo.apellido) {
        titulo.textContent = `Bienvenido ${usuarioActivo.nombre} ${usuarioActivo.apellido}`;
    } else {
        titulo.textContent = "Bienvenido usuario";
    }
    document.getElementById("btnMostrarMovimientos").addEventListener("click", () => {
        mostrarHistorialModal(usuarioActivo);
    });
    document.getElementById("btnCuponera").addEventListener("click", suscribirseACupones);

    document.getElementById("btnServicios").addEventListener("click", () => {
        cargarCarruselServicios();
        document.getElementById("modalServiciosOverlay").classList.remove("oculto");
    });

    document.getElementById("btnCerrarServicios").addEventListener("click", () => {
        document.getElementById("modalServiciosOverlay").classList.add("oculto");
    });

    document.getElementById("btnPagarTodosServicios").addEventListener("click", () => {
        pagarTodosLosServicios();
        cargarCarruselServicios();
    });
    // Slider de servicios
    let indiceSlider = 0;

    // Botón "Anterior"
    document.getElementById("btnPrev").addEventListener("click", () => {
        const slider = document.getElementById("slider");
        const total = slider.children.length;
        if (total === 0) return; // Si no hay servicios que pagar.
        indiceSlider = (indiceSlider - 1 + total) % total; // no va al índice -1, sino al índice -1 + length
        slider.style.transform = `translateX(-${indiceSlider * 100}%)`;
    });

    // Botón "Siguiente"
    document.getElementById("btnNext").addEventListener("click", () => {
        const slider = document.getElementById("slider");
        const total = slider.children.length;
        if (total === 0) return;
        indiceSlider = (indiceSlider + 1) % total;
        slider.style.transform = `translateX(-${indiceSlider * 100}%)`;
        // Como cada tarjeta ocupa el 100% del div, vamos a la tarjeta que tenga ese
        // porcentaje, así me aseguré de que se muevan los bloques completos.
    });

    // Modal abrir plazos fijos ---------------------
    const btnAbrirPlazoFijo = document.getElementById("btnAbrirPlazoFijo");
    const modalPlazosFijos = document.getElementById("modalPlazosFijosOverlay");
    const btnCancelarPlazoFijo = document.getElementById("btnCerrarPlazoFijo");

    if (btnAbrirPlazoFijo && modalPlazosFijos) {
        btnAbrirPlazoFijo.addEventListener("click", () => {
            modalPlazosFijos.classList.remove("oculto");
        });
    }
    if (btnCancelarPlazoFijo && modalPlazosFijos) {
        btnCancelarPlazoFijo.addEventListener("click", () => {
            modalPlazosFijos.classList.add("oculto");
        });
    }
    // Modal crear plazo fijo --------------------------------
    const btnCrear = document.getElementById("btnCrearPlazoFijo");
    const formCrear = document.getElementById("formCrearPlazoFijo");
    const btnCancelarForm = document.getElementById("btnCancelarFormularioPlazo");
    const modalCrearPlazoOverlay = document.getElementById("modalCrearPlazoOverlay");

    btnCrear.addEventListener("click", () => {
        modalPlazosFijos.classList.add("oculto");
        modalCrearPlazoOverlay.classList.remove("oculto");
        document.getElementById("inputMonto").focus(); // foco automático en el input
    });
    if (btnCancelarForm && modalCrearPlazoOverlay && formCrear) {
        btnCancelarForm.addEventListener("click", () => {
            modalCrearPlazoOverlay.classList.add("oculto");
            formCrear.reset();
        });
    }
    if (formCrear) {
        formCrear.addEventListener("submit", (e) => {
            e.preventDefault();
            const monto = parseFloat(document.getElementById("inputMonto").value);
            const plazoDias = parseInt(document.getElementById("inputPlazo").value);
            const tasaAnual = parseFloat(document.getElementById("inputTasa").value);
            crearPlazoFijo(usuarioActivo, monto, plazoDias, tasaAnual);
            guardarUsuarios(usuarios);
            modalCrearPlazoOverlay.classList.add("oculto");
            formCrear.reset();
        });
    }
    // Modal retirar plazo fijo ------------------
    const btnRetirar = document.getElementById("btnRetirarPlazoFijo");
    const modalRetirar = document.getElementById("modalRetirarPlazoOverlay");
    const btnCancelarRetiro = document.getElementById("btnCancelarRetiro");
    const selectPlazos = document.getElementById("selectPlazosParaRetirar");
    const btnConfirmarRetiro = document.getElementById("btnConfirmarRetiro");

    if (btnRetirar && selectPlazos && modalRetirar) {
        btnRetirar.addEventListener("click", () => {
            selectPlazos.innerHTML = "";
            if (!usuarioActivo.plazosFijos || usuarioActivo.plazosFijos.length === 0) {
                const option = document.createElement("option");
                option.text = "No hay plazos fijos disponibles";
                option.value = "";
                selectPlazos.add(option);
                btnConfirmarRetiro.disabled = true;
            } else {
                usuarioActivo.plazosFijos.forEach((pfijo, index) => {
                    if (!pfijo.retirado && !pfijo.cancelado) {
                        const option = document.createElement("option");
                        const fechaFin = new Date(pfijo.fechaVencimiento).toLocaleDateString();
                        option.text = `#${index + 1} - $${pfijo.monto.toFixed(2)} a vencer el ${fechaFin}`;
                        option.value = index;
                        selectPlazos.add(option);
                    }
                });
                btnConfirmarRetiro.disabled = false;
            }
            modalRetirar.classList.remove("oculto");
        });
        btnCancelarRetiro.addEventListener("click", () => {
            modalRetirar.classList.add("oculto");
        });
        btnConfirmarRetiro.addEventListener("click", () => {
            const index = parseInt(selectPlazos.value);
            if (isNaN(index)) {
                alert("Selecciona un plazo válido.");
                return;
            }
            const exito = retirarPlazoFijo(usuarioActivo, index);
            if (exito) {
                guardarUsuarios(usuarios);
                modalRetirar.classList.add("oculto");
            }
        });
    }
    // Cancelar plazo fijo ------------------------------------
    const btnCancelar = document.getElementById("btnCancelarPlazoFijo");
    const modalCancelar = document.getElementById("modalCancelarPlazoOverlay");
    const selectCancelar = document.getElementById("selectPlazosParaCancelar");
    const btnConfirmarCancelar = document.getElementById("btnConfirmarCancelar");
    const btnCancelarCancelar = document.getElementById("btnCancelarCancelar");

    if (btnCancelar && modalCancelar && selectCancelar) {
        btnCancelar.addEventListener("click", () => {
            selectCancelar.innerHTML = "";
            if (!usuarioActivo.plazosFijos || usuarioActivo.plazosFijos.length === 0) {
                const option = document.createElement("option");
                option.text = "No hay plazos fijos";
                option.value = "";
                selectCancelar.add(option);
                btnConfirmarCancelar.disabled = true;
            } else {
                usuarioActivo.plazosFijos.forEach((pf, index) => {
                    if (!pf.cancelado && !pf.retirado) {
                        const option = document.createElement("option");
                        const fechaFin = new Date(pf.fechaVencimiento).toLocaleDateString();
                        option.text = `#${index + 1} - $${pf.monto.toFixed(2)} vence: ${fechaFin}`;
                        option.value = index;
                        selectCancelar.add(option);
                    }
                });
                btnConfirmarCancelar.disabled = false;
            }
            modalPlazosFijos.classList.add("oculto");
            modalCancelar.classList.remove("oculto");
        });
        btnCancelarCancelar.addEventListener("click", () => {
            modalCancelar.classList.add("oculto");
        });
        btnConfirmarCancelar.addEventListener("click", () => {
            const index = parseInt(selectCancelar.value);
            if (isNaN(index)) {
                miAlerta("Selecciona un plazo válido.");
                return;
            }
            const resultado = cancelarPlazoFijo(usuarioActivo, index);
            if (resultado) modalCancelar.classList.add("oculto");
        });
    }

    // Mostrar plazos fijos ----------------------------------------
    const btnCerrarMostrar = document.getElementById("btnCerrarMostrarPlazos");
    const btnMostrar = document.getElementById("btnMostrarPlazosFijos");
    const modalMostrar = document.getElementById("modalMostrarPlazosOverlay");

    if (btnCerrarMostrar && modalMostrar) {
        btnCerrarMostrar.addEventListener("click", () => {
            modalMostrar.classList.add("oculto");
        });
    }
    if (btnMostrar && modalMostrar) {
        btnMostrar.addEventListener("click", () => {
            mostrarPlazosFijos(usuarioActivo);
        });
    }
    const btnIngresar = document.getElementById("btnIngresarDinero");
    if (btnIngresar) {
        btnIngresar.addEventListener("click", ingresarDinero);
    }
    const btnCuenta = document.getElementById("btnVincularCuentaSueldo");
    if (btnCuenta) {
        btnCuenta.addEventListener("click", () => {
            if (!usuarioActivo) {
                miAlerta("No hay usuario activo.");
                return;
            }
            verificarCuentaSueldo(usuarioActivo);
        });
    }
    // Abrir el modal de Contactos
    document.getElementById("btnContactos").addEventListener("click", () => {
        document.getElementById("modalContactosOverlay").classList.remove("oculto");
    });
    // Cerrar el modal
    document.getElementById("btnCerrarContactos").addEventListener("click", () => {
        document.getElementById("modalContactosOverlay").classList.add("oculto");
    });
    // Ver Alias
    document.getElementById("btnVerAlias").addEventListener("click", verAliasUsuario);
    // Cambiar Alias
    document.getElementById("btnCambiarAlias").addEventListener("click", cambiarAliasUsuario);
    // Agendar contacto
    document.getElementById("btnAgendarContacto").addEventListener("click", agregarContactoAUsuario);
    // Ver contactos
    document.getElementById("btnVerContactos").addEventListener("click", () => {
        // Cerrar opciones
        document.getElementById("modalContactosOverlay").classList.add("oculto");
        mostrarListaDeContactos();
    });
    document.getElementById("btnCerrarListaContactos").addEventListener("click", () => {
        document.getElementById("modalListaContactos").classList.add("oculto");
    });
    // Abrir modal de transferencias
    document.getElementById("btnTransferir").addEventListener("click", () => {
        document.getElementById("modalTransferenciasOverlay").classList.remove("oculto");
    });
    // Cerrar modal de transferencias
    document.getElementById("btnCerrarTransferencias").addEventListener("click", () => {
        document.getElementById("modalTransferenciasOverlay").classList.add("oculto");
    });
    // Transferir por alias
    document.getElementById("btnTransferirAlias").addEventListener("click", () => {
        transferirPorAlias(usuarioActivo, usuarios);
    });
    // Transferir por contacto
    document.getElementById("btnTransferirContacto").addEventListener("click", () => {
        document.getElementById("modalTransferenciasOverlay").classList.add("oculto");
        transferirPorContacto(usuarioActivo, usuarios); // esta funcion abre el modal con el select
    });
    document.getElementById("btnCerrarSeleccionContacto").addEventListener("click", () => {
        document.getElementById("modalSeleccionContacto").classList.add("oculto");
    });


    document.getElementById("btnDivisas").addEventListener("click", () => {
        document.getElementById("modalMonedasOverlay").classList.remove("oculto");
        actualizarMontosTarjetas(); // ahora los elementos existen y no da error
    });
    document.getElementById("btnCerrarMonedas").addEventListener("click", () => {
        document.getElementById("modalMonedasOverlay").classList.add("oculto");
    });


    cargarTasasActuales().then(() => {
        asignarEventosDivisas();
    });

    function asignarEventosDivisas() {
        document.querySelectorAll(".btnComprar").forEach(btn => {
            btn.addEventListener("click", () => {
                const divisa = btn.dataset.moneda?.toUpperCase();
                if (divisa) manejarCompra(divisa);
            });
        });

        document.querySelectorAll(".btnVender").forEach(btn => {
            btn.addEventListener("click", () => {
                const divisa = btn.dataset.moneda?.toUpperCase();
                if (divisa) manejarVenta(divisa);
            });
        });
    }


    const cardContainer = document.getElementById("saldoCardContainer");
    const saldoCard = document.getElementById("saldoCard");
    const btnFlip = document.getElementById("btnFlip");
    const btnFlipBack = document.getElementById("btnFlipBack");
    const btnMostrarOcultar = document.getElementById("btnMostrarOcultar");
    const pSaldoPesos = document.getElementById("saldoPesos");

    const saldoDolares = document.getElementById("saldoDolares");
    const saldoEuros = document.getElementById("saldoEuros");
    const saldoReales = document.getElementById("saldoReales");
    // Estado mostrar saldo pesos
    let mostrar = false;
    // Mostrar/Ocultar saldo pesos
    if (btnMostrarOcultar) {
        btnMostrarOcultar.addEventListener("click", () => {
            mostrar = !mostrar;
            if (!usuarioActivo || typeof usuarioActivo.saldo !== "number") {
                pSaldoPesos.textContent = "$0.00";
                return;
            }
            pSaldoPesos.textContent = mostrar ? `$${usuarioActivo.saldo.toFixed(2)}` : "$********";

            // Cambiar imagen y alt del iicono del ojo
            const iconoOjo = document.getElementById("iconoOjo");
            if (iconoOjo) {
                iconoOjo.src = mostrar ? "img/eye-slash.svg" : "img/eye.svg";
                iconoOjo.alt = mostrar ? "Ocultar saldo" : "Mostrar saldo";
            }
        });
    }
    // Girar tarjeta para mostrar otras monedas
    if (btnFlip) {
        btnFlip.addEventListener("click", () => {
            if (!usuarioActivo) return;

            saldoDolares.textContent = `USD: $${(usuarioActivo.saldoDolares || 0).toFixed(2)}`;
            saldoEuros.textContent = `EUR: €${(usuarioActivo.saldoEuros || 0).toFixed(2)}`;
            saldoReales.textContent = `BRL: R$${(usuarioActivo.saldoReales || 0).toFixed(2)}`;
            saldoCard.classList.add("flipped");
        });
    }
    // Volver a saldo en pesos
    if (btnFlipBack) {
        btnFlipBack.addEventListener("click", () => {
            saldoCard.classList.remove("flipped");
        });
    }
    // Inicializar saldo oculto e icono al cargar
    pSaldoPesos.textContent = "$**********";
    const iconoOjo = document.getElementById("iconoOjo");
    if (iconoOjo) {
        iconoOjo.src = "img/eye.svg";
        iconoOjo.alt = "Mostrar saldo";
    }
    const btnPrestamos = document.getElementById("btnPrestamos");
    const modalPrestamos = document.getElementById("modalPrestamos");
    const btnCerrarModalPrestamos = document.getElementById("btnCerrarModalPrestamos");
    const btnSolicitarPrestamo = document.getElementById("btnSolicitarPrestamo");
    const btnVerEstadoPrestamo = document.getElementById("btnVerEstadoPrestamo");

    // Función para abrir el modal
    function abrirModalPrestamos() {
        modalPrestamos.classList.remove("oculto");
    }
    // Función para cerrar el modal
    function cerrarModalPrestamos() {
        modalPrestamos.classList.add("oculto");
    }
    btnPrestamos.addEventListener("click", abrirModalPrestamos);
    btnCerrarModalPrestamos.addEventListener("click", cerrarModalPrestamos);
    btnSolicitarPrestamo.addEventListener("click", () => {
        cerrarModalPrestamos();
        solicitarPrestamo(usuarioActivo);
    });
    btnVerEstadoPrestamo.addEventListener("click", () => {
        cerrarModalPrestamos();
        mostrarPrestamos(usuarioActivo);
    });
    const btnEliminar = document.getElementById("btnEliminarDatos");
    if (btnEliminar) {
        btnEliminar.addEventListener("click", eliminarDatosLocalStorage);
    }
    
    cargarClimaDesdeUbicacion();

});
