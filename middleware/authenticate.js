const User=require('../models/user')
const jwt=require('jsonwebtoken')

const authenticate=async (req,res,next)=>
{
    try{
        const token=req.header('Authorization')
  
    const user=jwt.verify(token,'secreteKey')    // get the user from jwt token
    console.log('UserId===>>>>',user.userId)
    const userById= await User.findByPk(user.userId)
      req.user=userById        // assign user with global object req so that we can use it anywhere
      next();
    }
    catch(err)
    {
        
        res.status(500).json({responce:"Something wrong in authentication"})
    }

}

module.exports=
{
    authenticate
}