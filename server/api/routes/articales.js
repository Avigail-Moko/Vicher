const express=require('express');
const router=express.Router();

const upload=require('../middlewares/upload');
const checkAuth=require('../middlewares/checkAuth');

const {
    getAllArticales,
    createArticale,
    getArticale,
    updateArticale,
    deleteArticale
}= require('../controllers/articales')

router.get('/',getAllArticales);
router.get('/:articaleId',getArticale)

//הוספתי כאן פונקציה שהיא המידלוור שלי
router.post('/',checkAuth,upload.single('image'), createArticale);
//שלושת הראוטים האלו מיועדים רק למי שמחובר ויכול לערוך את המאמרים, לא כל אחד
//נבדוק שהוא אכן מחובר ע"י הוספת מידלוור checkAuth
router.patch('/:articaleId',checkAuth, updateArticale);

router.delete('/:articaleId',checkAuth, deleteArticale);

module.exports= router;