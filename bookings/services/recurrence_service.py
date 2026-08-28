from __future__ import annotations

from datetime import datetime, timedelta
from uuid import UUID, uuid4

from django.core.exceptions import ValidationError
from django.db import transaction

from bookings.models import Booking, Resource
from bookings.services.booking_service import BookingService


class RecurrenceService:
    MIN_WEEKS = 2
    MAX_WEEKS = 8

    @classmethod
    @transaction.atomic
    def create_weekly_series(
        cls,
        resource: Resource,
        start_time: datetime,
        end_time: datetime,
        weeks: int,
        player_name: str = "",
        player_email: str = "",
    ) -> tuple[UUID, list[Booking]]:
        if weeks < cls.MIN_WEEKS or weeks > cls.MAX_WEEKS:
            raise ValidationError(
                f"Weeks must be between {cls.MIN_WEEKS} and {cls.MAX_WEEKS}."
            )
        if start_time >= end_time:
            raise ValidationError("End time must be after start time.")

        Resource.objects.select_for_update().get(pk=resource.pk)

        occurrences: list[tuple[datetime, datetime]] = []
        for offset in range(weeks):
            delta = timedelta(weeks=offset)
            occurrences.append((start_time + delta, end_time + delta))

        for occ_start, occ_end in occurrences:
            if BookingService._confirmed_overlap_qs(resource, occ_start, occ_end).exists():
                raise ValidationError(
                    f"The slot on {occ_start.date()} is already reserved."
                )

        group_id = uuid4()
        player = BookingService.resolve_player_user(player_email, player_name)
        bookings: list[Booking] = []

        for occ_start, occ_end in occurrences:
            bookings.append(
                Booking.objects.create(
                    user=player,
                    resource=resource,
                    start_time=occ_start,
                    end_time=occ_end,
                    status=Booking.Status.CONFIRMED,
                    recurrence_group_id=group_id,
                    player_name=player_name.strip(),
                    player_email=player_email.strip(),
                )
            )

        return group_id, bookings
