const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const Expence=sequelize.define('expence',
{
    id:
    {
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    expence_amount:
    {
        type:Sequelize.INTEGER,
        allowNull:false
    },
    expence_desc:Sequelize.STRING,
    expence_category:Sequelize.STRING
});

module.exports=Expence;