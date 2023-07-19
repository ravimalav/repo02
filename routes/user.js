const express=require('express')

const router=express.Router();

const userController=require('../controllers/user')
const userAuthenticate=require('../middleware/authenticate')

router.post('/signup',userController.signUp)
router.post('/login',userController.logIn)
router.get('/file-url-list',userAuthenticate.authenticate,userController.getFileList)

module.exports=router;