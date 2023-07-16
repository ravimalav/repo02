const express=require('express');

const app=express();

const dotenv = require('dotenv');
dotenv.config();

const sequelize=require('./util/database');


const cors=require('cors')
app.use(cors())

const bodyParser=require('body-parser');

app.use(bodyParser.json())

const User=require('./models/user')
const Expence=require('./models/expences')
const Order=require('./models/purchase')
const forgotPassword=require('./models/forgotpassword')

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
const purchaseRoutes=require('./routes/purchase');
app.use('/user',purchaseRoutes)
const premiumRoutes=require('./routes/premium')
app.use('/premium',premiumRoutes)
const forgotPasswordRoutes=require('./routes/forgotpassword')
app.use('/password',forgotPasswordRoutes)

User.hasMany(Order)    //one User has many Order
Order.belongsTo(User) //user belongsTo expence 
User.hasMany(Expence)   //user can have many expence
Expence.belongsTo(User)   //user    belongs to expence
User.hasMany(forgotPassword)
forgotPassword.belongsTo(User)
sequelize
// .sync({force:true})
.sync() 
.then(result=>
    {
        app.listen(3000)
    })
.catch(err=>console.log(err))
