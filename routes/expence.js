const express=require('express')

const router=express.Router()

const expenceController=require('../controllers/expence')

router.get('/get-expence',expenceController.getListItems)
router.post('/add-expence',expenceController.addExpence)
router.delete('/delete-expence/:expenceId',expenceController.deleteExpence)

module.exports=router;