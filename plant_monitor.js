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

  app.put('/api/rain_state', async (req, res) => {
    const { rain_state } = req.body;
    if (typeof rain_state !== 'boolean') {
      return res.status(400).send({ message: 'Invalid value for rain_state' });
    }
  
    try {
      let state = await State.findOne();
      state.rain_state = rain_state;
      await state.save();
      res.send({ rain_state: state.rain_state });
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
  });

  router.get('/api/pump_state', async (req, res) => {
    try {
      const state = await State.findOne(); // Assuming there's only one document
      if (!state) {
        return res.status(404).send({ message: 'Soil data not found' });
      }
      res.send({ pump_state: state.pump_state });
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
  });

  app.put('/api/pump_state', async (req, res) => {
    const { pump_state } = req.body;
    if (typeof pump_state !== 'boolean') {
      return res.status(400).send({ message: 'Invalid value for pump_state' });
    }
  
    try {
      let state = await State.findOne();
      state.pump_state = pump_state;
      await state.save();
      res.send({ pump_state: state.pump_state });
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
  });

module.exports = router