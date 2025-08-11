const express=require('express');
const router=express.Router();
const { signup, login ,getProfile, getAllUsers,updateDescription,resetPassword,changePassword,changeUsername,deleteAccount,rating,getRating,}= require('../controllers/users');

router.get('/getProfile', getProfile);

router.post('/signup',signup);

router.post('/login', login);

router.get('/getAllUsers',getAllUsers);

router.patch('/updateDescription',updateDescription);

router.post('/resetPassword', resetPassword);

router.patch('/changePassword',changePassword);

router.patch('/changeUsername',changeUsername);

router.delete('/deleteAccount',deleteAccount);

router.post('/rating', rating);

// router.post('/endRating', endRating);

router.get('/getRating', getRating)


module.exports= router;