const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { createCanvas } = require('canvas');

//פונקציה המגרילה צבע רנדומלי
function getRandomColor() {
    const minBrightness = 100; // ערך מינימלי של בהירות
    const maxBrightness = 255; // ערך מקסימלי של בהירות
    let r, g, b;

    do {
        r = Math.floor(Math.random() * (maxBrightness - minBrightness) + minBrightness);
        g = Math.floor(Math.random() * (maxBrightness - minBrightness) + minBrightness);
        b = Math.floor(Math.random() * (maxBrightness - minBrightness) + minBrightness);
    } while (r === 255 && g === 255 && b === 255); 
    return `rgb(${r}, ${g}, ${b})`; 
   };

// פונקציה ליצירת תמונת פרופיל
function createBlueProfileImage(name) {
    const canvas = createCanvas(200, 200);
    const context = canvas.getContext('2d');

 // רקע רנדומלי
    context.fillStyle = getRandomColor();
    context.fillRect(0, 0, 200, 200);

 //רקע בנוי משם המשתמש 
    context.fillStyle = 'white';
    context.font = '15px  Georgia, Times New Roman, Times, serif';
    // context.font = '15px  Gabriola';
    context.textAlign = 'left';
    context.textBaseline = 'top';

  const imageSize = 200;
  const textWidth = context.measureText(name).width;
  const textHeight = parseInt(context.font, 10); // מגדיר את גובה הטקסט לפי גודל הפונט

  const textRepeatX = Math.ceil(imageSize / textWidth);
  const textRepeatY = Math.ceil(imageSize / textHeight);
  
  for (let i = 0; i <= textRepeatY; i++) {
      for (let j = 0; j <= textRepeatX; j++) {
        context.fillText(name, j * (textWidth + context.measureText(' ').width), i * textHeight);      }
  }

 //יצירת מופע עבור האות הראשונה משם המשתמש
  const firstLetter = name.charAt(0).toUpperCase();
  context.fillStyle = 'black';
  context.font=('120px  Georgia, Times New Roman, Times, serif');
//   context.font=('120px  Gabriola');

  context.textAlign = 'center';
  context.textBaseline = 'middle'; 
  context.fillText(firstLetter,canvas.width / 2, canvas.height / 2);

    // המרת התמונה למחרוזת בפורמט base64
    const imageBuffer = canvas.toBuffer('image/png');
    const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    return imageBase64;
}


module.exports = {
    signup: (req, res) => {
        const { name, email, password } = req.body;

        User.find({ email }).then((users) => {
            if (users.length >= 1) {
                return res.status(409).json({
                    message: 'Email exists'
                });
            }
             else {

            bcrypt.hash(password, 10, (error, hash) => {
                if (error) {
                    return res.status(500).json({
                        message: 'password not secured'
                    });
                }

            // שימוש בפונקציית יצירת תמונה
            const profileImage =  createBlueProfileImage(name); // יצירת התמונה
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email,
                    password: hash,
                    name,
                    profileImage,

                });
                user.save().then((result) => {
                    console.log(result);
                    // const myUser=set.localStorage(myUser, result);
    
                    res.status(200).json({
                        message: 'User created'
                    });
                }).catch(error => {
                    res.status(500).json({
                        message: 'user not saved'
                    });
                });
            });
            }
        });
    },
    login: (req, res) => {
        const { email, password } = req.body;
        
        User.find({ email }).then((users) => {
            if (users.length === 0) {
                return res.status(401).json({
                    message: 'no such a user'
                });
            }

            const [ user ] = users;
            const userId=user._id;

            bcrypt.compare(password, user.password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'bcrypt error'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        id: user._id,
                        email: user.email,
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1H"
                    });
                    return res.status(200).json({
                        message: 'Auth successful',
                        token,
                        userId,
                        user: {
                            name: user.name,
                            email: user.email,
                            profileImage: user.profileImage,
                            description:user.description,
                            totalRating:user.totalRating,
                            raterCounter:user.raterCounter,
                        }
                    })
                }

                res.status(401).json({
                    message: 'Auth failed'
                });
            })}
        )
    },
    // getProfile: (req, res) => {
    //     const userId = req.userData.id; // Use the data from the middleware

    //     User.findById(userId)
    //         .select('name email profileImage description _id') // Select the fields you want to retrieve
    //         .exec()
    //         .then(user => {
    //             if (!user) {
    //                 return res.status(404).json({ message: 'User not found' });
    //             }
    //             res.status(200).json({ message: 'User retrieved successfully', user:user });
    //         })
    //         .catch(err => {
    //             res.status(500).json({ error: 'Server error' });
    //         });
    // },
    getAllUsers: (req, res) => {
        User.find()
            .select('_id email profileImage name description totalRating raterCounter') // בחר את השדות שתרצה להחזיר
            .exec()
            .then(users => {
                if (!users || users.length === 0) {
                    return res.status(404).json({ message: 'No users found' });
                }

                const formattedUsers = users.map(user => ({
                    email: user.email,
                    profileImage: user.profileImage,
                    name:user.name,
                    _id:user._id,
                    description:user.description,
                    // totalRating:user.totalRating,
                    // raterCounter:user.raterCounter,
                    avgRating:(user.raterCounter > 0) ? (user.totalRating / user.raterCounter) : 0
                }));

                res.status(200).json({ message: 'Users retrieved successfully', users: formattedUsers });
            })
            .catch(err => {
                res.status(500).json({ error: 'Server error' });
            });
    }
    ,
    updateDescription: (req, res) => {
        const userId = req.query.id;
        const { description } = req.body;

        User.findByIdAndUpdate(userId, { description: description }, { new: true })
            .select('description') // החזרת השדות שאתה רוצה
            .exec()
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.status(200).json({ message: 'Description updated successfully', user: user });
            })
            .catch(err => {
                res.status(500).json({ error: 'Server error' });
            });
    },
    rating: (req, res) => {
        const { rating } = req.body;
        const userId = req.query.teacher_id;
        const ratingNumber = Number(rating);

        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                
                // Initialize raterCounter and totalRating if they don't exist
                if (user.raterCounter === undefined ) {
                    user.raterCounter = 0;
                }
                if (user.totalRating === undefined ) {
                    user.totalRating = 0;
                }
    
                user.raterCounter += 1;
                user.totalRating += ratingNumber;
    
                user.save()
                    .then(() => {
                        res.status(200).json({ message: 'User rated successfully' });
                    })
                    .catch(err => {
                        res.status(500).json({ error: 'Server error' });
                    });
            })
            .catch(err => {
                res.status(500).json({ error: 'Server error' });
            });
    },
    getRating: (req, res) => {
        const userId = req.query.userId;
    
        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const avgRating = (user.raterCounter > 0) ? (user.totalRating / user.raterCounter) : 0;
    
                res.status(200).json({ avgRating: avgRating });
            })
            .catch(err => {
                res.status(500).json({ error: 'Server error' });
            });
    }
    
    
}

