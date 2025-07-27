// --- Backend Server: index.js ---
// This file sets up a Node.js server using the Express framework.
// It connects to Firebase using the Admin SDK to interact with Firestore.

// To Run This Backend:
// 1. Install dependencies: `npm install express cors firebase-admin`
// 2. Firebase Admin SDK Setup:
//    - Go to your Firebase project settings > Service accounts.
//    - Click "Generate new private key" and download the JSON file.
//    - Save this file as `serviceAccountKey.json` in the same directory as this server file.
//    - **IMPORTANT**: Never commit this key to a public repository like GitHub.
// 3. Start the server: `node index.js`

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- Firebase Admin Initialization ---
// Make sure you have the `serviceAccountKey.json` file.
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

// --- Middleware ---
// Use CORS to allow requests from your frontend (which runs on a different origin)
app.use(cors()); 
// Use express.json() to parse JSON request bodies
app.use(express.json());

const PORT = process.env.PORT || 3001;
// This should match the `appId` used in your frontend for the collection path.
const APP_ID = 'default-app-id'; 
const propertiesCollectionRef = db.collection(`artifacts/${APP_ID}/public/data/properties`);


// --- API Routes ---

// GET /api/properties
// Fetches all properties from the Firestore collection.
app.get('/api/properties', async (req, res) => {
    console.log('GET /api/properties request received');
    try {
        const snapshot = await propertiesCollectionRef.get();
        const properties = [];
        snapshot.forEach(doc => {
            properties.push({
                id: doc.id,
                ...doc.data()
            });
        });
        res.status(200).json(properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ error: "Failed to fetch properties from the database." });
    }
});

// POST /api/properties
// Adds a new property to the Firestore collection.
app.post('/api/properties', async (req, res) => {
    console.log('POST /api/properties request received with body:', req.body);
    try {
        const newPropertyData = req.body;

        // Basic validation
        if (!newPropertyData.name || !newPropertyData.price || !newPropertyData.location) {
            return res.status(400).json({ error: "Missing required property fields." });
        }

        // **FIXED LOGIC**: Use the provided image URL if it exists, otherwise create a placeholder.
        const docData = {
            ...newPropertyData,
            image: newPropertyData.image || `https://placehold.co/600x400/cccccc/333?text=${newPropertyData.name.replace(/\s/g, '+')}`
        };

        const docRef = await propertiesCollectionRef.add(docData);
        
        // Return the newly created document with its ID
        res.status(201).json({
            id: docRef.id,
            ...docData
        });

    } catch (error) {
        console.error("Error adding property:", error);
        res.status(500).json({ error: "Failed to add property to the database." });
    }
});

// DELETE /api/properties/:id
// Deletes a property from the Firestore collection.
app.delete('/api/properties/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`DELETE /api/properties/${id} request received`);
    try {
        const docRef = propertiesCollectionRef.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Property not found." });
        }

        await docRef.delete();
        // Send a success response
        res.status(200).json({ message: "Property deleted successfully." });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ error: "Failed to delete property from the database." });
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Ready to accept requests for the Property Listing application.');
});
