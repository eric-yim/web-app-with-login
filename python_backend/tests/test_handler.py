"""Tests for the Lambda handler."""

import json

from python_backend.handler import lambda_handler


def test_missing_action():
    """Test that missing action returns 400."""
    event = {
        "httpMethod": "POST",
        "headers": {"origin": "https://FILLIN_DOMAIN"},
        "body": json.dumps({}),
    }
    response = lambda_handler(event, None)
    assert response["statusCode"] == 400
    body = json.loads(response["body"])
    assert body["error"] == "Missing action"


def test_options_preflight():
    """Test OPTIONS preflight returns 200."""
    event = {
        "httpMethod": "OPTIONS",
        "headers": {"origin": "https://FILLIN_DOMAIN"},
    }
    response = lambda_handler(event, None)
    assert response["statusCode"] == 200


def test_ping():
    """Test ping action returns ok status."""
    event = {
        "httpMethod": "POST",
        "headers": {"origin": "https://FILLIN_DOMAIN"},
        "body": json.dumps({"action": "ping"}),
    }
    response = lambda_handler(event, None)
    assert response["statusCode"] == 200
    body = json.loads(response["body"])
    assert body["status"] == "ok"
    assert body["service"] == "FILLIN_PROJECT_NAME"


def test_google_auth_url():
    """Test googleAuthUrl returns a URL containing Google OAuth endpoint."""
    event = {
        "httpMethod": "POST",
        "headers": {"origin": "https://FILLIN_DOMAIN"},
        "body": json.dumps({"action": "googleAuthUrl"}),
    }
    response = lambda_handler(event, None)
    assert response["statusCode"] == 200
    body = json.loads(response["body"])
    assert "url" in body
    assert "accounts.google.com" in body["url"]
    assert "test-client-id" in body["url"]


def test_google_callback_missing_code():
    """Test googleCallback returns 400 when code is missing."""
    event = {
        "httpMethod": "POST",
        "headers": {"origin": "https://FILLIN_DOMAIN"},
        "body": json.dumps({"action": "googleCallback", "payload": {}}),
    }
    response = lambda_handler(event, None)
    assert response["statusCode"] == 400
    body = json.loads(response["body"])
    assert "Missing authorization code" in body["error"]


def test_get_me_unauthorized():
    """Test getMe returns 401 when no token is provided."""
    event = {
        "httpMethod": "POST",
        "headers": {"origin": "https://FILLIN_DOMAIN"},
        "body": json.dumps({"action": "getMe"}),
    }
    response = lambda_handler(event, None)
    assert response["statusCode"] == 401
    body = json.loads(response["body"])
    assert body["error"] == "Unauthorized"
