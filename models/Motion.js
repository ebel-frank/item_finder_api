const mongoose = require('mongoose');

const MotionSchema = new mongoose.Schema({
  alert: {
    type: String,
    required: true,
    default: "Motion detected"
  },
}, { timestamps: true });

module.exports = mongoose.model('Motion', MotionSchema);