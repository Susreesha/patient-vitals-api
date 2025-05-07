# Patient Vitals API

This is a RESTful API built with Node.js, Express, and MongoDB (via Mongoose) to manage and monitor patient vitals. It includes logic to determine medications based on vitals and provides endpoints to query patients with specific conditions such as high BP or fever.

## Features

- Create, Read, Update, Delete (CRUD) patient vitals
- Auto-determines medication based on:
  - **Systolic BP > 140** and **Diastolic BP < 70** → BP Control Med
  - **Temperature > 100.4°F** → Fever Med
- Fetch patients with:
  - High Blood Pressure
  - Low Blood Pressure
  - Fever
- JWT Authentication
- Swagger API documentation

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Swagger for API Docs
- Postman for testing
- JWT for authentication

## Swagger Documentation

http://localhost:5000/api-docs
