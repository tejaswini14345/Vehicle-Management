import json
import boto3
import uuid


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('VehicleCatalog')

    http_method = event['requestContext']['http']['method']
    body = json.loads(event['body']) if 'body' in event else None

    if http_method == 'GET':
        # Modify the scan operation to include any additional filtering if needed
        response = table.scan()
        vehicles = response.get('Items', [])

        return {
            'statusCode': 200,
            'body': json.dumps(vehicles)
        }

    elif http_method == 'POST':
        # Generate a unique vehicle_id using UUID
        generated_vehicle_id = str(uuid.uuid4())
        
        if body is not None:
            response = table.put_item(
                Item={
                    "vehicle_id": generated_vehicle_id,
                    "color": body.get('color'),
                    "make": body.get('make'),
                    "model": body.get('model'),
                    "price": body.get('price'),
                    "year": body.get('year')
                }
            )
            return {
                'statusCode': 201,
                'body': json.dumps('Vehicle added successfully')
            }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps('Invalid request body')
            }

    elif http_method == 'PUT':
        # The rest of your PUT method remains unchanged
        if body is not None and 'vehicle_id' in body:
            response = table.update_item(
                Key={
                    'vehicle_id': body['vehicle_id']
                },
                UpdateExpression="set #c = :c, #m = :m, #mo = :mo, #p = :p, #y = :y",
                ExpressionAttributeValues={
                    ':c': body.get('color'),
                    ':m': body.get('make'),
                    ':mo': body.get('model'),
                    ':p': body.get('price'),
                    ':y': body.get('year')
                },
                ExpressionAttributeNames={
                    '#c': 'color',
                    '#m': 'make',
                    '#mo': 'model',
                    '#p': 'price',
                    '#y': 'year'
                },
                ReturnValues="ALL_NEW"
            )
            return {
                'statusCode': 200,
                'body': json.dumps('Vehicle updated successfully')
            }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps('Invalid request body or missing vehicle_id')
            }

    elif http_method == 'DELETE':
        # The rest of your DELETE method remains unchanged
        if body is not None and 'vehicle_id' in body:
            vehicle_id = body['vehicle_id']
            print(vehicle_id)
            response = table.delete_item(
                Key={
                    'vehicle_id': vehicle_id
                }
            )
            return {
                'statusCode': 204,
                'body': json.dumps('Vehicle deleted successfully')
            }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps('Invalid request body or missing vehicle_id')
            }

    else:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid HTTP method')
        }
