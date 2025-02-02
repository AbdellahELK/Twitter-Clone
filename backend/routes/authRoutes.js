import express from 'express'
import { GetProfil, login, logout, signUp } from '../controllers/authController.js'
import protectedRoute from '../middlewear/protectedRoute.js'

const router = express.Router()

router.get('/profile', protectedRoute, GetProfil)
router.post('/signUp', signUp)
router.post('/login', login)
router.post('/logout', logout)


export default router