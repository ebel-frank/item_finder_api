const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
  rain_state: {
    type: Boolean,
    required: true,
    default: false
  },
  pump_state: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('State', StateSchema);