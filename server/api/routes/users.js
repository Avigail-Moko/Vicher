const express=require('express');
const router=express.Router();
const checkAuth = require('../middlewares/checkAuth');
const { signup, login ,getProfile, getAllUsers,updateDescription}= require('../controllers/users');

router.get('/profile', checkAuth, getProfile);

router.post('/signup',signup);

router.post('/login', login);

router.get('/getAllUsers',getAllUsers);

router.patch('/updateDescription',updateDescription);

// router.put('/profile', checkAuth, profileController.updateProfile);
module.exports= router;