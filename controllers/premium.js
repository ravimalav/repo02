const User = require('../models/user')
const Expence = require('../models/expences')
const { use } = require('../routes/user')

const leaderBoardData=async(req,res,next)=>
{
    try{
          const allExpences=await Expence.findAll()
          const allUsers=await User.findAll()

          const userAggregateExpences={}     // to store the all expences related to perticular id, store data intokey value pair
        
            allExpences.forEach(expence => {
                if(userAggregateExpences[expence.userId])
                {
                    userAggregateExpences[expence.userId]+=expence.expence_amount;
                }
                else
                {
                    userAggregateExpences[expence.userId]=expence.expence_amount
                }
            });
            console.log(userAggregateExpences)
            const leaderBoardDetails=[]
            allUsers.forEach(user => {
                if(userAggregateExpences[user.id])
                { 
                    leaderBoardDetails.push({name:user.name, totalExpence:userAggregateExpences[user.id]})
                }
                else
                {
                    leaderBoardDetails.push({name:user.name, totalExpence:0})
                }      
            });
            function compareNumbers(a, b) {
                return  b.totalExpence-a.totalExpence;
              }
            leaderBoardDetails.sort(compareNumbers);

            res.status(201).json({responce:leaderBoardDetails})
    }
    catch(err)
    {
        res.status(500).json({error:err})
    }
}

module.exports={leaderBoardData}