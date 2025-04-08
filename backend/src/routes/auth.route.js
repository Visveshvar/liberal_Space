import express from "express";
import{
    getAuthUrl,
    getToken,
    checkLoggedIn,
    logout,
} from '../controllers/auth.controller.js'
const router= express.Router();

router.get('/url', getAuthUrl);
router.get('/token', getToken);
router.get('/logged_in', checkLoggedIn);
router.post('/logout', logout);

export default router