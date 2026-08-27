from django.http import JsonResponse
from django.views import View


class HealthView(View):
    def get(self, request):  # noqa: ARG002
        return JsonResponse({"status": "ok"})
