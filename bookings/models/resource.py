from __future__ import annotations

import uuid

from django.db import models


class ResourceQuerySet(models.QuerySet):
    def active(self) -> ResourceQuerySet:
        return self.filter(is_active=True)

    def courts(self) -> ResourceQuerySet:
        return self.active().filter(resource_type=Resource.ResourceType.COURT)


class ResourceManager(models.Manager.from_queryset(ResourceQuerySet)):
    pass


class Resource(models.Model):
    class ResourceType(models.TextChoices):
        COURT = "COURT", "Court"
        MEETING_ROOM = "MEETING_ROOM", "Meeting room"
        STUDIO = "STUDIO", "Studio"

    class Surface(models.TextChoices):
        CLAY = "CLAY", "Tierra batida"
        GRASS = "GRASS", "Hierba"
        HARD = "HARD", "Dura"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    resource_type = models.CharField(
        max_length=32,
        choices=ResourceType.choices,
        default=ResourceType.COURT,
    )
    surface = models.CharField(
        max_length=16,
        choices=Surface.choices,
        blank=True,
        null=True,
    )
    capacity = models.PositiveIntegerField(default=4)
    image_url = models.URLField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ResourceManager()

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
