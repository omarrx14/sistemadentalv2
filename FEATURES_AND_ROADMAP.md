# 📘 Documentación de Funcionalidades y Plan de Escalabilidad

Este documento detalla las capacidades actuales del sistema **DentalPro** y establece la hoja de ruta técnica para su evolución hacia un sistema empresarial con base de datos.

---

## 🚀 Funcionalidades Implementadas (Actuales)

El sistema funciona actualmente como una **SPA (Single Page Application)** con persistencia en `localStorage`, lo que permite una experiencia ultra-rápida y funcional sin servidor.

### 1. 🩺 Gestión Clínica (Expediente Digital)
- **Ficha Integral:** Registro de datos personales, contacto y antecedentes.
- **Anamnesis:** Sección especializada para Motivo de Consulta y Antecedentes Médicos (alergias, cirugías).
- **Evolución Clínica:** Registro cronológico de notas médicas por sesión.
- **Odontograma Interactivo:** Mapa dental visual con iconografía personalizada (`tooth.svg`). Permite marcar estados (Sano, Caries, Tratado) con guardado automático.

### 2. 📅 Agenda y Citas
- **Calendario Dinámico:** Visualización mensual con indicadores de ocupación (puntos en días con citas).
- **Gestión de Citas:** Registro de nuevas citas vinculadas a pacientes existentes con selección de hora y tipo de tratamiento.
- **Control de Flujo:** Cambio de estados en tiempo real (Pendiente -> En Espera -> Completado).

### 3. 💰 Finanzas y Facturación (México)
- **Dashboard Financiero:** KPIs de ingresos netos, IVA por pagar y cuentas por cobrar.
- **Registro de Cobros:** Modal para capturar pagos vinculados a pacientes.
- **Facturación CFDI 4.0:** Generación de representaciones impresas profesionales con todos los requisitos del SAT (RFC, Régimen Fiscal, C.P., Folio Fiscal UUID).

### 4. ⚙️ Configuración y Perfil
- **Identidad de Marca:** Posibilidad de cambiar el nombre del doctor(a), especialidad y nombre de la clínica.
- **Sincronización Global:** Los cambios en el perfil se reflejan instantáneamente en el Header y Sidebar de toda la app.

### 5. 📱 Experiencia de Usuario (UX)
- **Mobile First:** Diseño 100% responsivo con menú hamburguesa para smartphones.
- **Notificaciones Premium:** Sistema de "Toasts" (Sonner) para feedback no intrusivo.
- **Persistencia:** Uso de Zustand Middleware para mantener los datos tras recargar la página.

---

## 🛠️ Plan a Futuro: Transición a Base de Datos

Aunque el almacenamiento local (`localStorage`) es excelente para una demo o un consultorio individual pequeño, una clínica en crecimiento requerirá una infraestructura de **Backend + Base de Datos**.

### ¿Por qué sería necesaria una Base de Datos?
1. **Multi-usuario:** Para que la secretaria y el doctor puedan ver la misma información desde computadoras distintas en tiempo real.
2. **Seguridad y Backup:** Centralizar la información en la nube permite hacer respaldos automáticos y evitar pérdida de datos si la computadora local falla.
3. **Volumen de Datos:** `localStorage` tiene un límite de ~5MB. Una clínica con miles de pacientes y radiografías excederá este límite rápidamente.
4. **Cumplimiento Legal (HIPAA/NOM):** Las normativas de salud exigen registros auditables y encriptados que solo una base de datos profesional puede garantizar.

### Hoja de Ruta Técnica Sugerida:

#### Fase 1: Backend API (Node.js o Python)
- Crear una API REST o GraphQL para manejar la lógica de negocio fuera del navegador.
- Implementar **Autenticación (JWT)** para que cada doctor tenga su propia cuenta segura.

#### Fase 2: Base de Datos (PostgreSQL o MongoDB)
- **PostgreSQL (Recomendado):** Para datos estructurados como finanzas, expedientes y citas. Es ideal por su robustez y manejo de relaciones complejas.
- **Almacenamiento de Archivos (AWS S3 / Google Cloud):** Para guardar radiografías y fotos clínicas en alta resolución.

#### Fase 3: Facturación Real (PAC Integration)
- Conectar el módulo de finanzas con un **PAC (Proveedor Autorizado de Certificación)** en México para timbrar facturas reales ante el SAT automáticamente.

#### Fase 4: Inteligencia de Datos
- Implementar reportes avanzados de rentabilidad y recordatorios automáticos de citas vía SMS o WhatsApp API oficial.

---
**Nota Final:** DentalPro está construido con una arquitectura modular en React + Zustand, lo que facilita enormemente la transición a un backend en el futuro, ya que solo habría que reemplazar las llamadas a `localStorage` por llamadas a la API (`fetch`/`axios`).
