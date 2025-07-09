const express = require("express");
const router = express.Router();

const { verifyEmail } = require("../controllers/email");
router.get("/verifyEmail", verifyEmail);

module.exports = router;
