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
- Despliegue: Render (ver `render.yaml`)

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

