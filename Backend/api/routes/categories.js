const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const {createCategory,getCategory} = require("../controllers/categories");

router.post("/createCategory", createCategory);

router.get("/getCategory", getCategory);


module.exports = router;