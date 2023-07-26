const Sequelize=require('sequelize')
const process=require('process')
const sequelize=new Sequelize('daytoday_expenses','root',process.env.DATABASE_PASS,
{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize;

