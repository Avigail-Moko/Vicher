const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const {getNote,createNote,markNotificationsAsRead,markNotificationsAsDelete} = require("../controllers/notification");

router.get("/getNote", getNote);

router.post("/createNote", createNote);

router.patch("/markNotificationsAsRead", markNotificationsAsRead);

router.patch("/markNotificationsAsDelete", markNotificationsAsDelete);


module.exports = router;