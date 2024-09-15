var admin = require("firebase-admin");
var serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mobile-biometric-voting-system-default-rtdb.firebaseio.com"
});

const embeddings = {}
const threshold = 0.5

const db = admin.firestore()
async function loadFirestoreData() {
    db.collection('face_embeddings').onSnapshot(async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
            const userId = change.doc.id

            if (change.type === 'added' || change.type === 'modified') {
                embeddings[userId] = change.doc.data()
            } else if (change.type === 'removed') {
                embeddings.delete(userId)
            }
        })
    })
}

loadFirestoreData()

router.get('/api/verify_face', async (req, res) => {
    console.log("verifying face");
    
    try {
        const { predictedData, uid } = req.params
        const minDist = 999;
        const currDist = 0.0;
        const userId = "";

        for (const uId of embeddings.keys()) {
            currDist = _euclideanDistance(embeddings[uId], predictedData);
            console.log(currDist);
            if (currDist <= threshold && currDist < minDist) {
                minDist = currDist;
                userId = uId;
            }
        }
        res.status(200).json({'prediction': uid == userId}) // check if the userId of the predicted embeddings is same as actual user id
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router