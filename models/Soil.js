const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SoilSchema = new Schema({
    moisture: {
        type: Number,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Soil', SoilSchema)