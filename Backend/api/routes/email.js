const express = require("express");
const router = express.Router();

const { verifyEmail,contact,verifyDeleteAccount,sendDeleteAccountLink } = require("../controllers/email");

router.get("/verifyEmail", verifyEmail);
router.post("/contact", contact);
router.get("/verifyDeleteAccount", verifyDeleteAccount);
router.post("/sendDeleteAccountLink", sendDeleteAccountLink);

module.exports = router;
