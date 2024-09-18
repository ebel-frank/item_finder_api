const express = require('express')
const router = express.Router()
const Soil = require('./models/Soil')
const State = require('./models/State')

// GET route to retrieve led_state
router.get('/api/led_state', async (req, res) => {
    try {
      const state = await State.findOne(); // Assuming there's only one document
      if (!state) {
        return res.status(404).send({ message: 'LED state not found' });
      }
      res.send({ led_state: state.led_state });
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
  });

module.exports = router