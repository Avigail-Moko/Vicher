const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { createCanvas } = require("@napi-rs/canvas");
const PendingUser = require("../models/PendingUser");
const { sendVerification } = require("./email");

//פונקציה המגרילה צבע רנדומלי
function getRandomColor() {
  const minBrightness = 100;
  const maxBrightness = 255;
  let r, g, b;

  do {
    r = Math.floor(
      Math.random() * (maxBrightness - minBrightness) + minBrightness
    );
    g = Math.floor(
      Math.random() * (maxBrightness - minBrightness) + minBrightness
    );
    b = Math.floor(
      Math.random() * (maxBrightness - minBrightness) + minBrightness
    );
  } while (r === 255 && g === 255 && b === 255);
  return `rgb(${r}, ${g}, ${b})`;
}

// פונקציה ליצירת תמונת פרופיל
function createBlueProfileImage(name) {
  const canvas = createCanvas(200, 200);
  const context = canvas.getContext("2d");

  // רקע רנדומלי
  context.fillStyle = getRandomColor();
  context.fillRect(0, 0, 200, 200);

  //רקע בנוי משם המשתמש
  context.fillStyle = "white";
  context.font = "15px  Tinos,Georgia";
  context.textAlign = "left";
  context.textBaseline = "top";

  const imageSize = 200;
  const textWidth = context.measureText(name).width;
  const textHeight = parseInt(context.font, 10); // מגדיר את גובה הטקסט לפי גודל הפונט

  const textRepeatX = Math.ceil(imageSize / textWidth);
  const textRepeatY = Math.ceil(imageSize / textHeight);

  for (let i = 0; i <= textRepeatY; i++) {
    for (let j = 0; j <= textRepeatX; j++) {
      context.fillText(
        name,
        j * (textWidth + context.measureText(" ").width),
        i * textHeight
      );
    }
  }

  //יצירת מופע עבור האות הראשונה משם המשתמש
  const firstLetter = name.charAt(0).toUpperCase();
  context.fillStyle = "black";
  context.font = "120px  Tinos,Georgia";
  //   context.font=('120px  Gabriola');

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(firstLetter, canvas.width / 2, canvas.height / 2);

  // המרת התמונה למחרוזת בפורמט base64
  const imageBuffer = canvas.toBuffer("image/png");
  const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
  return imageBase64;
}

module.exports = {
  signup: (req, res) => {
    const { name, email, password } = req.body;

    User.find({ email }).then(async (users) => {
      if (users.length >= 1) {
        return res.status(409).json({
          message: "Email exists",
        });
      }

      const existingPending = await PendingUser.findOne({ email });
      if (existingPending) {
        return res.status(409).json({
          message: "Email already awaiting verification",
        });
      }

      bcryptjs.hash(password, 10, async (error, hash) => {
        if (error) {
          return res.status(500).json({
            message: "password not secured",
          });
        }

        const profileImage = createBlueProfileImage(name);

        const pendingUser = new PendingUser({
          email,
          password: hash,
          name,
          profileImage,
        });

        try {
          await pendingUser.save();
          const token = jwt.sign({ email }, process.env.JWT_KEY, {
            expiresIn: 330,
          });
          await sendVerification(email, token, name);

          res.status(200).json({
            message: "Verification email sent",
          });
        } catch (err) {
          res.status(500).json({
            message: "Failed to create pending user",
          });
        }
      });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;

    User.find({ email }).then((users) => {
      if (users.length === 0) {
        return res.status(401).json({
          message: "no such a user",
        });
      }

      const [user] = users;
      const userId = user._id;

      bcryptjs.compare(password, user.password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: "bcryptjs error",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              id: user._id,
              email: user.email,
            },
            process.env.JWT_KEY
            // {
            //     expiresIn: "1H"
            // }
          );
          return res.status(200).json({
            message: "Auth successful",
            token,
            userId,
            user: {
              name: user.name,
              email: user.email,
              profileImage: user.profileImage,
              description: user.description,
              totalRating: user.totalRating,
              raterCounter: user.raterCounter,
            },
          });
        }

        res.status(401).json({
          message: "Auth failed",
        });
      });
    });
  },
  getProfile: (req, res) => {
    const userId = req.query._id;

    User.findById(userId)
      .select(
        "_id email profileImage name description totalRating raterCounter"
      )
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const formattedUser = {
          email: user.email,
          profileImage: user.profileImage,
          name: user.name,
          _id: user._id,
          description: user.description,
          raterCounter: user.raterCounter,
          avgRating:
            user.raterCounter > 0 ? user.totalRating / user.raterCounter : 0,
        };
        res.status(200).json({
          message: "User retrieved successfully",
          user: formattedUser,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: "Server error" });
      });
  },
  getAllUsers: (req, res) => {
    User.find()
      .select("_id profileImage name description totalRating raterCounter")
      .exec()
      .then((users) => {
        if (!users || users.length === 0) {
          return res.status(404).json({ message: "No users found" });
        }

        const formattedUsers = users.map((user) => ({
          profileImage: user.profileImage,
          name: user.name,
          _id: user._id,
          description: user.description,
          raterCounter: user.raterCounter,
          avgRating:
            user.raterCounter > 0 ? user.totalRating / user.raterCounter : 0,
        }));
        const usersName = users.map((user) => ({
          name: user.name,
        }));

        res.status(200).json({
          message: "Users retrieved successfully",
          users: formattedUsers,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: "Server error" });
      });
  },
  updateDescription: (req, res) => {
    const userId = req.query.id;
    const { description } = req.body;

    User.findByIdAndUpdate(userId, { description: description }, { new: true })
      .select("description")
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res
          .status(200)
          .json({ message: "Description updated successfully", user: user });
      })
      .catch((err) => {
        res.status(500).json({ error: "Server error" });
      });
  },
  rating: (req, res) => {
    const { rating, lessonId } = req.body;
    const userId = req.query.teacher_id;
    const ratingNumber = Number(rating);

    if (!req.session.ratedLessons) {
      req.session.ratedLessons = [];
    }
    // בדיקה אם המשתמש כבר דירג את המורה הנוכחי
    const alreadyRated = req.session.ratedLessons.find(
      (entry) => entry.userId === userId && entry.lessonId === lessonId
    );

    if (alreadyRated) {
      return res.status(400).json({
        message: "You have already rated this teacher for this lesson",
      });
    }

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Initialize raterCounter and totalRating if they don't exist
        if (user.raterCounter === undefined) {
          user.raterCounter = 0;
        }
        if (user.totalRating === undefined) {
          user.totalRating = 0;
        }

        user.raterCounter += 1;
        user.totalRating += ratingNumber;

        user
          .save()
          .then(() => {
            // הוספת המורה ל־session כך שהתלמיד לא יוכל לדרג שוב
            req.session.ratedLessons.push({ userId, lessonId });
            res.status(200).json({ message: "User rated successfully" });
          })
          .catch((err) => {
            res.status(500).json({ error: "Server error" });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: "Server error" });
      });
  },
  getRating: (req, res) => {
    const userId = req.query.userId;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const avgRating =
          user.raterCounter > 0 ? user.totalRating / user.raterCounter : 0;

        res
          .status(200)
          .json({ avgRating: avgRating, raterCounter: user.raterCounter });
      })
      .catch((err) => {
        res.status(500).json({ error: "Server error" });
      });
  },
  // endRating: (req, res) => {
  //     const { userId,lessonId } = req.body;

  //     if (!req.session || !req.session.ratedLessons) {
  //         return res.status(400).json({ message: 'No rating data found in session' });
  //     }

  //     req.session.ratedLessons = req.session.ratedLessons.filter(
  //         (entry) => !(entry.userId === userId && entry.lessonId === lessonId)
  //     );

  //       res.json({ message: 'Session data for lesson rating has been successfully cleared' });
  // }
};
