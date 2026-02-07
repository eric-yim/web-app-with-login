"""Utility functions for the backend."""

import json
import os
import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Optional

import jwt


class DecimalEncoder(json.JSONEncoder):
    """JSON encoder that handles Decimal types from DynamoDB."""

    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super().default(obj)


# CORS allowed origins
ALLOWED_ORIGINS = [
    "https://FILLIN_DOMAIN",
    "http://localhost:5173",
]

JWT_SECRET = os.environ.get("JWT_SECRET", "")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_DAYS = 30


def get_cors_headers(event: dict) -> dict:
    """Get CORS headers based on request origin."""
    headers = event.get("headers") or {}
    origin = headers.get("origin", "") or headers.get("Origin", "")
    if origin in ALLOWED_ORIGINS:
        allowed_origin = origin
    else:
        allowed_origin = ALLOWED_ORIGINS[0]

    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": allowed_origin,
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Credentials": "true",
    }


def create_response(status_code: int, body: object, headers: dict) -> dict:
    """Create a Lambda response object."""
    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body, cls=DecimalEncoder) if body else "",
    }


def create_jwt(user_email: str) -> str:
    """Create a JWT token for a user."""
    payload = {
        "email": user_email,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRY_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_jwt(token: str) -> Optional[str]:
    """Verify a JWT token and return the user email."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("email")
        return str(email) if email else None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_current_user(event: dict) -> Optional[str]:
    """Extract and verify the current user from the Authorization header."""
    headers = event.get("headers") or {}
    auth_header = headers.get("Authorization") or headers.get("authorization", "")

    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header[7:]  # Remove "Bearer " prefix
    return verify_jwt(token)


def generate_ulid() -> str:
    """Generate a ULID-like ID (timestamp + random)."""
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
    random_part = uuid.uuid4().hex[:8]
    return f"{timestamp}-{random_part}"
