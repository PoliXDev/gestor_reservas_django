# Gestor de Reservas — Club de Tenis (Projecto Django) Academia Conquerblocks

Sistema para reservar recursos (pistas deportivas / salas).centrado en pistas de tenis.

## Flujo de la app

**Landing → Reservar → Agenda**

1. Landing con hero y descripción del producto
2. Calendario de pistas, filtros por superficie y reserva en 2 pasos
3. Agenda del día y cancelar reservas

## Stack

- Backend: Django 5 + DRF (`config/`, `bookings/`)
- Frontend: React + Vite + Tailwind (`frontend/`)
- Despliegue: Render (`render.yaml`)

## Arranque local

```bash
# API
./env/bin/python manage.py migrate
./env/bin/python manage.py seed_tennis_data
./env/bin/python manage.py runserver

# UI (otra terminal)
cd frontend && npm install && npm run dev
```

- UI: http://127.0.0.1:5173
- API: http://127.0.0.1:8000

## Despliegue en Render

El Blueprint (`render.yaml`) crea:

1. **Postgres** — `gestor-reservas-db`
2. **API** — `gestor-reservas-api` (Gunicorn + migraciones + seed)
3. **Frontend** — `gestor-reservas-web` (Static Site Vite)

### Pasos

1. En [Render](https://dashboard.render.com): **New → Blueprint**.
2. Conecta el repo `PoliXDev/gestor_reservas_django` y aplica el Blueprint.
3. Espera a que terminen DB + API + Static Site.
4. Abre la URL del Static Site (`https://gestor-reservas-web.onrender.com`).

### URLs esperadas

| Servicio | URL |
|----------|-----|
| Frontend | https://gestor-reservas-web.onrender.com |
| API | https://gestor-reservas-api.onrender.com |
| Health | https://gestor-reservas-api.onrender.com/api/health/ |

Si Render asigna otro hostname (nombre ocupado), actualiza en el dashboard:

- API → `CORS_ALLOWED_ORIGINS` y `CSRF_TRUSTED_ORIGINS` con la URL real del frontend
- Frontend → `VITE_API_URL` con la URL real del API y **redeploy** del Static Site (Vite la incrusta en el build)

### Notas

- Plan free: el API puede dormir; la primera petición tarda ~30–60 s.
- Tras el primer deploy puedes poner `RUN_SEED=false` en el API si no quieres volver a sembrar en cada build.
