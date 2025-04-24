
const express = require("express");
const session = require('express-session');
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });



mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER_URL}/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected!");
});

const usersRoutes = require("./api/routes/users");
const productsRoutes = require("./api/routes/products");
const lessonsRoutes = require("./api/routes/lessons");
const scheduleRoutes = require("./api/routes/schedule");
const notificationRoutes = require("./api/routes/notification");
const busyEventsRoutes = require("./api/routes/busyEvents");
const dailyRoutes = require("./api/routes/daily");

const checkAuth = require("./api/middlewares/checkAuth");


//


// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requsted-with,Content-Type,Accept,Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
//     return res.status(200).json({});
//   }
//   next();
// });

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: allowedOrigins, 
  credentials: true
}));

app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(session({
  secret: `${process.env.SESSION_KEY}`, // החליפי במפתח סודי חזק
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000 // לדוגמה: 2 שעות
  }
}));

//Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/lessons", lessonsRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/notification", notificationRoutes);
app.use("/busyEvents", busyEventsRoutes);
app.use("/daily", dailyRoutes);

// ניצור מידלוור נוסף

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error); //נעבור למידלוור הבא
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
