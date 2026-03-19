import express from 'express'
import {register,login,logout,verifyOtp,verifyEamil,sendResetOtp,resetPassword,isAuthenticated} from '../controllers/authController.js'
import userId from '../middleware/extractUserId.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-verify-otp',userId,verifyOtp);
router.post('/verify-account',userId,verifyEamil)
router.post('/send-reset-otp',sendResetOtp)
router.post('/reset-password',resetPassword)
router.get('/is-auth',userId,isAuthenticated)

export default router;