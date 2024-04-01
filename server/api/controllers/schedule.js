const mongoose = require('mongoose');
const Schedule = require('../models/schedule');

module.exports={
    createSchedule:(req,res)=>{
        const { teacher_id ,startTime,endTime,dayOfEvent} = req.body;
        const schedule = new Schedule({
            _id: new mongoose.Types.ObjectId(), 
            teacher_id, 
            startTime,
            endTime,
            dayOfEvent    
        });
        schedule.save().then((result) => {
            console.log(result);
            res.status(200).json({
                message: 'schedule created'
            });
        }).catch(error => {
            console.error('Error:', error);
            res.status(500).json({
                message: 'schedule not saved',
            });
        });
    },

getSchedule: (req,res)=>{
    const teacher_id = req.query.userId;
    Schedule.find({ teacher_id })
        .exec().then(schedule => { 
           return res.status(200).json({schedule});
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({
              message: 'Error retrieving schedule',
            });
          });
},
// deleteSchedule: (req, res) => {
//     const _id = req.query._id; 

//     Schedule.deleteOne({_id: _id }).then(()=>{
//         res.status(200).json({
//             message: 'schedule deleted'
//         })
//     }).catch(error=>{
//         res.status(500).json({
//             error
//         })
//     })
// },
updateSchedule: (req, res) => {
    const _id = req.query._id; 
    const updateFields = req.body; // אובייקט שיכיל את כל השדות שברצונך לעדכן
       // אם יש קובץ חדש, עדכן את נתיב התמונה
    //    if (req.file) {
    //     updateFields.image = req.file.path;
    // }

    Schedule.updateOne({ _id: _id }, { $set: updateFields })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Schedule updated successfully',
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