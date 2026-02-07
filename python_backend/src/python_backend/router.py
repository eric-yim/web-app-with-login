"""Router for handling API actions."""

import json
from typing import Any

from .auth import handle_auth_action
from .db import get_user_by_email
from .logging_config import logger
from .utils import create_response, get_cors_headers, get_current_user

# Actions that don't require authentication
PUBLIC_ACTIONS = {
    "ping",
    "googleAuthUrl",
    "googleCallback",
    "getPublicProfile",
}


def route_request(event: dict, context: Any) -> dict:
    """Route incoming requests to appropriate handlers."""
    headers = get_cors_headers(event)

    # Handle OPTIONS preflight
    if event.get("httpMethod") == "OPTIONS":
        return create_response(200, "", headers)

    # Parse request body
    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return create_response(400, {"error": "Invalid JSON body"}, headers)

    action = body.get("action")
    payload = body.get("payload", {})

    if not action:
        return create_response(400, {"error": "Missing action"}, headers)

    logger.info("Processing action", extra={"action": action})

    # Always try to extract user email
    user_email = get_current_user(event)

    # Reject if protected action and not authenticated
    if action not in PUBLIC_ACTIONS and not user_email:
        return create_response(401, {"error": "Unauthorized"}, headers)

    # Route to appropriate handler
    try:
        if action == "ping":
            return create_response(200, {"status": "ok", "service": "FILLIN_PROJECT_NAME"}, headers)

        # Auth actions
        if action in ("googleAuthUrl", "googleCallback"):
            result = handle_auth_action(action, payload, user_email)
            return create_response(200, result, headers)

        # User actions
        if action == "getMe":
            user = get_user_by_email(user_email)
            if not user:
                return create_response(404, {"error": "User not found"}, headers)
            return create_response(
                200,
                {
                    "email": user.get("userEmail"),
                    "displayName": user.get("displayName"),
                    "avatarUrl": user.get("avatarUrl"),
                },
                headers,
            )

        return create_response(400, {"error": f"Unknown action: {action}"}, headers)

    except ValueError as e:
        logger.warning("Validation error", extra={"error": str(e)})
        return create_response(400, {"error": str(e)}, headers)
    except Exception as e:
        logger.exception("Unexpected error", extra={"error": str(e)})
        return create_response(500, {"error": "Internal server error"}, headers)
