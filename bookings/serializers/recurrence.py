from __future__ import annotations

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from bookings.models import Resource
from bookings.services import RecurrenceService


class RecurringBookingSerializer(serializers.Serializer):
    resource = serializers.PrimaryKeyRelatedField(queryset=Resource.objects.courts())
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    player_name = serializers.CharField(max_length=160)
    player_email = serializers.EmailField()
    weeks = serializers.IntegerField(min_value=RecurrenceService.MIN_WEEKS, max_value=RecurrenceService.MAX_WEEKS)

    def create(self, validated_data: dict) -> dict:
        try:
            group_id, bookings = RecurrenceService.create_weekly_series(
                resource=validated_data["resource"],
                start_time=validated_data["start_time"],
                end_time=validated_data["end_time"],
                weeks=validated_data["weeks"],
                player_name=validated_data["player_name"],
                player_email=validated_data["player_email"],
            )
        except DjangoValidationError as exc:
            raise serializers.ValidationError(
                {"non_field_errors": exc.messages if hasattr(exc, "messages") else [str(exc)]}
            ) from exc

        return {
            "recurrence_group_id": str(group_id),
            "count": len(bookings),
            "bookings": [
                {
                    "id": str(booking.id),
                    "start_time": booking.start_time,
                    "end_time": booking.end_time,
                    "status": booking.status,
                }
                for booking in bookings
            ],
        }
