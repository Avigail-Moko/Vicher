const jwt = require('jsonwebtoken');

const checkAuth=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(' ')[1];
        const decoded=jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded; // Add the decoded data to the request object
        next();
    }
    catch(error){
        res.status(401).json({
            message:"Auth failed"
        })
    }
}

module.exports=checkAuth;