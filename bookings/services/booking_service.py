from __future__ import annotations

from datetime import datetime
from uuid import UUID

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import QuerySet

from bookings.models import Booking, Resource

User = get_user_model()


class BookingService:
    @staticmethod
    def _confirmed_overlap_qs(
        resource: Resource,
        start_time: datetime,
        end_time: datetime,
        exclude_booking_id: UUID | None = None,
    ) -> QuerySet[Booking]:
        qs = Booking.objects.filter(
            resource=resource,
            status=Booking.Status.CONFIRMED,
            start_time__lt=end_time,
            end_time__gt=start_time,
        )
        if exclude_booking_id is not None:
            qs = qs.exclude(id=exclude_booking_id)
        return qs

    @classmethod
    @transaction.atomic
    def create_booking(
        cls,
        resource: Resource,
        start_time: datetime,
        end_time: datetime,
        recurrence_group_id: UUID | None = None,
        player_name: str = "",
        player_email: str = "",
    ) -> Booking:
        if start_time >= end_time:
            raise ValidationError("End time must be after start time.")

        if cls._confirmed_overlap_qs(resource, start_time, end_time).select_for_update().exists():
            raise ValidationError("The requested time slot is already reserved.")

        player = cls.resolve_player_user(player_email, player_name)

        return Booking.objects.create(
            user=player,
            resource=resource,
            start_time=start_time,
            end_time=end_time,
            status=Booking.Status.CONFIRMED,
            recurrence_group_id=recurrence_group_id,
            player_name=player_name.strip(),
            player_email=player_email.strip(),
        )

    @staticmethod
    def resolve_player_user(player_email: str, player_name: str) -> AbstractBaseUser:
        email = player_email.strip().lower()
        existing = User.objects.filter(email__iexact=email).first()
        if existing:
            return existing

        base = (email.split("@")[0] or "jugador")[:140]
        username = base
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{suffix}"
            suffix += 1

        user = User(username=username, email=email)
        user.set_unusable_password()
        parts = player_name.strip().split(None, 1)
        if parts:
            user.first_name = parts[0][:150]
            if len(parts) > 1:
                user.last_name = parts[1][:150]
        user.save()
        return user

    @classmethod
    @transaction.atomic
    def cancel_booking(cls, booking_id: str) -> Booking:
        booking = Booking.objects.select_for_update().get(pk=booking_id)
        booking.status = Booking.Status.CANCELLED
        booking.save(update_fields=["status", "updated_at"])
        return booking
