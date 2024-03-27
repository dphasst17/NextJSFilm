import express from "express";
import Auth from "../controllers/authController";
import MiddleWare from "../middleware/middleware";
const router = express.Router()
const AuthController = new Auth();
const Middle = new MiddleWare()
router.post('/register',AuthController.register)
router.post('/login',AuthController.login)
router.post('/token',Middle.verify as any,AuthController.createNewToken as any)
router.patch('/password/update',Middle.verify as any,AuthController.updatePassword as any)
router.post('/register/staff',Middle.verify as any,Middle.isAdmin as any,AuthController.register)
export default router