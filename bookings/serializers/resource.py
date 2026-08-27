from rest_framework import serializers

from bookings.models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = (
            "id",
            "name",
            "resource_type",
            "surface",
            "capacity",
            "image_url",
            "description",
            "is_active",
        )
        read_only_fields = fields
