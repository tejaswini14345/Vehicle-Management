import base64
import hashlib
import hmac
import json
import os

import boto3
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError

ITERATIONS = 210_000


def _hash_password(password, salt_bytes):
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt_bytes,
        ITERATIONS,
    )
    return base64.b64encode(digest).decode("ascii")


def _verify_password(user, password):
    password_hash = user.get("password_hash")
    salt = user.get("password_salt")

    if password_hash and salt:
        try:
            salt_bytes = base64.b64decode(salt)
        except (ValueError, TypeError):
            return False

        candidate = _hash_password(password, salt_bytes)
        return hmac.compare_digest(candidate, password_hash)

    # Backward compatibility for legacy records created before password hashing
    legacy_password = user.get("password")
    return legacy_password is not None and hmac.compare_digest(
        str(legacy_password),
        password,
    )


def _migrate_legacy_password(table, user, password):
    if user.get("password_hash") or not user.get("user_id"):
        return

    salt_bytes = os.urandom(16)
    table.update_item(
        Key={"user_id": user["user_id"]},
        UpdateExpression=(
            "SET password_hash = :password_hash, password_salt = :password_salt "
            "REMOVE password"
        ),
        ExpressionAttributeValues={
            ":password_hash": _hash_password(password, salt_bytes),
            ":password_salt": base64.b64encode(salt_bytes).decode("ascii"),
        },
    )


def _response(status_code, payload):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(payload),
    }


def lambda_handler(event, context):
    table_name = os.environ.get("USER_TABLE_NAME", "User")
    table = boto3.resource("dynamodb").Table(table_name)

    try:
        data = json.loads(event.get("body") or "{}")
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))

        if not email or not password:
            return _response(400, {"message": "Email and password are required"})

        response = table.scan(FilterExpression=Attr("email").eq(email))
        users = response.get("Items", [])

        if not users:
            return _response(401, {"message": "Invalid email or password"})

        user = users[0]
        if not _verify_password(user, password):
            return _response(401, {"message": "Invalid email or password"})

        _migrate_legacy_password(table, user, password)

        safe_user = {
            "user_id": user.get("user_id"),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role"),
        }
        return _response(200, safe_user)

    except (json.JSONDecodeError, TypeError):
        return _response(400, {"message": "Invalid request body"})
    except ClientError:
        return _response(500, {"message": "Unable to authenticate user"})
