from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from django.conf import settings

from bookings.models import Booking, Resource


class AgendaService:
    @classmethod
    def get_day_agenda(cls, day: date) -> dict[str, Any]:
        tz = ZoneInfo(settings.TIME_ZONE)
        day_start = datetime.combine(day, time.min, tzinfo=tz).astimezone(ZoneInfo("UTC"))
        day_end = datetime.combine(day + timedelta(days=1), time.min, tzinfo=tz).astimezone(
            ZoneInfo("UTC")
        )

        courts = list(Resource.objects.courts().order_by("name"))
        bookings = (
            Booking.objects.filter(
                resource__in=courts,
                status=Booking.Status.CONFIRMED,
                start_time__lt=day_end,
                end_time__gt=day_start,
            )
            .select_related("resource")
            .order_by("start_time")
        )

        by_court: dict[str, list[Booking]] = {str(c.id): [] for c in courts}
        for booking in bookings:
            by_court[str(booking.resource_id)].append(booking)

        return {
            "date": day.isoformat(),
            "courts": [
                {
                    "id": str(court.id),
                    "name": court.name,
                    "surface": court.surface,
                    "bookings": [
                        {
                            "id": str(b.id),
                            "start_time": b.start_time.isoformat(),
                            "end_time": b.end_time.isoformat(),
                            "status": b.status,
                            "player_name": b.player_name,
                            "player_email": b.player_email,
                            "recurrence_group_id": (
                                str(b.recurrence_group_id) if b.recurrence_group_id else None
                            ),
                        }
                        for b in by_court[str(court.id)]
                    ],
                }
                for court in courts
            ],
        }
