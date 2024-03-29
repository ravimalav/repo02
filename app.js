    const express=require('express');

    const app=express();
    const fs=require('fs')
    const path=require('path')
    const dotenv = require('dotenv');
    dotenv.config();

    // const nodemon=require('nodemon')
    // app.use(nodemon)

    const sequelize=require('./util/database');

    const cors=require('cors')
    app.use(cors())

    const bodyParser=require('body-parser');

    app.use(bodyParser.json())

    const helmet=require('helmet')
    const morgan=require('morgan')

    const User=require('./models/user')
    const Expence=require('./models/expences')
    const Order=require('./models/purchase')
    const forgotPassword=require('./models/forgotpassword')
    const expenceUrlList=require('./models/fileurllist')

    app.use((req,res,next)=>
    {
        res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5500');
        res.setHeader('Access-Control-Allow-Methods','POST,GET,PUT,PATCH,DELETE');
        res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
        next();
    })  

    const userRoutes=require('./routes/user')
    app.use('/user',userRoutes)
    const expenceRoutes=require('./routes/expence')
    app.use('/expence',expenceRoutes)
    const purchaseRoutes=require('./routes/purchase')
    app.use('/user',purchaseRoutes)
    const premiumRoutes=require('./routes/premium')
    app.use('/premium',premiumRoutes)
    const forgotPasswordRoutes=require('./routes/forgotpassword')
    const { cpuUsage } = require('process')
    app.use('/password',forgotPasswordRoutes)

    User.hasMany(Order)    //one User has many Order
    Order.belongsTo(User) //user belongsTo expence 
    User.hasMany(Expence)   //user can have many expence
    Expence.belongsTo(User)   //user    belongs to expence
    User.hasMany(forgotPassword)
    forgotPassword.belongsTo(User)
    User.hasMany(expenceUrlList)
    expenceUrlList.belongsTo(User)
    
    //creating file to store data into it
    const loggingAccesssFile=fs.createWriteStream(
       path.join(__dirname,'access.log'),
       {flags:'a'}
    )
    
    app.use(helmet())   
    if(process.env.NODE_ENV==='production')
    {
        app.use(morgan('combined',{stream:loggingAccesssFile}))
    }
    else{
        app.use(morgan('dev'))
    }
    
    console.log("process.env variable is==>>"+ process.env.NODE_ENV)

    sequelize
    // .sync({force:true})
    .sync()
    .then(result=>
        {
            app.listen(process.env.port||3000)
        })
    .catch(err=>console.log(err))
