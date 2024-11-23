const express=require('express');
const router=express.Router();
const { signup, login ,getProfile, getAllUsers,updateDescription,rating,getRating}= require('../controllers/users');

router.get('/getProfile', getProfile);

router.post('/signup',signup);

router.post('/login', login);

router.get('/getAllUsers',getAllUsers);

router.patch('/updateDescription',updateDescription);

router.post('/rating', rating);

router.get('/getRating', getRating)

module.exports= router;