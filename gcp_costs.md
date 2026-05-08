# 💰 Estimación de Costos: Despliegue de DentalPro en GCP

Esta guía proporciona un desglose estimado de los costos mensuales para operar el sistema **DentalPro** en un entorno de producción real utilizando la arquitectura definida en `gcp_delploy.md`.

---

## 📊 Resumen por Servicio (Precios USD)

GCP ofrece un nivel gratuito (**Free Tier**) muy generoso. Muchos de los servicios usados no generarán costo hasta que la clínica alcance un volumen considerable de tráfico.

### 1. Cloud Run (Frontend & Backend)
*   **Costo Estimado:** $0 - $5.00 USD / mes.
*   **Por qué:** Al ser "Serverless", Cloud Run solo cobra por el tiempo exacto en que se procesan las solicitudes. Para una clínica con uso moderado, entrará casi totalmente en el nivel gratuito.

### 2. Cloud SQL (Base de Datos PostgreSQL)
*   **Costo Estimado:** $15.00 - $40.00 USD / mes.
*   **Por qué:** Este es el componente más costoso porque la instancia está encendida 24/7 para garantizar que los datos estén listos.
    *   *Instancia Micro (db-f1-micro):* ~$15.00 USD.
    *   *Alta Disponibilidad (Replicada):* ~$30.00+ USD.

### 3. Cloud Storage (Radiografías y Multimedia Médica)
*   **Costo Base:** ~$0.02 USD por GB (Standard Storage).
*   **Optimización (Archive/Nearline):** Para radiografías de pacientes que no han venido en más de un año, podemos mover los archivos a capas más baratas ($0.001 USD / GB).
*   **Estimación de Crecimiento:** 
    *   1,000 radiografías (~2GB): $0.05 USD / mes.
    *   10,000 radiografías (~20GB): $0.50 USD / mes.
    *   *El almacenamiento es la parte más barata del sistema incluso con miles de imágenes.*

### 4. Servicios Adicionales (Seguridad y Logs)
*   **Secret Manager:** $0.06 USD por cada secreto activo.
*   **Cloud Audit Logs:** Gratis para la mayoría de los logs de actividad.
*   **Artifact Registry:** ~$0.10 USD por guardar las imágenes Docker.

---

## 🏠 Escenarios de Presupuesto

### Escenario A: Consultorio Pequeño (1 Doctor)
*Optimizado para bajo costo, sin redundancia crítica.*
- **Cloud SQL (Micro):** $15.00
- **Cloud Run:** $0.00 (Nivel gratuito)
- **Cloud Storage (5GB):** $0.15
- **Total Estimado: ~$16 USD / mes (aprox. $270 - $300 MXN)**

### Escenario B: Clínica Profesional (Multi-doctor)
*Con Alta Disponibilidad y mayor capacidad de almacenamiento.*
- **Cloud SQL (db-custom, HA enabled):** $35.00
- **Cloud Run (Uso intensivo):** $10.00
- **Cloud Storage (50GB):** $1.20
- **Secret Manager & Logs:** $1.50
- **Total Estimado: ~$48 USD / mes (aprox. $800 - $900 MXN)**

---

## 💡 Consejos para Ahorrar Costos en la Clínica

1.  **Instancias de Desarrollo:** Apaga la base de datos de "pruebas" fuera del horario de oficina usando un Script automático.
2.  **Compromiso de Uso:** Si sabes que usarás el sistema por más de un año, puedes contratar "Committed Use Discounts" y ahorrar hasta un 17% en Cloud SQL.
3.  **Optimización de Imágenes:** Comprime las fotografías clínicas antes de subirlas a Cloud Storage para ocupar menos espacio sin perder calidad médica.

---

## 📝 Conclusión
Para iniciar, el **Escenario A (~$300 MXN/mes)** es más que suficiente para tener un sistema profesional, seguro y legalmente cumplidor en México. Comparado con el costo de mantenimiento de un servidor físico o la pérdida de datos por un fallo en el disco duro, la inversión en GCP es extremadamente rentable.

*Nota: Los precios son estimaciones basadas en la calculadora oficial de Google Cloud al año 2024 y pueden variar por región (se recomienda usar 'us-central1' para mejores precios).*
