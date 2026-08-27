from __future__ import annotations

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from bookings.models import Booking, Resource
from bookings.services import BookingService


class BookingSerializer(serializers.ModelSerializer):
    resource = serializers.PrimaryKeyRelatedField(
        queryset=Resource.objects.courts(),
    )

    class Meta:
        model = Booking
        fields = (
            "id",
            "resource",
            "start_time",
            "end_time",
            "status",
            "recurrence_group_id",
            "player_name",
            "player_email",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "status",
            "recurrence_group_id",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data: dict) -> Booking:
        try:
            return BookingService.create_booking(
                resource=validated_data["resource"],
                start_time=validated_data["start_time"],
                end_time=validated_data["end_time"],
                player_name=validated_data.get("player_name", ""),
                player_email=validated_data.get("player_email", ""),
            )
        except DjangoValidationError as exc:
            raise serializers.ValidationError(
                {"non_field_errors": exc.messages if hasattr(exc, "messages") else [str(exc)]}
            ) from exc
