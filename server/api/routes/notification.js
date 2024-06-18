const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const {getNote,createNote} = require("../controllers/notification");

router.get("/getNote", getNote);

router.post("/createNote", createNote);


module.exports = router;