const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
  led_state: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('State', StateSchema);