require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express')
const State = require('./models/State')
const ItemFinder = require('./ItemFinder')
const faceDetectorRoute = require('./face_detector')
const faceRecognitionRoute = require('./face_recognition')
const plantMonitorRoute = require('./plant_monitor')
const healthMonitorRoute = require('./health_monitor')

const app = express()
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*", // Adjust according to your needs
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
})

app.use(express.json())
app.use(faceDetectorRoute)
app.use(faceRecognitionRoute)
app.use(plantMonitorRoute)
app.use(healthMonitorRoute)
const PORT = 5000

// Endpoint to POST location
app.put('/api/location', async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        const updatedItem = await ItemFinder.findOneAndUpdate(
            {}, // Find the first (and only) document
            { latitude, longitude },
            { new: true, upsert: true } // Create if it doesn't exist
        );
        res.json({ latitude: updatedItem.latitude, longitude: updatedItem.longitude });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Endpoint to get location
app.get('/api/location', async (req, res) => {
    try {
        const item = await ItemFinder.findOne({});
        const location = { latitude: item.latitude, longitude: item.longitude }
        res.status(200).json(location)
    } catch (err) {
        res.status(400).send({ message: e.message })
    }
})

// Endpoint to toggle LED
app.get('/api/toggle_led', async (req, res) => {
    try {
        const item = await ItemFinder.findOne();
        const updatedItem = await ItemFinder.findOneAndUpdate(
            {},
            { led_state: !item.led_state },
            { new: true }
        );
        res.json({ led_state: updatedItem.led_state });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Endpoint to get the LED
app.get('/api/led', async (req, res) => {
    try {
        const item = await ItemFinder.findOne();
        res.json({ led_state: item.led_state });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Endpoint to toggle BUZZER
app.get('/api/toggle_buzzer', async (req, res) => {
    try {
        const item = await ItemFinder.findOne();
        const updatedItem = await ItemFinder.findOneAndUpdate(
            {},
            { buzzer_state: !item.buzzer_state },
            { new: true }
        );
        res.json({ buzzer_state: updatedItem.buzzer_state });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Endpoint to get the LED
app.get('/api/buzzer', async (req, res) => {
    try {
        const item = await ItemFinder.findOne();
        res.json({ buzzer_state: item.buzzer_state });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Listen for changes to mongodb database
State.watch().on('change', (change) => {
    console.log(change);
    io.emit('stateUpdate', change);
});

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI)
    .then((result) => {
        console.log("Connected to DB")
        // Use server instead of app
        server.listen(PORT, () => {
            console.log('Server started on port ' + PORT);
        })
    })
    .catch((err) => console.log(`Error: ${err}`))