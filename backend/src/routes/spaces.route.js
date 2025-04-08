import express from "express"
import { createSpace } from "../controllers/space.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
const router=express.Router()

router.post('/createSpaces',authMiddleware,createSpace)

export default router