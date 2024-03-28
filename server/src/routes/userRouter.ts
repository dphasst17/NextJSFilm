import express from "express";
import Users from "../controllers/userController"
import MiddleWare from "../middleware/middleware";
const router = express.Router();
const UserController = new Users()
const Middle = new MiddleWare()
router.post('/',Middle.verify as any,UserController.getUser as any)
router.post('/update',Middle.verify as any,UserController.updateUser as any)
router.post('/all',Middle.verify as any,Middle.verifyAdmin as any,UserController.getAll)
export default router