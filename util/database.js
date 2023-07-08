const Sequelize=require('sequelize')

const sequelize=new Sequelize('daytoday_expenses','root','ravi2233',
{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize;