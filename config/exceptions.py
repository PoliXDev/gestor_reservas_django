from __future__ import annotations

from typing import Any

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def api_exception_handler(exc: Exception, context: dict[str, Any]) -> Response | None:
    response = exception_handler(exc, context)

    if isinstance(exc, DjangoValidationError):
        messages = exc.messages if hasattr(exc, "messages") else [str(exc)]
        return Response(
            {
                "error": {
                    "code": "validation_error",
                    "message": messages[0] if messages else "Validation error",
                    "details": {"messages": messages},
                }
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if response is None:
        return None

    data = response.data
    if isinstance(data, dict) and "detail" in data:
        message = str(data["detail"])
        details = {k: v for k, v in data.items() if k != "detail"}
    elif isinstance(data, dict) and "non_field_errors" in data:
        errs = data["non_field_errors"]
        message = str(errs[0]) if errs else "Request failed"
        details = data
    else:
        message = "Request failed"
        details = data if isinstance(data, dict) else {"raw": data}

    code = "error"
    if response.status_code == status.HTTP_401_UNAUTHORIZED:
        code = "unauthorized"
    elif response.status_code == status.HTTP_403_FORBIDDEN:
        code = "forbidden"
    elif response.status_code == status.HTTP_404_NOT_FOUND:
        code = "not_found"
    elif response.status_code == status.HTTP_400_BAD_REQUEST:
        code = "validation_error"

    response.data = {
        "error": {
            "code": code,
            "message": message if isinstance(message, str) else "Request failed",
            "details": details if isinstance(details, dict) else {},
        }
    }
    return response
