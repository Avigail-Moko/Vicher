const mongoose = require('mongoose');
const Category = require('../models/categories');
const fs = require('fs');

module.exports={

    createCategory:(req,res)=>{
        const { category_name } = req.body;
        // if (!req.file) {
        //     return res.status(400).json({ message: 'לא נבחר קובץ' });
        // }
        const category = new Category({
            _id: new mongoose.Types.ObjectId(),
           category_name
        });
        category.save().then((result) => {
            console.log(result);
            res.status(200).json({
                message: 'category created'
            });
        }).catch(error => {
            console.error('Error:', error);
            res.status(500).json({
                message: 'category not saved',
            });
        });
    },
    getCategory: (req,res)=>{
        const _id = req.query._id;
        Category.find({ _id })
            .exec().then(category => { 
               return res.status(200).json({category});
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({
                  message: 'Error retrieving categories',
                });
              });
    },
    
}