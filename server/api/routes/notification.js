const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const {getNote,createNote,markNotificationsAsRead,deleteNote} = require("../controllers/notification");

router.get("/getNote", getNote);

router.post("/createNote", createNote);

router.patch("/markNotificationsAsRead", markNotificationsAsRead);

router.patch("/deleteNote", deleteNote);


module.exports = router;