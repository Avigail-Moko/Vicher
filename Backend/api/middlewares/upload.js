// כאן ניצור מידלוור שיעלה תמונה לשרת עם שימוש במולטר

const multer= require('multer');

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads/')
    },
    filename:(req, file, cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const fileFilter= (req , file , cb) =>{
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    cb(null, false)
}

const upload=multer({
    // dest: 'uploads/',
    storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter
});

module.exports=upload;