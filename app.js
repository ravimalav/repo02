const express=require('express');

const app=express();

const Sequelize=require('sequelize')

const sequelize=require('./util/database');

const cors=require('cors')
app.use(cors())

const bodyParser=require('body-parser');

app.use(bodyParser.json())


app.use((req,res,next)=>
{
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next();
})  

const userRoutes=require('./routes/user')
app.use('/user',userRoutes)

sequelize
// .sync({force:true})
.sync() 
.then(result=>
    {
        app.listen(3000)
    })
.catch(err=>console.log("err into app"))
