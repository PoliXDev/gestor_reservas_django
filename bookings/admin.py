from django.contrib import admin

from bookings.models import Availability, Booking, Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("name", "resource_type", "surface", "capacity", "is_active")
    list_filter = ("resource_type", "surface", "is_active")
    search_fields = ("name",)


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = (
        "resource",
        "day_of_week",
        "open_time",
        "close_time",
        "slot_duration_minutes",
    )
    list_filter = ("day_of_week", "slot_duration_minutes", "resource")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("resource", "player_name", "player_email", "user", "start_time", "end_time", "status")
    list_filter = ("status", "resource")
    search_fields = ("player_name", "player_email", "user__username", "resource__name")
    raw_id_fields = ("user", "resource")
