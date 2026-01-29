# Sistema Hotel — Node + Express + Postgres

Proyecto minimal para gestionar habitaciones alquiladas mes a mes.

Requisitos:
- Node.js 18+
- Un proyecto Postgres (Supabase o cualquier Postgres)

Pasos rápidos:
1. Copia `.env.example` a `.env` y pega tu `DATABASE_URL` (connection string), `SESSION_SECRET` y opcional `PORT`.
2. Instala dependencias:

```bash
npm install
```

3. Ejecuta migraciones: abre `supabase_migration.sql` y ejecútalo en tu DB (o usa psql).

4. Inicia la app:

```bash
npm run dev
# o
npm start
```

5. Abre http://localhost:3000

Notas sobre Supabase y Pooler:
- Si ves "Not IPv4 compatible", usa la cadena de conexión "Pooler" desde Settings > Database > Connection string.
- Guarda la `DATABASE_URL` en `.env`.

Funcionalidad incluida:
- CRUD básico de cuartos, inquilinos.
- Crear contratos (al asignar contrato, el cuarto pasa a `occupied`).
- Registrar pagos y marcar pagos como pagados.
 - Gestión de usuarios (tabla `users`) y creación segura de usuarios (contraseña hasheada).

Siguientes pasos que puedo hacer por ti:
- Agregar autenticación para tu padre (login simple).
- Preparar Dockerfile / docker-compose.
- Automatizar migraciones con herramienta (Knex/Sequelize).

Fin.
