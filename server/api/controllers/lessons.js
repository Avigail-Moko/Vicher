const mongoose = require('mongoose');
const Lesson = require('../models/lessons');

module.exports={
    createLesson:(req,res)=>{
        const {  myDate,teacher_id, student_id, product_id, length } = req.body;
        const lesson = new Lesson({
            _id: new mongoose.Types.ObjectId(),
            length,
            myDate, 
            teacher_id, 
            student_id,
            product_id
        });
        lesson.save().then((result) => {
            console.log(result);
            res.status(200).json({
                message: 'lesson created'
            });
        }).catch(error => {
            console.error('Error:', error);
            res.status(500).json({
                message: 'lesson not saved',
            });
        });
    },

getLesson: (req,res)=>{
    const teacher_id = req.query.userId;
    const product_id = req.query.productId;
    
    let query = {};

    if (teacher_id) {
        query.teacher_id = teacher_id;
    } else if (product_id) {
        query.product_id = product_id;
    } else {
        return res.status(400).json({
            message: 'Either teacherId or productId must be provided'
        });
    }

    Lesson.find(query)
        .exec().then(lesson => { 
           return res.status(200).json({lesson});
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({
              message: 'Error retrieving lessons',
            });
          });
},
deleteLesson: (req, res) => {
    const _id = req.query._id; 

    Lesson.deleteOne({_id: _id }).then(()=>{
        res.status(200).json({
            message: 'lesson deleted'
        })
    }).catch(error=>{
        res.status(500).json({
            error
        })
    })
},
updateLesson: (req, res) => {
    const _id = req.query._id; 
    const updateFields = req.body; // אובייקט שיכיל את כל השדות שברצונך לעדכן
       // אם יש קובץ חדש, עדכן את נתיב התמונה
    //    if (req.file) {
    //     updateFields.image = req.file.path;
    // }

    Lesson.updateOne({ _id: _id }, { $set: updateFields })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Lesson updated successfully',
                result: result
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({
                error: error
            });
        });
},
}