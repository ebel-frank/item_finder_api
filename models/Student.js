const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({
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

module.exports = mongoose.model('Student', studentSchema)