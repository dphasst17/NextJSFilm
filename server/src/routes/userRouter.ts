import express from "express";
import Auth from "../controllers/authController";
import User from "../controllers/userController"
const router = express.Router();
const UserController = new User()
const AuthController = new Auth();
router.post('/',AuthController.verify as any,UserController.getAll as any)
router.post('/update',AuthController.verify as any,UserController.updateUser as any)
export default router