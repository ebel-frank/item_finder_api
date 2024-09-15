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
const threshold = 0.9

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

function _euclideanDistance(e1, e2) {
    if (!e1 || !e2) {
        throw new Error("Null argument");
    }

    let sum = 0.0;
    for (let i = 0; i < e1.length; i++) {
        sum += Math.pow((e1[i] - e2[i]), 2);
    }

    return Math.sqrt(sum);
}

loadFirestoreData()

router.post('/api/verify_face', async (req, res) => {
    console.log("verifying face");

    try {
        const { predictedData, uid } = req.body

        const _ensemble_list = { '0': ["", 999], '1': ["", 999], '2': ["", 999], '3': ["", 999] }

        for (const uId of Object.keys(embeddings)) {
            var currDist = 0.0;
            for (let i = 0; i < 4; i++) {
                currDist = _euclideanDistance(embeddings[uId][`${i}`], predictedData[`${i}`]);
                
                if (currDist <= threshold && currDist < _ensemble_list[`${i}`][1]) {
                    _ensemble_list[`${i}`][0] = uid
                    _ensemble_list[`${i}`][1] = currDist
                }
            }
        }

        // Get the max occurence of userId
        const occurrences = {}
        for (let i = 0; i < 4; i++) {
            const uId = _ensemble_list[`${i}`][0]
            occurrences[uId] = (occurrences[uId] || 0) + 1;
        }
        const max_userId = Object.keys(occurrences).reduce((a, b) => {
            return occurrences[a] > occurrences[b] ? a : b;
        });
        
        res.status(200).json({ 'prediction': uid == max_userId }) // check if the userId of the predicted embeddings is same as actual user id
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router