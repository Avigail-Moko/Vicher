const mongoose=require('mongoose');
const Articale= require('../models/articales');
const Category=require('../models/category');

module.exports={
    getAllArticales:  (req,res)=>{
        Articale.find().populate('categoryId').then((articales)=>{
            res.status(200).json({
                articales
        })
        }).catch(error=>{
            res.status(500).json({
                error
            })
        })
    },
    createArticale: (req,res)=>{
        const { path: image } = req.file; //gets info on file that uploaded
        const {title, description, content,categoryId} = req.body;

        Category.findById(categoryId).then((category)=>{
            if (!category){
               return res.status(404).json({
                    message:'Category Not Found'
                })
            }

            const articale=new Articale({
                _id:new mongoose.Types.ObjectId(),
                title:title,
                description:description,
                content:content,
                categoryId:categoryId,
                image: image.replace('\\','/')
            });
            
            return articale.save();

        }).then(()=>{
            res.status(200).json({
            message:'Created Articale'
        })
        }).catch(error=>{
            res.status(500).json({
                error
            })
        })

    },
    getArticale: (req,res)=>{
        const articaleId=req.params.articaleId;
        Articale.findById(articaleId).then((articale)=>{
            res.status(200).json({
                articale
            })
        }).catch(error=>{
            res.status(500).json({
                error
            })
        })

    },
    updateArticale:(req,res)=>{
        const articaleId=req.params.articaleId
        const {categoryId}=req.body;

        Articale.findById(articaleId).then((articale)=>{
            if(!articale){
                return res.status(404).json({
                    message:'Articale Not Found'
                })
            }
        }).then(()=>{
            if (categoryId){
                Category.findById('categoryId').then((category)=>{
                    if (!category){
                        //עשיתי פה החזרה כדי לא להגיע למצב של עדכון כתבה חדשה כמו שקורה בשורה 99 
                       return Category.findById(categoryId).then((category)=>{ 
                            if (!category){
                               return res.status(404).json({
                                    message:'Category Not Found'
                                })
                            }
    
                            return Articale.updateOne({_id:articaleId}, req.body)
                            
                        }).then(()=>{
                            res.status(200).json({
                            message:'Created Articale'
                        })
                        }).catch(error=>{
                            res.status(500).json({
                                error
                            })
                        })
                    }
                    
    
                    res.status(200).json({
                        articales
                })
                }).catch(error=>{
                    res.status(500).json({
                        error
                    })
                })
            }
    
            Articale.updateOne({_id:articaleId}, req.body).then(()=>{
                res.status(200).json({
                    message:'Articale Updated'
                })
            }).catch(error=>{
                res.status(500).json({
                    error
                })
            })
    
        })

            },
    deleteArticale: (req,res)=>{
        const articaleId=req.params.articaleId;

        Articale.deleteOne({_id: articaleId}).then(()=>{
            res.status(200).json({
                message: `Articale _id: ${articaleId} Deleted`
            })
        }).catch(error=>{
            res.status(500).json({
                error
            })
        })
    }
}