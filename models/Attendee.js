const mongoose = require('mongoose')
const Schema = mongoose.Schema

const attendeeSchema = new Schema({
    timestamp: {
        type: String, 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    matric_no: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('Attendee', attendeeSchema)