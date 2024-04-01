const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.5rd1vlt.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected!");
});

const articalesRoutes = require("./api/routes/articales");
const categoryRoutes = require("./api/routes/categories");
const usersRoutes = require("./api/routes/users");
const productsRoutes = require("./api/routes/products");
const lessonsRoutes = require("./api/routes/lessons");
const scheduleRoutes = require("./api/routes/schedule");
const checkAuth = require("./api/middlewares/checkAuth");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requsted-with,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use(cors());

app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);


//Routes
app.use("/articales", articalesRoutes);
app.use("/categories", checkAuth, categoryRoutes);
app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/lessons", lessonsRoutes);
app.use("/schedule", scheduleRoutes);

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
