const mongoose = require('mongoose');
const Product = require('../models/products');
const fs = require('fs');

module.exports={
    createProduct:(req,res)=>{
            const { lesson_title, category, price, length, description, userId,userProfileName,userProfileImage } = req.body;
            if (!req.file) {
                return res.status(400).json({ message: 'לא נבחר קובץ' });
            }
            const product = new Product({
                _id: new mongoose.Types.ObjectId(),
                lesson_title,
                category,
                price,
                length,
                description,
                userId,
                userProfileName,
                userProfileImage,
                image: {
                    filename: req.file.filename,
                    path: req.file.path,
                    src:`http://${req.get('host')}/${req.file.path}`
                }
            });
            product.save().then((result) => {
                console.log(result);
                res.status(200).json({
                    message: 'product created'
                });
            }).catch(error => {
                console.error('Error:', error);
                res.status(500).json({
                    message: 'product not saved',
                });
            });
        },

    getProduct: (req,res)=>{
        const userId = req.query.userId;
        Product.find({ userId })
            .exec().then(product => { 
               return res.status(200).json({product});
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({
                  message: 'Error retrieving products',
                });
              });
    },
    deleteProduct: (req, res) => {
        const _id = req.query._id;

        Product.findOneAndDelete({ _id: _id }).then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const imagePath = `./${product.image.path}`;

    
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({
                        message: 'Error deleting file'
                    });
                }

                res.status(200).json({
                    message: 'product deleted'
                });
            });
        }).catch(error => {
            res.status(500).json({
                error
            });
        });
    },
    updateProduct: (req, res) => {
        const _id = req.query._id; 
        const updateFields = req.body; // אובייקט שיכיל את כל השדות שברצונך לעדכן
           // אם יש קובץ חדש, עדכן את נתיב התמונה
        //    if (req.file) {
        //     updateFields.image = req.file.path;
        // }

        Product.updateOne({ _id: _id }, { $set: updateFields })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Product updated successfully',
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
    getAllProduct: (req,res)=>{
        Product.find().select('lesson_title category price length description userId image userProfileName userProfileImage')
            .exec().then(product => { 
               return res.status(200).json({product});
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({
                  message: 'Error retrieving products',
                });
              });
    },
    
}


