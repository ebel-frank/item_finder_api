const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SoilSchema = new Schema({
    moisture: {
        type: Number,
        required: true
    },
    battery: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Soil', SoilSchema)