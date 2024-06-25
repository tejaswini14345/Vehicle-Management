import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    
    # Assuming 'VehicleCatalog' is the name of your table
    vehicle_catalog_table = dynamodb.Table('VehicleCatalog')

    # Extract vehicle_id from the incoming event body
    try:
        request_body = json.loads(event['body'])
        vehicle_id = request_body['vehicle_id']
    except KeyError:
        return {
            'statusCode': 400,
            'body': json.dumps('Vehicle_id is missing in the request body.'),
        }
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid JSON format in the request body.'),
        }

    try:
        # Retrieve vehicle details based on vehicle_id
        response = vehicle_catalog_table.get_item(
            Key={
                'vehicle_id': vehicle_id
            }
        )

        # Check if the item exists
        if 'Item' in response:
            vehicle_details = response['Item']
            print(vehicle_details)
            return {
                'statusCode': 200,
                'body': json.dumps(vehicle_details),
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps('Vehicle details not found for the provided vehicle_id.'),
            }

    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error retrieving vehicle details: {str(e)}')
        }
