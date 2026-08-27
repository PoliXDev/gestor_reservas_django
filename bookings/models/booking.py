from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models

from .resource import Resource


class Booking(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"
        PENDING = "PENDING", "Pending"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.CONFIRMED,
    )
    recurrence_group_id = models.UUIDField(null=True, blank=True)
    player_name = models.CharField(max_length=160, blank=True, default="")
    player_email = models.EmailField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_time"]
        indexes = [
            models.Index(
                fields=["resource", "start_time", "end_time", "status"],
                name="booking_resource_range_status",
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(start_time__lt=models.F("end_time")),
                name="booking_start_before_end",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.resource} {self.start_time}→{self.end_time} [{self.status}]"
