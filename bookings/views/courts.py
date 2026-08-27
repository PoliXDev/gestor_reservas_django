from __future__ import annotations

from datetime import date

from django.shortcuts import get_object_or_404
from django_filters import rest_framework as filters
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Resource
from bookings.serializers import ResourceSerializer
from bookings.services import AvailabilityService


class CourtFilter(filters.FilterSet):
    surface = filters.CharFilter(field_name="surface")

    class Meta:
        model = Resource
        fields = ["surface"]


class CourtListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ResourceSerializer
    filterset_class = CourtFilter
    queryset = Resource.objects.courts()


class CourtSlotsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, pk: str) -> Response:
        court = get_object_or_404(Resource.objects.courts(), pk=pk)
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

        slots = AvailabilityService.get_slots(court, day)
        return Response(
            {
                "court_id": str(court.id),
                "date": day.isoformat(),
                "slots": slots,
            }
        )
