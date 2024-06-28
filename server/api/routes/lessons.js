const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const {createLesson,getLesson,deleteLesson,updateLesson} = require("../controllers/lessons");

router.post('/createLesson', createLesson);

router.get("/getLesson", getLesson);

// router.delete("/deleteLesson", deleteLesson);

// router.patch("/updateLesson", updateLesson);

module.exports = router;