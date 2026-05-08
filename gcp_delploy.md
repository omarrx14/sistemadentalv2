# ☁️ Guía de Integración y Despliegue en GCP para Datos Médicos

Esta guía detalla la arquitectura necesaria para transformar **DentalPro** de un prototipo local a un sistema empresarial seguro, escalable y cumplidor con normativas de salud en **Google Cloud Platform (GCP)**.

---

## 🏗️ Arquitectura del Sistema

Para un sistema médico profesional, separaremos las responsabilidades en capas:

1.  **Capa de Aplicación (Frontend):** React + Vite (Servido vía Cloud Run o Firebase Hosting).
2.  **Capa de Lógica (Backend API):** Node.js o Python (Dockerizado en Cloud Run).
3.  **Capa de Datos (Base de Datos):** **Cloud SQL (PostgreSQL)**. Instanciado de forma independiente al contenedor.
### 4. Capa de Archivos (Multimedia Médica)
- **Cloud Storage:** Para radiografías (JPG/PNG/DICOM).
    - **Estrategia:** No guardaremos las fotos en la base de datos (PostgreSQL). Guardaremos el archivo en un "Bucket" de Cloud Storage y solo almacenaremos la **URL o Path** en la base de datos.
    - **Seguridad:** Los archivos serán privados por defecto. El Backend generará **Signed URLs** (URLs temporales con vida de 5-10 minutos) para que el doctor vea la imagen de forma segura sin exponerla al público.

---

## 🛡️ Seguridad y Cumplimiento Médico (HIPAA/NOM)

GCP es ideal para salud porque ofrece herramientas específicas para el cumplimiento de normativas (BAA - Business Associate Agreement).

### 1. Encriptación
- **En Tránsito:** Todo el tráfico viaja bajo SSL/TLS mediante **Cloud Load Balancing**.
- **En Reposo:** Los datos en Cloud SQL y Cloud Storage se encriptan automáticamente con llaves gestionadas por Google (o llaves propias vía **Cloud KMS**).

### 2. IAM (Identity and Access Management)
- Utilizaremos el "Principio de Menor Privilegio". La cuenta de servicio del Backend solo tendrá permisos para leer/escribir en la base de datos específica, no para borrar la instancia.

### 3. Registros de Auditoría (Cloud Audit Logs)
- Es obligatorio por ley saber **quién accedió a qué expediente y cuándo**. Activaremos logs detallados que registren cada acceso a datos sensibles.

---

## 🚀 Guía de Implementación Paso a Paso

### Paso 1: Configuración de la Base de Datos (Cloud SQL)
A diferencia de Docker, usaremos un servicio gestionado para mayor confiabilidad:
1.  Crear una instancia de **Cloud SQL for PostgreSQL** en la consola de GCP.
2.  Configurar **Private IP** para que la base de datos no sea accesible desde el internet público, solo desde tu Backend.
3.  Habilitar **Backups automáticos** y **High Availability** (para que el sistema no se caiga si falla una zona de Google).

### Paso 2: Dockerización del Sistema
Crearemos una imagen para el Frontend y otra para el Backend. 

**Dockerfile (Ejemplo simplificado):**
```dockerfile
FROM node:20-slim
WORKDIR /app
COPY . .
RUN npm install && npm run build
# El backend se conectará a la base de datos vía Cloud SQL Proxy o Private IP
CMD ["npm", "start"]
```

### Paso 3: Despliegue con Cloud Run
Cloud Run ejecutará tus contenedores de forma "Serverless" (pagas solo cuando se usa):
1.  Subir imágenes a **Artifact Registry**.
2.  Desplegar en **Cloud Run**.
3.  **Conexión:** Inyectar las credenciales de la base de datos mediante **Secret Manager** (nunca en archivos `.env` planos).

### Paso 4: Integración con el Frontend (Zustand -> API)
En el código actual de React, cambiaremos el almacenamiento:

**Antes (LocalStorage):**
```javascript
persist((set) => ({ ... }), { name: 'dental-storage' })
```

**Después (API Real):**
```javascript
const useDentalStore = create((set) => ({
  fetchPatients: async () => {
    const res = await axios.get('https://tu-api-gcp.run.app/patients');
    set({ patients: res.data });
  },
  addPatient: async (newPatient) => {
    await axios.post('https://tu-api-gcp.run.app/patients', newPatient);
    // Refrescar lista
  }
}));
```

---

## 📈 Beneficios de este esquema
- **Escalabilidad:** Si la clínica crece y abre 10 sucursales, el sistema se escala automáticamente.
- **Separación de Datos:** Si borras o actualizas el contenedor del sistema, **tus datos médicos están a salvo en Cloud SQL**.
- **Legalidad:** Al usar GCP con las configuraciones de seguridad adecuadas, cumples con la protección de datos personales en posesión de particulares.

---
**Recomendación Pro:** Para el manejo de radiografías, usa **Google Cloud Healthcare API**. Es una herramienta avanzada que permite manejar estándares como DICOM de forma nativa en la nube.
