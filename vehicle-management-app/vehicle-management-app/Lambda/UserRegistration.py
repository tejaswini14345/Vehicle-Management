import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr  # Add this import line
import uuid  # Import the uuid module

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('User')  # Table name

    # Extract the HTTP method
    http_method = event['requestContext']['http']['method']

    # Handle OPTIONS request separately
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Preflight success'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
        }

    try:
        data = json.loads(event['body'])
        email = data['email']
        password = data['password']
        role = data['role']
        name = data.get('name')  # Assuming you have a 'name' field in your data

        # Check if the user already exists based on email
        response = table.scan(
            FilterExpression=Attr('email').eq(email)
        )

        if 'Items' in response and len(response['Items']) > 0:
            # User with the provided email already exists
            return {
                'statusCode': 400,
                'body': json.dumps('User already exists'),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                },
            }

        # If the user does not exist, register them
        user_id = str(uuid.uuid4())  # Generate a new user_id
        table.put_item(Item={
            'user_id': user_id,
            'name': name,
            'email': email,
            'role': role,
            'password': password,
            # Add other user details as needed
        })

        return {
            'statusCode': 200,
            'body': json.dumps('User registered successfully'),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error registering user: ' + str(e)),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
        }
