from __future__ import annotations

from datetime import time

from django.core.management.base import BaseCommand
from django.db import transaction

from bookings.models import Availability, Booking, Resource

COURTS = [
    {
        "name": "Pista Central",
        "surface": Resource.Surface.HARD,
        "slot_duration_minutes": 60,
        "capacity": 4,
        "description": "Pista dura principal del club.",
        "image_url": (
            "https://images.unsplash.com/photo-1554068865-24cecd4e34b8"
            "?auto=format&fit=crop&w=1200&q=80"
        ),
    },
    {
        "name": "Tierra Batida 1",
        "surface": Resource.Surface.CLAY,
        "slot_duration_minutes": 60,
        "capacity": 4,
        "description": "Tierra batida al aire libre.",
        "image_url": (
            "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6"
            "?auto=format&fit=crop&w=1200&q=80"
        ),
    },
    {
        "name": "Tierra Batida 2",
        "surface": Resource.Surface.CLAY,
        "slot_duration_minutes": 90,
        "capacity": 4,
        "description": "Tierra batida con slots de 90 minutos.",
        "image_url": (
            "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0"
            "?auto=format&fit=crop&w=1200&q=80"
        ),
    },
    {
        "name": "Hierba Norte",
        "surface": Resource.Surface.GRASS,
        "slot_duration_minutes": 60,
        "capacity": 4,
        "description": "Pista de hierba natural.",
        "image_url": (
            "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff"
            "?auto=format&fit=crop&w=1200&q=80"
        ),
    },
]


class Command(BaseCommand):
    help = "Carga pistas de tenis y horarios semanales (08:00-22:00)."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Elimina reservas, horarios y pistas antes de cargar.",
        )

    @transaction.atomic
    def handle(self, *args, **options) -> None:
        if options["flush"]:
            Booking.objects.all().delete()
            Availability.objects.all().delete()
            Resource.objects.courts().delete()
            self.stdout.write(self.style.WARNING("Pistas, horarios y reservas eliminados."))

        courts: list[Resource] = []
        availability_count = 0

        for spec in COURTS:
            court, _ = Resource.objects.update_or_create(
                name=spec["name"],
                defaults={
                    "resource_type": Resource.ResourceType.COURT,
                    "surface": spec["surface"],
                    "capacity": spec["capacity"],
                    "description": spec["description"],
                    "image_url": spec["image_url"],
                    "is_active": True,
                },
            )
            courts.append(court)

            for day in range(7):
                Availability.objects.update_or_create(
                    resource=court,
                    day_of_week=day,
                    open_time=time(8, 0),
                    defaults={
                        "close_time": time(22, 0),
                        "slot_duration_minutes": spec["slot_duration_minutes"],
                    },
                )
                availability_count += 1

        self.stdout.write(self.style.SUCCESS("Seed complete."))
        self.stdout.write(f"  Courts: {len(courts)}")
        self.stdout.write(f"  Availability windows upserted: {availability_count}")
