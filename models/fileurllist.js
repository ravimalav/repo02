const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const ExpenceUrlList=sequelize.define('expence_url_list',
{
    id:
    {
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    expence_url:Sequelize.STRING
})

module.exports=ExpenceUrlList;