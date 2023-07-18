const express = require('express');
const router = express.Router();

const userRouter = require('../controllers/userSignUp');
const expenseRouter = require('../controllers/expense');
const incomeRouter = require('../controllers/income');
const userAuthentication = require('../middelware/auth');



router.post('/sign-up', userRouter.postUserDetails);
router.post('/log-in', userRouter.getUserDetail);
router.post('/expense', userAuthentication.authenticate, expenseRouter.postExpenseDetail);
router.get('/get-expense/:pageNumber', userAuthentication.authenticate, expenseRouter.getExpenseDetail);
router.post('/income',userAuthentication.authenticate, incomeRouter.postIncomeDetail);
router.get('/get-income',userAuthentication.authenticate, incomeRouter.getIncomeDetail);
router.delete('/delete-list/:listId',userAuthentication.authenticate, expenseRouter.deleteList);
router.get('/buy-premium', userAuthentication.authenticate, userRouter.buyPremium);
router.post('/update-tarnsaction-status', userAuthentication.authenticate, userRouter.updatePremium);
router.get('/leaderboard', userRouter.getLeaderboard);
router.post('/forgot-password', userRouter.getPassword);
router.get('/password/:uuId', userRouter.setPassword);
router.post('/reset-password', userRouter.updatePassword);
router.get('/download', userAuthentication.authenticate, expenseRouter.downloadExpense);
module.exports = router;