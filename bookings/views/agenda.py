from __future__ import annotations

from datetime import date

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from bookings.services import AgendaService, BookingService


class AgendaDayView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        date_str = request.query_params.get("date")
        if not date_str:
            return Response(
                {
                    "error": {
                        "code": "validation_error",
                        "message": "Query param 'date' (YYYY-MM-DD) is required.",
                        "details": {},
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            day = date.fromisoformat(date_str)
        except ValueError:
            return Response(
                {
                    "error": {
                        "code": "validation_error",
                        "message": "Invalid date format. Use YYYY-MM-DD.",
                        "details": {"date": date_str},
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(AgendaService.get_day_agenda(day))


class BookingCancelView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request, pk: str) -> Response:
        booking = get_object_or_404(Booking, pk=pk)
        if booking.status == Booking.Status.CANCELLED:
            return Response({"id": str(booking.id), "status": booking.status})
        updated = BookingService.cancel_booking(str(booking.id))
        return Response({"id": str(updated.id), "status": updated.status})
