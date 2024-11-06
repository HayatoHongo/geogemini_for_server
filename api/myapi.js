const express = require('express');
const router = express.Router();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

router.get('/getGoogleMapsApiKey', (req, res) => {
  if (!apiKey) {
    return res.status(500).json({ error: 'Google Maps API key is not set in the environment variables' });
  }
  res.json({ apiKey });
});

module.exports = router;

// 住所から座標を取得するエンドポイント
router.get('/location', async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
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
