# Vehicle Management Application

A full-stack vehicle management project with an **Angular frontend** and a serverless backend built with **Python AWS Lambda functions**.

The application includes user authentication, vehicle catalog management, vehicle details, transaction workflows, and frontend components for adding, editing, deleting, and viewing vehicles.

## Key Features

- User registration and authentication
- Vehicle catalog and vehicle-detail workflows
- Add, edit, and delete vehicle interactions
- Transaction management
- Angular service layer for backend communication
- Modular serverless backend functions
- Separate data models and reusable UI components

## Architecture

```text
Angular Frontend
      |
      | API calls
      v
AWS Lambda Functions
      |
      v
Application / Data Services
```

## Backend Functions

The repository includes Python Lambda functions for:

- `UserRegistration.py`
- `UserAuthentication.py`
- `GetVehicleDetails.py`
- `VehicleCatalogManager.py`
- `VehicleTransactionManager.py`
- `UserTransactionManager.py`

## Frontend

The Angular application includes components and services for:

- Home and navigation
- Vehicle catalog
- Add vehicle
- Edit vehicle
- Delete vehicle
- Shopping-cart / transaction workflow
- Authentication
- Loading state management

## Tech Stack

- Angular
- TypeScript
- HTML / SCSS
- Python
- AWS Lambda
- REST-style service integration

## Repository Structure

```text
Vehicle-Management/
└── vehicle-management-app/
    ├── WebTechnology_Final Report _Group 7.pdf
    └── vehicle-management-app/
        ├── Lambda/
        ├── front-end/
        └── DatabaseSchema.md
```

## What This Project Demonstrates

This project demonstrates experience connecting a modern frontend to serverless backend functions and organizing features into reusable Angular components, models, and services.

It also provides practical exposure to cloud-oriented application design and separating authentication, catalog, and transaction responsibilities into individual backend functions.

## Notes

This repository includes the project source together with its course/project report. Generated frontend build artifacts are also present in the original repository history.
