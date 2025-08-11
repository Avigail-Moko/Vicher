const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const PendingUser = require("../models/pendingUser");
const User = require("../models/user");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// הגדרה של חלון וירטואלי ל-DOMPurify
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

module.exports = {
  sendVerification: async (to, token, name) => {
    const link =
      process.env.NODE_ENV === "production"
        ? `https://vicherapp.com/verify-email?token=${token}`
        : `http://localhost:4200/verify-email?token=${token}`;

    const html = `
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
    <p style="font-size: 12px; color: #999;">This email was sent to you by Vicher App. If you have any questions, please contact our 
      <a href="https://vicherapp.com/support" style="color: #999; text-decoration: underline;">support team</a>.
    </p>
  </div>
`;
    try {
      const { data, error } = await resend.emails.send({
        from: "Vicher App <noreply@vicherapp.com>",
        to,
        subject: "Email Verification Request",
        html,
      });

      if (error) throw error;

      console.log("Verification email sent to:", to);
    } catch (err) {
      console.error("Failed to send verification email:", err.stack);
    }
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
  verifyDeleteAccount: async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Missing token" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      res.status(200).json({ message: "Token valid", userId: decoded.userId });
    } catch (err) {
      res.status(400).json({ message: "Invalid or expired token" });
    }
  },
  sendDeleteAccountLink: async (req, res) => {
    const { email, userId, name } = req.body;

    if (!email || !userId || !name)
      return res.status(400).json({ message: "Missing data" });

    try {
      const token = jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: "10m",
      });

      const link =
        process.env.NODE_ENV === "production"
          ? `https://vicherapp.com/deleting-account?token=${token}`
          : `http://localhost:4200/deleting-account?token=${token}`;

      const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Hello ${name},</p>
        <p>We received a request to delete your Vicher account.</p>
        <p>If you want to proceed, please click the button below. This link is valid for <strong>10 minutes</strong>.</p>
        <p style="text-align: center;">
          <a href="${link}" 
          style="
          display: inline-block;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          background-color: #d32f2f;
          text-decoration: none;
          border-radius: 6px;">
            Confirm Account Deletion
          </a>
        </p>
        <p>If you didn't request this, you can ignore this email.</p>
        <p>– The Vicher App Team</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin-top: 40px;">
        <p style="font-size: 12px; color: #999;">This email was sent to you by Vicher App. If you have any questions, please contact our 
          <a href="https://vicherapp.com/support" style="color: #999; text-decoration: underline;">support team</a>.
        </p>
      </div>
    `;

      const { error } = await resend.emails.send({
        from: "Vicher App <noreply@vicherapp.com>",
        to: email,
        subject: "Confirm Your Account Deletion",
        html,
      });

      if (error) throw error;

      res.status(200).json({ message: "Deletion link sent to email" });
    } catch (err) {
      console.error("Error sending deletion email:", err);
      res.status(500).json({ message: "Failed to send email" });
    }
  },
  contact: async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const cleanName = DOMPurify.sanitize(name);
    const cleanEmail = DOMPurify.sanitize(email);
    const cleanSubject = DOMPurify.sanitize(subject);
    const cleanMessage = DOMPurify.sanitize(message).replace(/\n/g, "<br/>");

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Subject:</strong> ${cleanSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage}</p>
      </div>
      `;
    try {
      const { error } = await resend.emails.send({
        from: `Support Form <support@vicherapp.com>`,
        reply_to: cleanEmail,
        to: "vicher062023@gmail.com",
        subject: `New Message from support Form`,
        html,
      });

      if (error) throw error;

      res.status(200).json({ message: "Message sent successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send message" });
    }
  },
  sendResetPasswordLink: async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
if (!user) {
  return res.status(200).json({ message: "If this email exists, a reset link has been sent" });
}
  if (user.resetPasswordToken && user.resetPasswordExpires > Date.now()) {
    return res.status(429).json({ message: "Please check your email. Password reset email has been sent successfully." });
  }

  const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '10m' });
  
   user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 דקות
  await user.save();

  const link = `${process.env.NODE_ENV === 'production'
    ? 'https://vicherapp.com'
    : 'http://localhost:4200'
  }/reset-password?token=${token}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>Hello ${user.name},</p>
    <p>We received a request to reset your password for your Vicher account.</p>
    <p>If you want to proceed, please click the button below. This link is valid for <strong>10 minutes</strong>.</p>
    <p style="text-align: center;">
          <a href="${link}" 
          style="
          display: inline-block;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          background-color: #d32f2f;
          text-decoration: none;
          border-radius: 6px;">
            Reset Password
          </a>
    </p>
    <p>If you didn't request this, you can ignore this email.</p>
    <p>– The Vicher App Team</p>
    <hr style="border: none; border-top: 1px solid #ddd; margin-top: 40px;">
    <p style="font-size: 12px; color: #999;">This email was sent to you by Vicher App. If you have any questions, please contact our 
      <a href="https://vicherapp.com/support" style="color: #999; text-decoration: underline;">support team</a>.
    </p>
  </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "Vicher App <noreply@vicherapp.com>",
      to: email,
      subject: "Password Reset",
      html
    });
    if (error) throw error;

    res.status(200).json({ message: "If this email exists, a reset link has been sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset email" });
  }
}

};
