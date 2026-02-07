"""Test configuration - set environment variables before module imports."""

import os

os.environ.setdefault("GOOGLE_CLIENT_ID", "test-client-id")
os.environ.setdefault("GOOGLE_CLIENT_SECRET", "test-client-secret")
os.environ.setdefault("GOOGLE_REDIRECT_URI", "https://testsite.com/oauth/callback")
os.environ.setdefault("JWT_SECRET", "test-jwt-secret")
os.environ.setdefault("USERS_TABLE", "test-users-table")
