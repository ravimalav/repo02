const Sequelize=require('sequelize')
const process=require('process')
const sequelize=new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USERNAME,process.env.DATABASE_PASS,
{
    dialect:'mysql',
    host:process.env.DATABASE_HOSTNAME
})

module.exports=sequelize;

