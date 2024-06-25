import json
from decimal import Decimal
import boto3

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            if o % 1 == 0:
                return int(o)
            else:
                return float(o)
        return super(DecimalEncoder, self).default(o)

def get_vehicle_details(vehicle_id):
    dynamodb = boto3.resource('dynamodb')
    vehicle_catalog_table = dynamodb.Table('VehicleCatalog')

    try:
        response = vehicle_catalog_table.get_item(
            Key={
                'vehicle_id': vehicle_id
            }
        )
        return response.get('Item')
    except Exception as e:
        return None

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    user_transactions_table = dynamodb.Table('UserTransactions')

    # Extract user_id from the request body
    try:
        user_id = json.loads(event['body']).get('user_id')
    except KeyError:
        return {
            'statusCode': 400,
            'body': json.dumps('Missing user_id in the request body')
        }
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid JSON format in the request body')
        }

    try:
        response = user_transactions_table.query(
            IndexName='user_id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )

        transactions = response.get('Items', [])

        # Resolve vehicle details for each transaction
        for transaction in transactions:
            vehicle_id = transaction.get('vehicle_id')
            if vehicle_id:
                vehicle_details = get_vehicle_details(vehicle_id)
                if vehicle_details:
                    transaction.update(vehicle_details)

        return {
            'statusCode': 200,
            'body': json.dumps(transactions, cls=DecimalEncoder)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
