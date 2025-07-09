const express = require("express");
const router = express.Router();

const { verifyEmail,contact } = require("../controllers/email");

router.get("/verifyEmail", verifyEmail);
router.post("/contact", contact);

module.exports = router;
