from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any
from uuid import UUID
from zoneinfo import ZoneInfo

from django.conf import settings
from django.utils import timezone

from bookings.models import Availability, Booking, Resource


class AvailabilityService:
    @classmethod
    def get_slots(cls, resource: Resource, day: date) -> list[dict[str, Any]]:
        tz = ZoneInfo(settings.TIME_ZONE)
        windows = Availability.objects.filter(
            resource=resource,
            day_of_week=day.weekday(),
        ).order_by("open_time")

        day_start_local = datetime.combine(day, datetime.min.time(), tzinfo=tz)
        day_end_local = day_start_local + timedelta(days=1)
        day_start_utc = day_start_local.astimezone(ZoneInfo("UTC"))
        day_end_utc = day_end_local.astimezone(ZoneInfo("UTC"))

        bookings = list(
            Booking.objects.filter(
                resource=resource,
                status=Booking.Status.CONFIRMED,
                start_time__lt=day_end_utc,
                end_time__gt=day_start_utc,
            ).only("id", "start_time", "end_time")
        )

        slots: list[dict[str, Any]] = []
        for window in windows:
            cursor = datetime.combine(day, window.open_time, tzinfo=tz)
            close = datetime.combine(day, window.close_time, tzinfo=tz)
            step = timedelta(minutes=window.slot_duration_minutes)

            while cursor + step <= close:
                slot_end = cursor + step
                start_utc = cursor.astimezone(ZoneInfo("UTC"))
                end_utc = slot_end.astimezone(ZoneInfo("UTC"))
                booking_id = cls._find_overlap_booking_id(bookings, start_utc, end_utc)
                slots.append(
                    {
                        "start": start_utc.isoformat().replace("+00:00", "Z"),
                        "end": end_utc.isoformat().replace("+00:00", "Z"),
                        "status": "booked" if booking_id else "available",
                        "booking_id": str(booking_id) if booking_id else None,
                    }
                )
                cursor = slot_end

        return slots

    @staticmethod
    def _find_overlap_booking_id(
        bookings: list[Booking],
        start_utc: datetime,
        end_utc: datetime,
    ) -> UUID | None:
        for booking in bookings:
            b_start = timezone.localtime(booking.start_time, ZoneInfo("UTC"))
            b_end = timezone.localtime(booking.end_time, ZoneInfo("UTC"))
            if b_start < end_utc and b_end > start_utc:
                return booking.id
        return None
