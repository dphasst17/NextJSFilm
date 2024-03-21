import express from "express";
import Auth from "../controllers/authController";
const router = express.Router()
const AuthController = new Auth();
router.post('/register',AuthController.register)
router.post('/login',AuthController.login)
router.post('/admin/',AuthController.verify as any)
router.post('/token',AuthController.verify as any,AuthController.createNewToken as any)
export default router