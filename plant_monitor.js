const express = require('express')
const router = express.Router()
const Soil = require('./models/Soil')
const State = require('./models/State')

// GET route to retrieve led_state
router.get('/api/rain_state', async (req, res) => {
    try {
      const state = await State.findOne(); // Assuming there's only one document
      if (!state) {
        return res.status(404).send({ message: 'LED state not found' });
      }
      res.send({ rain_state: state.rain_state });
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
  });

  router.get('/api/pump_state', async (req, res) => {
    try {
      const state = await State.findOne(); // Assuming there's only one document
      if (!state) {
        return res.status(404).send({ message: 'LED state not found' });
      }
      res.send({ pump_state: state.pump_state });
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
  });

module.exports = router