const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const PendingUser = require("../models/PendingUser");
const User = require("../models/user");
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// הגדרה של חלון וירטואלי ל-DOMPurify
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

module.exports = {
  sendVerification: async (to, token, name) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vicherapp.info@gmail.com",
        pass: process.env.GMAIL_PASS,
      },
    });

    const link =
      process.env.NODE_ENV === "production"
        ? `https://vicherapp.com/verify-email?token=${token}`
        : `http://localhost:4200/verify-email?token=${token}`;

    await transporter.sendMail({
      from: "Vicher App <vicherapp.info@gmail.com>",
      to,
      subject: "Email Verification Request",
      html: `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>Dear ${name},</p>
    <p>Thank you for registering with <strong>Vicher App</strong>. To complete your registration, please verify your email address by clicking the button below:</p>
    <p><strong>Note:</strong> This verification link is valid for <strong>5 minutes only</strong>.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${link}" 
         style="
          display: inline-block;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          background-color: #c2185b;
          text-decoration: none;
          border-radius: 6px;
          box-shadow: 0 4px 8px rgba(0, 82, 204, 0.3);
          ">
        Verify Email Address
      </a>
    </p>
    <p>If you did not create an account with us, please disregard this message.</p>
    <br/>
    <p>Best regards,<br/>The Vicher App Team</p>
    <hr style="border: none; border-top: 1px solid #ddd; margin-top: 40px;">
    <p style="font-size: 12px; color: #999;">This email was sent to you by Vicher App. If you have any questions, please contact our support team.</p>
  </div>
`,
    });
  },

  verifyEmail: async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token missing" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      const existingUser = await User.findOne({ email: decoded.email });
      if (existingUser) {
        return res
          .status(200)
          .json({ message: "Email already verified. You can log in." });
      }

      const pending = await PendingUser.findOne({ email: decoded.email });
      if (!pending)
        return res.status(404).json({ message: "Pending user not found" });

      // const userExists = await User.findOne({ email: pending.email });
      // if (userExists) return res.status(400).json({ message: 'User already exists' });

      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: pending.email,
        name: pending.name,
        password: pending.password,
        profileImage: pending.profileImage,
      });

      await newUser.save();
      await PendingUser.deleteOne({ email: pending.email });

      res
        .status(200)
        .json({ message: "Email verified. User created successfully." });
    } catch (err) {
      res.status(400).json({ message: "Invalid or expired token" });
    }
  },
  contact: async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "vicherapp.info@gmail.com",
          pass: process.env.GMAIL_PASS,
        },
      });
      
      const cleanName = DOMPurify.sanitize(name);
      const cleanEmail = DOMPurify.sanitize(email);
      const cleanSubject = DOMPurify.sanitize(subject);
      const cleanMessage = DOMPurify.sanitize(message).replace(/\n/g, "<br/>");

      await transporter.sendMail({
        from: `${cleanName} <${cleanEmail}>`,
        to: "vicherapp.info@gmail.com",
        subject: `New Message from Contact Form`,
        html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>subject:</strong> ${cleanSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage}</p>
      </div>
      `,
      });
      res.status(200).json({ message: "Message sent successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send message" });
    }
  },
};
