const express=require('express')

const router=express.Router()

const expenceController=require('../controllers/expence')

const userAuthenticate=require('../middleware/authenticate')

router.get('/get-expence',userAuthenticate.authenticate,expenceController.getExpences)
router.post('/add-expence',userAuthenticate.authenticate,expenceController.addExpence)
router.delete('/delete-expence/:expenceId',userAuthenticate.authenticate,expenceController.deleteExpence)
router.get('/download',userAuthenticate.authenticate,expenceController.downloadFile)

module.exports=router;