const User = require('../models/user')
const Expence = require('../models/expences')
const sequelize  = require('../util/database')

const leaderBoardData=async(req,res,next)=>
{
    try{
          
        const leaderBoardDetails=await User.findAll({
                attributes: ['id', 'name','total_expence'],
                order: [[sequelize.col('total_expence'), 'DESC']]
            });

            res.status(201).json({responce:leaderBoardDetails})
    }
    catch(err)
    {
        res.status(500).json({error:err})
    }
}

module.exports={leaderBoardData}