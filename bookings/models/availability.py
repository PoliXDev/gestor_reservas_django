from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models

from .resource import Resource


class Availability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name="availabilities",
    )
    day_of_week = models.PositiveSmallIntegerField(
        help_text="0=Monday ... 6=Sunday",
    )
    open_time = models.TimeField()
    close_time = models.TimeField()
    slot_duration_minutes = models.PositiveIntegerField(default=60)

    class Meta:
        ordering = ["resource", "day_of_week", "open_time"]
        verbose_name_plural = "availabilities"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(open_time__lt=models.F("close_time")),
                name="availability_open_before_close",
            ),
            models.CheckConstraint(
                condition=models.Q(day_of_week__gte=0) & models.Q(day_of_week__lte=6),
                name="availability_valid_weekday",
            ),
        ]

    def clean(self) -> None:
        if self.open_time and self.close_time and self.open_time >= self.close_time:
            raise ValidationError("open_time must be before close_time.")

    def __str__(self) -> str:
        return f"{self.resource} d{self.day_of_week} {self.open_time}-{self.close_time}"
