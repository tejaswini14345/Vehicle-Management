User Table:

Partition Key: user_id (String)
Sort Key: (None)

{
  "user_id": "unique_user_id",
  "name": "user_name",
  "email": "user_email",
  "registration_date": "registration_date",
  "status": "user_status"
}
UserTransaction Table:

Partition Key: transaction_id (String)
Sort Key: user_id (String)

{
  "transaction_id": "unique_transaction_id",
  "user_id": "user_id",
  "vehicle_id": "vehicle_id",
  "transaction_date": "transaction_date",
  "transaction_type": "transaction_type",
  "status": "transaction_status"
}
VehicleCatalog Table:

Partition Key: vehicle_id (String)
Sort Key: (None)

{
  "vehicle_id": "unique_vehicle_id",
  "make": "vehicle_make",
  "model": "vehicle_model",
  "color": "vehicle_color",
  "year": "vehicle_year",
  "price": "vehicle_price",
  "available": true, // Boolean indicating availability
}