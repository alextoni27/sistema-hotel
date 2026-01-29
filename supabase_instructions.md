# Instrucciones para crear el proyecto en Supabase y migrar la DB

Resumen breve:
- Organización: `atov2026`
- Proyecto: `alextoni27's Project` (puedes poner el nombre que quieras)
- Plan: puedes usar **Free** para probar; si quieres backups y SLA, elige **Pro ($25/mes)**.
- Región: elegir **Americas** (más cercana a los usuarios).
- Conexión: seleccionar `Data API + Connection String` (permite usar las APIs autogeneradas y el connection string).
- Data API schema: dejar `Use public schema for Data API` (más simple).
- Postgres Type: dejar `Postgres` (default).

---

Credenciales sugeridas:
- Contraseña generada para la base Postgres (guardar en gestor de contraseñas):

  Contraseña: h7%Vq9wR!x2Zt#8PbS6u

  (Cópiala y pégala en el campo "Database password" al crear el proyecto.)

---

Pasos para crear y llenar la DB:
1) Entra a https://app.supabase.com/ y crea el proyecto en la organización `atov2026`.
2) Introduce el nombre del proyecto (ej. `alextoni27's Project`) y pega la contraseña generada.
3) Selecciona región `Americas` y la opción `Data API + Connection String`.
4) Espera a que el proyecto se cree (toma unos minutos).
5) Abre el "SQL Editor" en Supabase Dashboard.
6) Abre el archivo `supabase_migration.sql` en tu máquina, copia todo y pégalo en el SQL Editor.
7) Ejecuta el script; creará las tablas y ejemplos de datos.
8) Revisa la sección Auth / Policies si necesitas controles de acceso.

Backups y producción:
- El plan Free no incluye backups automáticos; para producción o datos importantes, considera Pro ($25/mes) o descargar backups manuales periódicos.

Conexión desde la app:
- En Settings > Database > Connection string copia la `postgres://...` y úsala en tu servidor (guárdala en variable de entorno `DATABASE_URL`).
- Para llamadas directas desde el cliente web/móvil usa las APIs autogeneradas (si activaste Data API).

Mensaje breve para Marco (puedes copiar/pegar):

"Marco, estoy creando el proyecto en Supabase para el sistema de alquiler. Ya generé la contraseña y el script de migración; cuando el proyecto esté listo ejecutaré el script y te aviso."

---

¿Quieres que también genere:
- Un `docker-compose.yml` para desplegar la app con Postgres localmente?
- Un script Node.js que conecte a Supabase y cree los datos iniciales automáticamente (usa `DATABASE_URL`)?

Fin.
