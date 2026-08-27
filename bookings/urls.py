from django.urls import path

from bookings.views import (
    AgendaDayView,
    BookingCancelView,
    BookingCreateView,
    CourtListView,
    CourtSlotsView,
)

urlpatterns = [
    path("courts/", CourtListView.as_view(), name="court-list"),
    path("courts/<uuid:pk>/slots/", CourtSlotsView.as_view(), name="court-slots"),
    path("bookings/", BookingCreateView.as_view(), name="booking-create"),
    path("bookings/<uuid:pk>/cancel/", BookingCancelView.as_view(), name="booking-cancel"),
    path("agenda/", AgendaDayView.as_view(), name="agenda-day"),
]
