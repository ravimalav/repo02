const User=require('../models/user')
const Expence=require('../models/expences')
const sequelize=require('../util/database')
const userServices=require('../services/userServices')
const s3Services=require('../services/s3Services')
const fileUrlList=require('../models/fileurllist')



exports.getExpences=async (req,res,next)=>
{
    try
    {
        const  ITEMS_PER_PAGE=3;
        const page=+req.query.page||1;
        console.log("page===>>>>"+page)
        let totalCount;
        const total=await Expence.count();
        totalCount=total;
        console.log("totalCount===>>>>"+totalCount)
        const allListItems=await Expence.findAll({
            where:{userId:req.user.id},
            offset:(page-1)*ITEMS_PER_PAGE+1,
            limit:ITEMS_PER_PAGE,   
        })
        res.status(201).json({
            responce:allListItems,
            currentPage:page,
            hasNextPage:ITEMS_PER_PAGE * page < totalCount,
            nextPage:page + 1 ,
            previousPage:page - 1,
            hasPreviousPage:page > 1, 
            lastPage:Math.ceil(totalCount/ITEMS_PER_PAGE)
        })
    }
    catch(err)
    {
        res.status(500).json({responce:"Can not loaditems at this time, try again!"})
    }
}

exports.addExpence=async (req,res,next)=>
{
      const t = await sequelize.transaction();     
   try{
                 //using transaction to prevent from unwanted changes
        const{amount,description,category}=req.body
         function stringValidator(string)
         {
            if(string===undefined || string.length<=0)
            {
               return true;
            }
            else{
               return false;
            }
         }

         if(stringValidator(amount) || stringValidator(description) || stringValidator(category))
         {
            return res.status(400).json({responce:"invalid list item"}) 
         }
         
        const addExpence=await Expence.create(
            {
                expence_amount:amount,
                expence_desc:description,
                expence_category:category,
                userId:req.user.id
            },
            { transaction: t }
        );
        const totalAmount=Number(req.user.total_expence) + Number(amount)
        await User.update(
            {
                total_expence:totalAmount
            },
            {
                where:{id:req.user.id},
                transaction: t
            }
             
        );
        await t.commit();
        res.status(200).json({responce:addExpence})
   }
   catch(err)
   {
    await t.rollback();
    res.status(500).json({responce:"invalid Expence",error:err})
   }
}

exports.deleteExpence=async(req,res,next)=>
{
    const t=await sequelize.transaction();
    try{
        const  expenceid=req.params.expenceId
        const findRelatedUser=await Expence.findOne(
            {
                where:{userId:req.user.id} && {id:expenceid}
            },
            {transaction: t}
        )
        await Expence.destroy({where:{userId:req.user.id} && {id:expenceid}},{transaction: t})
        const updatedtotalExpence=Number(req.user.total_expence)-Number(findRelatedUser.expence_amount)
        await User.update(
            {
                total_expence:updatedtotalExpence
            },
            {
                where:{id:req.user.id},
                transaction: t
            }
        )
        await t.commit();
        res.status(201).json({responce:"expence deleted successfully"})
    }
    catch(err)
    {
        await t.rollback();
        res.status(500).json({responce:"Expence is not deleted"})
    }
}



exports.downloadFile=async(req,res,next)=>
{
  try{
       const userId=req.user.id;   
       const expences=await userServices.getExpences(req)
       const stringifiedExpences=JSON.stringify(expences)
       const fileName=`Expence/${userId}/${new Date}.txt`
       const fileUrl=await s3Services.uploadToS3(stringifiedExpences,fileName)    //network call so used userService 
       await fileUrlList.create({
            expence_url:fileUrl,
            userId:req.user.id
       })      //saving file url into backend
       res.status(201).json({fileUrl,success:true})
  }
  catch(err)
  {
    res.status(500).json({responce:err})
  }
}