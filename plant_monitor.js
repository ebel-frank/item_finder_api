const express = require('express')
const router = express.Router()
const Soil = require('./models/Soil')
const State = require('./models/State')
const multer = require('multer');
const Image = require('./models/Images');

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.put('/api/rain_state', async (req, res) => {
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

router.get('/api/soil_state', async (req, res) => {
  try {
    const state = await State.findOne(); // Assuming there's only one document
    if (!state) {
      return res.status(404).send({ message: 'Soil data not found' });
    }
    res.send(state);
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});

router.put('/api/pump_state', async (req, res) => {
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

router.post('/api/soil_value', async (req, res) => {
  const { moisture, battery } = req.body;
  if (!moisture || !battery) {
    return res.status(400).send({ message: 'Missing required values' });
  }

  try {
    let Soil = new Soil({moisture});
    await Soil.save();
    let state = await State.findOne();
    state.battery = battery;
    await state.save();
    res.send({ pump_state: state.pump_state });
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});


// Upload image route
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
      const image = new Image({
          data: req.file.buffer,
          contentType: req.file.mimetype
      });

      await Image.deleteMany(); // Delete existing images
      await image.save();

      res.json({ message: 'Image uploaded successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
  }
});

// Get image route
router.get('/image', async (req, res) => {
  try {
      const image = await Image.findOne();

      if (!image) {
          return res.status(404).json({ error: 'Image not found' });
      }

      res.set('Content-Type', image.contentType);
      res.send(image.data);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router