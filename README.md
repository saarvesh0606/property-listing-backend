# property-listing-backend
Property Listing Backend API
This repository contains the backend server for the "Mini Property Listing Dashboard," a project developed for a React Developer skill assessment.

This server is built with Node.js and Express and uses Google Firestore for data persistence. It provides a clean, RESTful API that allows the frontend application to perform CRUD (Create, Read, Delete) operations on property listings.

Live API Base URL
The live version of this API is hosted on Render:
https://property-listing-backend-z97s.onrender.com

Core Technologies
Runtime: Node.js

Framework: Express.js

Database: Google Firestore (via Firebase Admin SDK)

Middleware: CORS for handling cross-origin requests

API Endpoints
The server exposes the following endpoints:

GET /api/properties

Fetches all property listings from the database.

POST /api/properties

Adds a new property listing to the database. Expects a JSON body with name, type, price, location, and description.

DELETE /api/properties/:id

Deletes a specific property by its unique ID.

Local Setup and Installation
To run this server on your local machine, please follow these steps:

Clone the Repository

git clone <your-repo-url>
cd property-listing-backend

Install Dependencies

npm install

Set Up Firebase Admin Credentials

Go to your Firebase project settings and navigate to the "Service Accounts" tab.

Click "Generate new private key" to download your unique credentials file.

Place this file in the root of the project directory and rename it to serviceAccountKey.json.

Security Note: This file is included in .gitignore and must never be committed to a public repository.

Start the Server

node index.js

The server will start and listen for requests on http://localhost:3001.
