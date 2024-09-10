var admin = require("firebase-admin");
var serviceAccount = require("./serviceaccountkey.json");
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
async function loadFirestoreData() {

}


loadFirestoreData()


router.get('/api/verify_face', async  (req, res) => {
    db.colllections('')
})

module.exports = router