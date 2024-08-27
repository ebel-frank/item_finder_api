const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemFinderScehema = new Schema({
    longitude: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    led_state: {
        type: Boolean,
        required: true,
    },
    buzzer_state: {
        type: Boolean,
        required: true,
    },
})


module.exports = mongoose.model('ItemFinder', itemFinderScehema)

