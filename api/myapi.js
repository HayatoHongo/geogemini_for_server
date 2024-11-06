const express = require('express');
const axios = require('axios');
const router = express.Router();

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

router.get('/location', async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.json({ apiKey });
  }

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address,
        key: apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

module.exports = router;
