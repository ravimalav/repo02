const express=require('express')

const router=express.Router()

const premiumController=require('../controllers/premium')
const userAuthenticate=require('../middleware/authenticate')

router.get('/leader-board',userAuthenticate.authenticate,premiumController.leaderBoardData)

module.exports=router