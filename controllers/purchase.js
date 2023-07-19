
const Order=require('../models/purchase')
const Razorpay=require('razorpay')
const process=require('process')
const { or } = require('sequelize')
const User = require('../models/user')
const jwt=require('jsonwebtoken')

const jasonWebToken=(id,premiumStatus)=>
{
  return jwt.sign({userId:id, isPremiumUser:premiumStatus},'secreteKey')    
}


exports.premiumSubscription=async(req,res,next)=>
{ 
    try{
          var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,           
            key_secret:process.env.RAZORPAY_KEY_SECRET
          })
         
        const amount=100;
        
        rzp.orders.create({amount, currency:"INR"},async(err,order)=>     //create the order calling to razorpay api 
        {
            if(err)
            {
                throw new Error(JSON.stringify(err))
            }
           await req.user.createOrder({orderid:order.id, status:"PENDING"})   //saving order details in database
              return res.status(201).json({order, key_id:rzp.key_id})  
        })
    }
    catch(err)
    {
        res.status(403).json({responce:"Something wrong in razor payment" ,error:err})
    }
}



exports.updateTransactionStatus=async (req,res,next)=>
{
    try
    {
     const{payment_id,order_id}=req.body
     const order=await Order.findOne({where:{orderid:order_id}})
     const promise1=order.update({paymentid:payment_id,status:'SUCCESSFUL'})
     const promise2=req.user.update({ispremiumuser:true})   //promise1 and promise2 can paralally run together
      console.log(req.user.ispremiumuser)
    //using promise.all becuase all the promises are independent and return failed is any one is go to fail
    Promise.all([promise1,promise2]).then(()=>
    {
      return res.status(202).json({success:true,responce:"Transaction Successfull",token:jasonWebToken(req.user.id, true)})
    }).catch(err=>
      {
        throw new Error(err)
      })
      
    }
    catch(err)
    {
       res.status(500).json({responce:"Something Wrong in Transaction Status"}) 
    }
}

exports.failedPayment=async(req,res,next)=>
{
       try{
            const{order_id,payment_id}=req.body
            const canceledOrder=await User.findOne({where:{orderid:order_id}})
            if(!canceledOrder)
            {
              canceledOrder.update({paymentid:payment_id,status:'Failed',})
              return res.status(500).json({success:false,responce:"Transaction Failed"})
            }
       }
       catch(err)
       {
        return res.status(500).json({responce:"Something Wrong With Payment Status"})
       }
}