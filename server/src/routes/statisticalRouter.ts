import express from "express";
import Statistical from "../controllers/statisticalController";
const router = express.Router()
const Manage = new Statistical()
router.get('/user',Manage.user)
router.get('/popular',Manage.popular)
router.get('/ticket',Manage.ticketRevenue)
export default router