const express = require("express");
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createRoom } = require("../controllers/daily");

// הגדרת Rate Limit: עד 3 בקשות כל 15 דקות מאותו IP
const createRoomLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3,
  message: { error: 'Too many room creation requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/createRoom', createRoomLimiter, createRoom);

module.exports = router;
