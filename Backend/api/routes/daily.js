const express = require("express");
const router = express.Router();
const {createRoom} = require("../controllers/daily");

router.post('/createRoom', createRoom);




module.exports = router;