"""DynamoDB operations for user data."""

import os
from datetime import datetime, timezone
from typing import Optional

import boto3

from .logging_config import logger

USERS_TABLE = os.environ.get("USERS_TABLE", "")

dynamodb = boto3.resource("dynamodb")


def _users_table():
    return dynamodb.Table(USERS_TABLE)


def get_user_by_email(email: str) -> Optional[dict]:
    """Get a user by email address."""
    response = _users_table().get_item(Key={"userEmail": email})
    return response.get("Item")


def create_user(email: str, name: str, picture: str) -> dict:
    """Create a new user record."""
    now = datetime.now(timezone.utc).isoformat()
    item = {
        "userEmail": email,
        "displayName": name,
        "avatarUrl": picture,
        "createdAt": now,
        "updatedAt": now,
    }
    _users_table().put_item(Item=item)
    logger.info("User created", extra={"email": email})
    return item
