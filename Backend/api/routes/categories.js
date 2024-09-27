const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const {createCategory,getCategory} = require("../controllers/categories");

router.post("/createCategory", upload.single("image"), createCategory);

router.get("/getCategory", upload.single("image"), getCategory);