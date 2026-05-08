# DentalPro - Sistema de Gestión Odontológica Moderna

DentalPro es una **Single Page Application (SPA)** de alto rendimiento diseñada específicamente para clínicas dentales que buscan modernizar su flujo de trabajo. Esta aplicación ofrece una experiencia de usuario (UX) clínica, limpia y profesional, optimizada para dentistas y personal administrativo.

![Estado del Proyecto](https://img.shields.io/badge/Estado-Prototipo_Funcional-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Vite_|_Tailwind-blue?style=for-the-badge)

## 🚀 Características Principales

### 🩺 Gestión Clínica
- **Expediente Clínico Digital:** Ficha completa del paciente incluyendo datos personales, contacto y estado general.
- **Anamnesis y Dolencias:** Registro detallado de motivos de consulta, antecedentes médicos y alergias.
- **Odontograma Interactivo:** Mapa dental visual donde puedes marcar caries, tratamientos y piezas sanas con un solo clic.
- **Evolución Clínica:** Historial cronológico de notas y observaciones por cada sesión.

### 📅 Agenda y Organización
- **Calendario Inteligente:** Navegación por fechas para gestionar las citas diarias.
- **Lista de Citas Dinámica:** Resumen visual de los pacientes del día con estados (Pendiente, En espera, Completado).

### 💰 Finanzas y Facturación (México)
- **Control de Ingresos:** Dashboard financiero con KPIs de ingresos netos y montos pendientes por cobrar.
- **Facturación CFDI 4.0:** Generación de facturas profesionales con requisitos fiscales mexicanos (RFC, Régimen Fiscal, Uso de CFDI, IVA 16%).
- **Visualizador de Facturas:** Representación impresa profesional de documentos fiscales con Folio Fiscal (UUID) y QR mock.

### 📱 Experiencia de Usuario
- **Totalmente Responsivo:** Diseño optimizado para PC, Tablets y Smartphones.
- **Persistencia de Datos:** Todos los cambios se guardan automáticamente en el `localStorage` del navegador.
- **Notificaciones Modernas:** Sistema de avisos elegantes (Toasts) para feedback inmediato sin interrupciones.

## 🛠️ Tech Stack

- **Frontend:** React 19 (Hooks, Context)
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS (Diseño clínico y responsivo)
- **Estado Global:** Zustand (con middleware de persistencia)
- **Iconografía:** Lucide React
- **Manejo de Fechas:** date-fns
- **Notificaciones:** Sonner

## 💻 Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### Requisitos Previos
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (Viene incluido con Node.js)

### Pasos para Instalar

1. **Clonar el repositorio o descargar los archivos:**
   ```bash
   git clone <url-del-repositorio>
   cd sistemadentalv2
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación:**
   Una vez iniciado el servidor, abre tu navegador y dirígete a:
   **`http://localhost:5174`**

## 📂 Estructura del Proyecto

```text
src/
├── components/        # Componentes modulares (layout, dashboard, patients, etc.)
├── data/              # Mock data inicial realista
├── store/             # Gestión de estado global con Zustand
├── App.jsx            # Lógica de navegación y ruteo
├── index.css          # Configuraciones base de Tailwind y estilos globales
└── main.jsx           # Punto de entrada de la aplicación
```

## 📝 Notas de la Demo
Esta es una versión **Frontend Demo**. No requiere de una base de datos externa ni backend para funcionar. Toda la interactividad ocurre en el navegador, lo que la hace ideal para presentaciones o como base para un producto final escalable.

---
Desarrollado con ❤️ para la comunidad odontológica.
