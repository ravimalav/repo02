const Sequelize=require('sequelize')
const process=require('process')
const sequelize=new Sequelize('daytoday_expenses',process.env.DATABASE_USERNAME,process.env.DATABASE_PASS,
{
    dialect:process.env.DATABASE_DIALECTNAME,
    host:process.env.DATABASE_HOSTNAME
})

module.exports=sequelize;

