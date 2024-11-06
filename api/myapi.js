const express = require('express');
const axios = require('axios');
const router = express.Router();

// 環境変数からAPIキーを取得
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// Google Maps APIを使って位置情報を検索するエンドポイント
router.get('/location', async (req, res) => {
  const { address } = req.query;
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
