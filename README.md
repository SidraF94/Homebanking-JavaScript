![Proyecto JavaScript](img/javascript-logo-banner.jpg)

# 💻 Proyecto: Homebanking (Simulación en JavaScript)

Este proyecto simula una plataforma de **homebanking** desarrollada íntegramente en **JavaScript puro**, sin frameworks ni almacenamiento en servidor. Está orientado a fortalecer habilidades de lógica de programación, estructuras de datos, validaciones, manejo de fechas y simulación de operaciones bancarias reales.


## ✨ Funcionalidades Principales ✨

### 🔐 Registro e Inicio de Sesión 🔐

- Registro con usuario, nombre, apellido y contraseña.
- Alias, número de cuenta y banco son **generados automáticamente** para cada usuario.
- Sistema de **doble validación de sesión**: estar dentro del simulador y estar logueado activamente.

---

### 💰 Operaciones Bancarias 💰

- Consultar saldo.
- Depositar dinero.
- Retirar dinero (con validación de saldo).
- Transferencias a otros usuarios con:
  - Registro automático en historial (emisor y receptor).
  - Notificaciones de movimientos.

---

### 📅 Fecha Simulada y Eventos temporarios 📅

- Avance manual de días.
- Cada día simulado ejecuta **eventos automáticos**, como:
  - Cupones.
  - Facturas de servicios.
  - Cuotas de préstamos.
  - Intereses de plazos fijos.
  - Sueldos mensuales.

---

### 🧾 Historial de Movimientos 🧾

- Registra cada operación con:
  - Fecha.
  - Descripción.
  - Monto con codigo de colores.
  - **Saldo restante después de cada acción**.
- Vinculado al sistema de notificaciones.

---

### 🔔 Notificaciones 🔔

- El sistema informa eventos en tiempo real:
  - Transferencias recibidas.
  - Depósitos y retiros.
  - Plazos fijos vencidos o cancelados.
  - Resultados de eventos automáticos.

---

### 👥 Sistema de Contactos 👥

- Permite agregar y consultar contactos frecuentes.
- Se pueden buscar por alias.
- Facilita y agiliza las transferencias.

---

### 🏦 Plazos Fijos 🏦

- Crear plazos fijos con tasa anual personalizada.
- Cálculo automático de intereses diarios.
- Opciones disponibles:
  - Crear.
  - Cancelar (sin intereses).
  - Retirar (capital + intereses luego de 30 días).
  - Ver plazos activos.

---

### ✅ Validaciones Inteligentes ✅

- Validación de datos, montos y saldos.
- Errores gestionados con mensajes claros.
- Se evita realizar operaciones inconsistentes.

---

## ⚙️ Estructura del Código ⚙️

- Modular: cada funcionalidad está separada por responsabilidad.
- Uso de objetos para usuarios, movimientos y eventos.
- Fecha simulada basada en `Date`, con funciones para avanzar y consultar.
- Estados bien definidos: logueado, activo, cancelado, vencido, etc.

---

## 🔍 Detalles Técnicos 🔍

Este proyecto hace uso de diversas **estructuras y características clave de JavaScript**:

### 🧮 Condicionales 🧮

- `if`, `else`, `else if`
- Condicionales **anidados**
- Expresiones **ternarias**

### 🔁 Estructuras de Control 🔁

- `do...while`: usado para mantener sesiones activas.
- `for`: para recorrer arrays de usuarios, movimientos o plazos.
- Uso de `break` y `continue` para **interrumpir o evitar bucles infinitos**.

### 🌐 Variables 🌐

- Uso combinado de **variables globales y locales** para mantener estados y modularidad.

### ⚖️ Operadores ⚖️

- Operadores de **comparación** (`===`, `!==`, `<`, `>`, `<=`, `>=`)
- Operadores **lógicos** (`&&`, `||`, `!`)

### 📥 Entrada y Salida Personalizada 📥

Se reemplazaron las funciones nativas `prompt`, `confirm` y `alert` por versiones personalizadas con estilo visual coherente y control desde el DOM:

- **`miPrompt(mensaje, callback)`**  
  Abre un modal para que el usuario ingrese datos. Al confirmar, se ejecuta una función callback con el valor ingresado.

- **`miConfirm(mensaje, callback)`**  
  Muestra una confirmación personalizada con botones de "Aceptar" o "Cancelar". La función callback recibe `true` o `false`.

- **`miAlerta(mensaje, callbackOpcional)`**  
  Muestra una alerta con diseño estilizado y botón de cierre. Permite ejecutar una función al cerrarse (opcional).

> Estas funciones permiten una experiencia de usuario más fluida, accesible y visualmente integrada al simulador.

### 🔧 Funciones 🔧

- Funciones **con y sin parámetros**.
- Uso de **funciones flecha** para simplificar lógica repetitiva.
- Funciones anidadas para encapsular lógica.

### 🧱 Estructuras de Datos 🧱

- Arrays simples y **arrays de objetos** (usuarios, movimientos, notificaciones).
- Arrays **anidados** para organizar información compleja.

### 🛠️ Métodos de Array 🛠️

- `.push()` para agregar elementos a arrays como movimientos, plazos, notificaciones o contactos.
- `.join()` para mostrar datos agrupados en string.
- `.reverse()` para invertir el orden de visualización (por ejemplo, historial).
- `.filter()` para generar nuevas listas (como servicios impagos o préstamos activos).
- `.forEach()` para recorrer y ejecutar lógica en cada elemento.
- `.includes()` para verificar existencia de elementos simples.

### 🔄 Callbacks y Métodos Avanzados 🔄

- `.find()` para buscar un único usuario, alias o contacto.
- `.findIndex()` para obtener la posición de un elemento dentro de un array.
- `.some()` para saber si existe al menos un elemento que cumple cierta condición.
- `.reduce()` para sumar saldos, calcular totales de pagos o intereses acumulados.

---

## 🎯 Objetivos de Aprendizaje 🎯

- Lógica estructurada en JavaScript.
- Organización y separación de funcionalidades.
- Validaciones de datos, flujos y simulaciones realistas.
- Práctica con estructuras complejas: arrays, objetos, funciones y fechas.

---

### 💾 Persistencia con `localStorage` 💾

- Toda la información del sistema se guarda automáticamente en `localStorage`, incluyendo:
  - Usuarios registrados.
  - Movimientos, préstamos, servicios y plazos fijos.
  - Notificaciones y eventos simulados.
  - Días simulados para el avance del calendario.
- Esto permite continuar una sesión incluso tras cerrar o recargar el navegador.
- Incluye opción para **eliminar manualmente todos los datos** del sistema (`eliminarDatosLocalStorage()`), con confirmación visual.

---

### 🖼️ Interfaz Visual en HTML/CSS 🖼️ 

- Reemplazo completo de funciones nativas por **modales estilizados** con HTML y CSS:
  - `miPrompt`, `miConfirm` y `miAlerta` ofrecen una experiencia más personalizada.
- Diseño con imágenes dinámicas y fondo cambiante.
- Botones interactivos y formularios.
- Navegación visual con **pantallas diferenciadas** para login y homebanking.

---

## ⏱️ Asincronismo y Promesas ⏱️

El proyecto incluye manejo de asincronismo mediante el uso de **promesas** con `.then()` y `.catch()`:

- Uso de `fetch().then().catch()` para realizar peticiones externas a APIs públicas.
- Control de errores con `catch` para evitar bloqueos en caso de fallos de red o permisos denegados.
- Ejemplo práctico: al obtener ubicación del usuario con `navigator.geolocation`, se consulta a **Nominatim** para obtener el nombre de la ciudad y luego a **Open-Meteo** para mostrar el clima en tiempo real.

---

## 🌍 Geolocalización y APIs Externas 🌍

Se integran varias APIs externas para enriquecer la experiencia del usuario:

### 📍 Nominatim (OpenStreetMap) 📍

- Se usa para convertir coordenadas en nombres de ciudad (geocodificación inversa).
- Protegido con un **proxy CORS** para evitar bloqueos del navegador.

### ☁️ Open-Meteo ☁️

- API meteorológica que permite mostrar el **clima actual** según ubicación del usuario.
- La respuesta se maneja con `fetch().then().catch()` y se renderiza en el DOM dinámicamente.

### 💲 DolarApi 💲 

- Consulta a [dolarapi.com](https://dolarapi.com) para obtener la cotización del dólar en tiempo real.
- Permite mostrar diferenetes cotizaciones como **dólar, euro o real**, según se necesite en el simulador.

---

## 🧾 Exportación a PDF (jsPDF + autoTable) 🧾

El proyecto incorpora la librería **jsPDF** y su extensión **jsPDF-AutoTable** para permitir la descarga de información en formato PDF:

- Exportación del **historial de movimientos** como tabla.
- Personalización del PDF con fecha, nombre del usuario, encabezado y estilo básico.
- Uso de `doc.autoTable()` para estructurar datos fácilmente desde arrays de objetos.

> Estas funcionalidades mejoran la experiencia del usuario al ofrecer herramientas reales de consulta y documentación, simulando a un sistema bancario profesional.

