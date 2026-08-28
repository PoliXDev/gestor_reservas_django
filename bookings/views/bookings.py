from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from bookings.serializers import BookingSerializer, RecurringBookingSerializer


class BookingCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()


class RecurringBookingCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RecurringBookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.save(), status=status.HTTP_201_CREATED)
