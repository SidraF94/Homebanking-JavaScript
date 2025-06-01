![Proyecto JavaScript](imagenes/javascript-logo-banner.jpg)

# 💻 Proyecto: Homebanking (Simulación en JavaScript)

Este proyecto simula una plataforma de **homebanking** desarrollada íntegramente en **JavaScript puro**, sin frameworks ni almacenamiento en servidor. Está orientado a fortalecer habilidades de lógica de programación, estructuras de datos, validaciones, manejo de fechas y simulación de operaciones bancarias reales.


## ✨ Funcionalidades Principales ✨

### 🔐 Registro e Inicio de Sesión 🔐

- Registro con usuario, nombre, apellido y contraseña.
- Alias, número de cuenta y banco son **generados automáticamente** para cada usuario.
- Sistema de **doble validación de sesión**: estar dentro del simulador y estar logueado activamente.

---

### 🧠 Función Central: `homebanking()` 🧠

- Núcleo del simulador.
- Gestiona la sesión del usuario y **llama a todas las funcionalidades**: depósitos, retiros, transferencias, historial, eventos, etc.

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
  - Monto (+/-).
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

### 📥 Entrada y Salida 📥

- `prompt` para ingreso de datos.
- `confirm` para decisiones del usuario.
- `alert` para notificaciones y mensajes.
- `parseInt` y `parseFloat` para conversión de datos numéricos.

### 🔧 Funciones 🔧

- Funciones **con y sin parámetros**.
- Uso de **funciones flecha** para simplificar lógica repetitiva.
- Funciones anidadas para encapsular lógica.

### 🧱 Estructuras de Datos 🧱

- Arrays simples y **arrays de objetos** (usuarios, movimientos, notificaciones).
- Arrays **anidados** para organizar información compleja.

### 🛠️ Métodos de Array 🛠️

- `.push()` para agregar movimientos y plazos.
- `.join()` para mostrar información agrupada.
- `.reverse()` para mostrar los movimientos en orden descendente.

### 🔄 Callbacks y Métodos Avanzados 🔄

- `.find()` para buscar usuarios por alias.
- `.some()` para validar condiciones específicas.
- `.reduce()` para cálculos de saldos o totales acumulados.

---

## 🎯 Objetivos de Aprendizaje 🎯

- Lógica estructurada en JavaScript.
- Organización y separación de funcionalidades.
- Validaciones de datos, flujos y simulaciones realistas.
- Práctica con estructuras complejas: arrays, objetos, funciones y fechas.

---

## 🚧 Mejoras Futuras 🚧

- Persistencia de datos con `localStorage`.
- Interfaz visual en HTML/CSS.

---

