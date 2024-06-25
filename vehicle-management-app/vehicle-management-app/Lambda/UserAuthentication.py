import json
import boto3
from boto3.dynamodb.conditions import Attr  # Add this import line
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('User')  # Table name

    try:
        data = json.loads(event['body'])
        email = data['email']
        password = data['password']

        # Check if the user exists
        response = table.scan(
            FilterExpression=Attr('email').eq(email)
        )

        if 'Items' in response and len(response['Items']) > 0:
            user = response['Items'][0]

            # Check if the provided password matches the stored hashed password
            if user['password'] == password:
                return {
                    'statusCode': 200,
                    'body': json.dumps(user)
                }

        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Authentication failed: Invalid email or password'})
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error authenticating user: ' + str(e)})
        }
