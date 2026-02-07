"""Lambda handler module."""

from .logging_config import logger
from .router import route_request


def lambda_handler(event, context):
    """Handle incoming Lambda events."""
    logger.info(
        "Request received",
        extra={"path": event.get("path"), "method": event.get("httpMethod")},
    )
    return route_request(event, context)
