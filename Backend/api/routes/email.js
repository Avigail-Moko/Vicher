const express = require("express");
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { verifyEmail,contact,verifyDeleteAccount,sendDeleteAccountLink,sendResetPasswordLink } = require("../controllers/email");


const contactLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 דקות 
  max: 3,
  message: "Too many contact requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const deleteAccountLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 דקות 
  max: 3,
  message: "Too many delete account requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const resetPasswordLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 דקות 
  max: 3,
  message: "Too many password reset requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/verifyEmail", verifyEmail);
router.post("/contact", contactLimiter, contact);
router.get("/verifyDeleteAccount", verifyDeleteAccount);
router.post("/sendDeleteAccountLink",deleteAccountLimiter, sendDeleteAccountLink);
router.post("/sendResetPasswordLink",resetPasswordLimiter, sendResetPasswordLink);

module.exports = router;
