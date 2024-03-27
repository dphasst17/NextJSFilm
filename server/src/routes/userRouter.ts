import express from "express";
import Auth from "../controllers/authController";
import User from "../controllers/userController"
import MiddleWare from "../middleware/middleware";
const router = express.Router();
const UserController = new User()
const Middle = new MiddleWare()
router.post('/',Middle.verify as any,UserController.getUser as any)
router.post('/update',Middle.verify as any,UserController.updateUser as any)
router.post('/all',Middle.verify as any,Middle.verifyAdmin as any,UserController.getAll)
export default router