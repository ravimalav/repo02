const express=require('express')

const router=express.Router()

const userAuthenticate=require('../middleware/authenticate')

const orderController=require('../controllers/purchase')

router.get('/create-order',userAuthenticate.authenticate,orderController.premiumSubscription)
router.post('/updated-transaction-details',userAuthenticate.authenticate,orderController.updateTransactionStatus)
router.post('/failed-transaction-details',userAuthenticate.authenticate,orderController.failedPayment)

module.exports=router;