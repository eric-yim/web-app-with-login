"""Authentication handlers for Google OAuth."""

import os
import urllib.parse
from typing import Optional

import requests  # type: ignore[import-untyped]

from .db import create_user, get_user_by_email
from .logging_config import logger
from .utils import create_jwt

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "")

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


def handle_auth_action(action: str, payload: dict, user_email: Optional[str]) -> dict:
    """Handle authentication actions."""
    if action == "googleAuthUrl":
        return get_google_auth_url()
    elif action == "googleCallback":
        return handle_google_callback(payload)
    else:
        raise ValueError(f"Unknown auth action: {action}")


def get_google_auth_url() -> dict:
    """Generate Google OAuth URL."""
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    url = f"{GOOGLE_AUTH_URL}?{urllib.parse.urlencode(params)}"
    return {"url": url}


def handle_google_callback(payload: dict) -> dict:
    """Handle Google OAuth callback with authorization code."""
    code = payload.get("code")
    if not code:
        raise ValueError("Missing authorization code")

    # Exchange code for tokens
    token_response = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": GOOGLE_REDIRECT_URI,
        },
    )

    if token_response.status_code != 200:
        logger.error(
            "Token exchange failed",
            extra={
                "status": token_response.status_code,
                "response": token_response.text,
                "redirect_uri": GOOGLE_REDIRECT_URI,
            },
        )
        raise ValueError("Failed to exchange authorization code")

    tokens = token_response.json()
    access_token = tokens.get("access_token")

    # Get user info from Google
    userinfo_response = requests.get(
        GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    if userinfo_response.status_code != 200:
        logger.error(
            "Userinfo fetch failed", extra={"status": userinfo_response.status_code}
        )
        raise ValueError("Failed to get user info from Google")

    userinfo = userinfo_response.json()
    email = userinfo.get("email")
    name = userinfo.get("name", "")
    picture = userinfo.get("picture", "")

    if not email:
        raise ValueError("No email returned from Google")

    logger.info("Google auth successful", extra={"email": email})

    # Check if user exists, create if not
    user = get_user_by_email(email)
    is_new_user = False

    if not user:
        is_new_user = True
        user = create_user(email, name, picture)

    # Generate JWT
    jwt_token = create_jwt(email)

    return {
        "token": jwt_token,
        "isNewUser": is_new_user,
    }
