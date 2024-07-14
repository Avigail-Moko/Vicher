const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const {createSchedule,getSchedule,updateSchedule} = require("../controllers/schedule");

router.post('/createSchedule', createSchedule);

router.get("/getSchedule", getSchedule);

router.patch("/updateSchedule", updateSchedule);

module.exports = router;