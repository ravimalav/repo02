const Expence=require('../models/expences')

exports.getListItems=async (req,res,next)=>
{
    try
    {
        const allListItems=await Expence.findAll()
        res.status(201).json({responce:allListItems})
    }
    catch(err)
    {
        res.status(500).json({responce:"Can not loaditems at this time, try again!"})
    }
}

exports.addExpence=async (req,res,next)=>
{
   try{
        const{amount,description,category}=req.body
         function stringValidator(string)
         {
            if(string===undefined || string.length>=0)
            {
               return true;
            }
            else{
                false
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
                expence_category:category
            }
        )
        res.status(200).json({responce:addExpence})
   }
   catch(responce)
   {
    res.status(500).json({responce:"invalid Expence"})
   }
}

exports.deleteExpence=async(req,res,next)=>
{
    try{
        const expenceId=req.params.expenceId
        await Expence.destroy({where:{id:expenceId}})
        res.status(201).json({responce:"expence deleted successfully"})
    }
    catch(err)
    {
        res.status(500).json({responce:"Expence is not deleted"})
    }
}