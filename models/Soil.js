const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SoilSchema = new Schema({
    name: {
        type: Number,
        required: true
    },
    matric_no: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Soil', SoilSchema)