const express = require("express");
const router = express.Router();
const {createBusyEvent,getAllTeacherBusyEvents,deleteBusyEvent} = require("../controllers/busyEvents");

router.post('/createBusyEvent', createBusyEvent);

router.get("/getAllTeacherBusyEvents", getAllTeacherBusyEvents);

router.delete("/deleteBusyEvent", deleteBusyEvent);


module.exports = router;