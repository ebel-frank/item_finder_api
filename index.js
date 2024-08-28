require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express')
const ItemFinder = require('./ItemFinder')

const app = express()

app.use(express.json())
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

// Add new ItemFinder API
// app.post('/itemfinder', async (req, res) => {
//     const latitude = 9.53281832529;
//     const longitude = 6.44219675432;
//     const led_state = false;
//     const buzzer_state = false;

//     try {
//         const newItem = new ItemFinder({ longitude, latitude, led_state, buzzer_state });
//         await newItem.save();
//         res.status(201).json(newItem);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI)
    .then((result) => {
        console.log("Connected to DB")
        // Use server instead of app
        app.listen(PORT, () => {
            console.log('Server started on port ' + PORT);
        })
    })
    .catch((err) => console.log(`Error: ${err}`))