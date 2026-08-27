from rest_framework import generics
from rest_framework.permissions import AllowAny

from bookings.models import Booking
from bookings.serializers import BookingSerializer


class BookingCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()
