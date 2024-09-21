const express = require('express')
const router = express.Router()
const Health = require('./models/Health')
const { Blockchain, Block } = require("./models/blockchain");

// GET route to retrieve led_state
// router.get('/api/rain_state', async (req, res) => {
//   try {
//     const state = await State.findOne(); // Assuming there's only one document
//     if (!state) {
//       return res.status(404).send({ message: 'LED state not found' });
//     }
//     res.send({ rain_state: state.rain_state });
//   } catch (err) {
//     res.status(500).send({ message: 'Server error' });
//   }
// });

// router.put('/api/rain_state', async (req, res) => {
//   const { rain_state } = req.body;
//   if (typeof rain_state !== 'boolean') {
//     return res.status(400).send({ message: 'Invalid value for rain_state' });
//   }

//   try {
//     let state = await State.findOne();
//     state.rain_state = rain_state;
//     await state.save();
//     res.send({ rain_state: state.rain_state });
//   } catch (err) {
//     res.status(500).send({ message: 'Server error' });
//   }
// });

// router.get('/api/pump_state', async (req, res) => {
//   try {
//     const state = await State.findOne(); // Assuming there's only one document
//     if (!state) {
//       return res.status(404).send({ message: 'Soil data not found' });
//     }
//     res.send({ pump_state: state.pump_state });
//   } catch (err) {
//     res.status(500).send({ message: 'Server error' });
//   }
// });

let blockchain = new Blockchain();

router.post('/api/health_data', async (req, res) => {
  const { heart_rate, temp, oxygen } = req.body;
  if (!heart_rate || !temp || !oxygen) {
    return res.status(400).send({ message: `Missing required values ${heart_rate} ${temp} ${oxygen}` });
  }
  try {
    const certificateId = generateCertificateId();
    const newBlock = new Block(blockchain.chain.length, new Date().toString(), {
      certificateId,
      heart_rate,
      temp,
      oxygen
    });
    blockchain.addBlock(newBlock);
    let health = new Health(newBlock.toMap());
    await health.save();
    res.send({ heart_rate: health.heart_rate, temp: health.temp});
  } catch (err) {
    res.status(500).send({ message: `Server error  ${err}` });
  }
});

function generateCertificateId() {
  return Math.random().toString(36).substring(2, 10);
}


module.exports = router