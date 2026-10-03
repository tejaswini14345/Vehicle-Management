import base64
import hashlib
import json
import os
import uuid

import boto3
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError

ITERATIONS = 210_000


def _hash_password(password):
    salt_bytes = os.urandom(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt_bytes,
        ITERATIONS,
    )
    return (
        base64.b64encode(digest).decode("ascii"),
        base64.b64encode(salt_bytes).decode("ascii"),
    )


def _cors_headers():
    origin = os.environ.get("ALLOWED_ORIGIN", "http://localhost:4200")
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
    }


def _response(status_code, payload):
    return {
        "statusCode": status_code,
        "headers": _cors_headers(),
        "body": json.dumps(payload),
    }


def lambda_handler(event, context):
    http_method = event.get("requestContext", {}).get("http", {}).get("method")

    if http_method == "OPTIONS":
        return _response(204, {})

    if http_method != "POST":
        return _response(405, {"message": "Method not allowed"})

    table_name = os.environ.get("USER_TABLE_NAME", "User")
    table = boto3.resource("dynamodb").Table(table_name)

    try:
        data = json.loads(event.get("body") or "{}")
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))
        role = str(data.get("role", "")).strip()
        name = str(data.get("name", "")).strip()

        if not email or not password or not role:
            return _response(
                400,
                {"message": "Email, password, and role are required"},
            )

        if len(password) < 8:
            return _response(
                400,
                {"message": "Password must contain at least 8 characters"},
            )

        existing = table.scan(FilterExpression=Attr("email").eq(email))
        if existing.get("Items"):
            return _response(409, {"message": "User already exists"})

        password_hash, password_salt = _hash_password(password)
        user_id = str(uuid.uuid4())

        table.put_item(
            Item={
                "user_id": user_id,
                "name": name,
                "email": email,
                "role": role,
                "password_hash": password_hash,
                "password_salt": password_salt,
            }
        )

        return _response(
            201,
            {
                "message": "User registered successfully",
                "user_id": user_id,
            },
        )

    except (json.JSONDecodeError, TypeError):
        return _response(400, {"message": "Invalid request body"})
    except ClientError:
        return _response(500, {"message": "Unable to register user"})
