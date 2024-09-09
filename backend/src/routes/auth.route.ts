import express  from "express";
import { login, logout, signup, getMe } from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router()

router.get('/me', protectRoute, getMe)
router.post('/signup', signup)
router.get('/login', login)
router.get('/logout', logout)

export default router
