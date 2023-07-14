
const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const jasonWebToken=(id,premiumStatus)=>
{
  return jwt.sign({userId:id, isPremiumUser:premiumStatus},'secreteKey')    
}

exports.signUp=async (req,res,next)=>
{
    try{
    const {username,useremail,userpass}=req.body
    
    if(!username || !useremail || !userpass)
    {
      return res.status(400).json({responce:"Invalid data entry"})
    }
    const existingUser=await User.findOne({where:{email:useremail}})
    if(existingUser)
    {
      return res.status(400).json({responce:"Already exist user"})
    }

    //Encription of password
    const saltRounds=10;     //used to generate more secure random string
   const encryptedPassword= await bcrypt.hash(userpass,saltRounds)
    const createNewUser=  await User.create(
        {
            name:username,
            email:useremail,
            password:encryptedPassword,
        }
    )   
    
       res.status(201).json({responce:"Successfully created new user",success:true,token: jasonWebToken( createNewUser.id, null )})
       console.log("hello user ==>>"+createNewUser.ispremiumuser)
    }
    catch(err)
    {
        res.status(500).json({responce:"Sorry!,can't sign up"})
    }
}

exports.logIn=async(req,res,next)=>
{
   try{
       const email=req.body.email
       const password=req.body.password

      
       // checking that mail is areadi exist or not
     const user= await User.findAll(
      {
          where:{email:email} 
      }
   )
      if(user.length>0) 
      {
        bcrypt.compare(password,user[0].password, (err,result)=>    //we cant use res here  because we use it above so use result instead of res
        {
          if(err)
          {
            throw new Error("something went wrong")
          }
           if(result===true)
           {
            res.status(200).json({responce:"User log in sucessfully",success:true,token:jasonWebToken(user[0].id, user[0].ispremiumuser)})
           }
          else{
           return res.status(401).json({responce:"Password is incorrect",success:false})
          } 
        })
      }
      else{
        return res.status(400).json({responce:"User not authorized",success:false})
      }        
   }
   catch(err)
   {
    console.log("catch block of bakend")
    res.status(500).json({responce:err})
   }
}
