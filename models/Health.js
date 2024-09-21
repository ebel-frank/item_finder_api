const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HealthSchema = new Schema({
    heart_rate: {
        type: Number,
        required: true
    },
    temp: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Health', HealthSchema)