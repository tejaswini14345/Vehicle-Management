import json
import logging
import os

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def send_email(subject, body, recipient):
    source_email = os.environ.get("SES_SOURCE_EMAIL")
    if not source_email:
        logger.info("SES_SOURCE_EMAIL is not configured; skipping purchase email")
        return False

    region = os.environ.get("SES_REGION", "us-east-2")
    ses = boto3.client("ses", region_name=region)

    try:
        response = ses.send_email(
            Source=source_email,
            Destination={"ToAddresses": [recipient]},
            Message={
                "Subject": {"Data": subject},
                "Body": {"Text": {"Data": body}},
            },
        )
        logger.info("Purchase email sent with message id %s", response["MessageId"])
        return True
    except ClientError:
        logger.exception("Unable to send purchase email")
        return False


def _response(status_code, payload):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(payload),
    }


def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method")
    if method != "POST":
        return _response(405, {"message": "Method not allowed"})

    dynamodb = boto3.resource("dynamodb")
    transactions_table = dynamodb.Table(
        os.environ.get("TRANSACTIONS_TABLE_NAME", "UserTransactions")
    )
    vehicle_table = dynamodb.Table(
        os.environ.get("VEHICLE_TABLE_NAME", "VehicleCatalog")
    )
    user_table = dynamodb.Table(
        os.environ.get("USER_TABLE_NAME", "User")
    )

    try:
        data = json.loads(event.get("body") or "{}")
        user_id = data.get("user_id")
        vehicle_id = data.get("vehicle_id")
        transaction_id = data.get("transaction_id")
        transaction_date = data.get("transaction_date")

        if not all([user_id, vehicle_id, transaction_id, transaction_date]):
            return _response(
                400,
                {"message": "user_id, vehicle_id, transaction_id, and transaction_date are required"},
            )

        vehicle_record = vehicle_table.get_item(Key={"vehicle_id": vehicle_id})
        vehicle = vehicle_record.get("Item")
        if not vehicle:
            return _response(404, {"message": "Vehicle not found"})

        if str(vehicle.get("available", "true")).lower() == "false":
            return _response(409, {"message": "Vehicle is not available for purchase"})

        user_record = user_table.get_item(Key={"user_id": user_id})
        user = user_record.get("Item")
        if not user:
            return _response(404, {"message": "User not found"})

        vehicle_table.update_item(
            Key={"vehicle_id": vehicle_id},
            UpdateExpression="SET available = :available",
            ExpressionAttributeValues={":available": "false"},
        )

        transactions_table.put_item(
            Item={
                "transaction_id": transaction_id,
                "user_id": user_id,
                "vehicle_id": vehicle_id,
                "transaction_date": transaction_date,
                "transaction_type": "Purchased",
                "status": "Completed",
            }
        )

        email_sent = send_email(
            "Vehicle Purchased Successfully",
            (
                f"Dear {user.get('name', 'customer')},\n\n"
                f"You have successfully purchased the "
                f"{vehicle.get('make', '')} {vehicle.get('model', '')} "
                f"with ID {vehicle_id}.\n\n"
                "Best regards,\nThe Vehicle Sales Team"
            ),
            user.get("email", ""),
        )

        return _response(
            200,
            {
                "message": "Vehicle purchased successfully",
                "email_sent": email_sent,
            },
        )

    except (json.JSONDecodeError, TypeError):
        return _response(400, {"message": "Invalid request body"})
    except ClientError:
        logger.exception("AWS operation failed during vehicle purchase")
        return _response(500, {"message": "Unable to complete vehicle purchase"})
