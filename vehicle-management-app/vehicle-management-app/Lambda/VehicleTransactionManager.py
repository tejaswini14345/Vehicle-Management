import json
import boto3
from botocore.exceptions import ClientError
import time

def send_email(subject, body, recipient):
    ses = boto3.client('ses', region_name='us-east-2')
    source_email = 'chandandhonadhi@outlook.com'  # Replace with your SES verified email address

    try:
        response = ses.send_email(
            Source=source_email,
            Destination={
                'ToAddresses': [recipient],
            },
            Message={
                'Subject': {
                    'Data': subject,
                },
                'Body': {
                    'Text': {
                        'Data': body,
                    },
                },
            },
        )
        print("Email sent successfully: {}".format(response['MessageId']))
    except ClientError as e:
        print("Error sending email: {}".format(e))

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    user_transactions_table = dynamodb.Table('UserTransactions')  # UserTransactions table name
    vehicle_catalog_table = dynamodb.Table('VehicleCatalog')  # VehicleCatalog table name
    user_table = dynamodb.Table('User')  # User table name

    if event['requestContext']['http']['method'] == 'POST':
        # Purchase a vehicle
        data = json.loads(event['body'])
        user_id = data['user_id']
        vehicle_id = data['vehicle_id']

        # Check if the vehicle is available
        try:
            vehicle_record = vehicle_catalog_table.get_item(
                Key={
                    'vehicle_id': vehicle_id
                }
            )
            if not vehicle_record.get('Item', {}):
                return {
                    'statusCode': 400,
                    'body': json.dumps('The vehicle is not available for purchase.')
                }
        except ClientError as e:
            return {
                'statusCode': 500,
                'body': json.dumps('Error checking vehicle availability: ' + str(e))
            }

        # Create a new transaction

        # Update the vehicle's status to unavailable
        try:
            vehicle_catalog_table.update_item(
                Key={
                    'vehicle_id': vehicle_id
                },
                UpdateExpression="set available = :val",
                ExpressionAttributeValues={":val": 'false'}
            )
        except ClientError as e:
            return {
                'statusCode': 500,
                'body': json.dumps('Error updating vehicle status: ' + str(e))
            }

        # Get vehicle details for the email
        vehicle_details = vehicle_record['Item']

        # Get user details for sending an email
        try:
            user_record = user_table.get_item(
                Key={
                    'user_id': user_id
                }
            )
            if 'Item' not in user_record:
                return {
                    'statusCode': 404,
                    'body': json.dumps('User not found for the provided user_id.')
                }
            user_details = user_record['Item']
        except ClientError as e:
            return {
                'statusCode': 500,
                'body': json.dumps('Error retrieving user details: ' + str(e))
            }
            
        print('data', data)
        user_transactions_table.put_item(
            Item={
                'transaction_id': data['transaction_id'],
                'user_id': data['user_id'],
                'vehicle_id': data['vehicle_id'],
                'transaction_date': data['transaction_date'],
                'transaction_type': 'Purchased',
                'status': 'Completed'
            }
        )

        # Send email to the user with vehicle details
        subject = 'Vehicle Purchased Successfully'
        body = 'Dear {},\n\nYou have successfully purchased the {} {} with ID "{}". Enjoy your new ride!\n\nBest regards,\nThe Vehicle Sales Team'.format(
            user_details['name'], vehicle_details['make'], vehicle_details['model'], vehicle_id)
        recipient = user_details['email']
        # send_email(subject, body, recipient)

        print(data['vehicle_id'])  # Move the print statement here

        return {
            'statusCode': 200,
            'body': json.dumps('Vehicle purchased successfully. Email sent to the user.')
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid HTTP method')
        }

