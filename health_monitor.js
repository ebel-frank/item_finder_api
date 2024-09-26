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
  // if (!heart_rate || !temp || !oxygen) {
  //   return res.status(400).send({ message: `Missing required values ${heart_rate} ${temp} ${oxygen}` });
  // }
  try {
    const certificateId = generateCertificateId();
    const newBlock = new Block(10, new Date().toString(), {
      certificateId,
      heart_rate,
      temp,
      oxygen
    });
    blockchain.addBlock(newBlock);
    let health = new Health({heart_rate, temp});
    await health.save();
    res.status(200).json({ message: "Success"});
  } catch (err) {
    res.status(500).send({ message: `Server error  ${err}` });
  }
});

router.get('/api/health_data', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    // Fetch the items from the Motion collections
    const health = await Health.find()
      .sort({ _id: -1 })
      .limit(limit);

    res.send(health);
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});

function generateCertificateId() {
  return Math.random().toString(36).substring(2, 10);
}


module.exports = router