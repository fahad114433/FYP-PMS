import express from 'express'
import { adminDashboard, userDashboard, contactMessage } from "../Controllers/DashboardController.js";
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js'

let router = express.Router()

router.route('/')
    .get(isAuthenticated, isAdmin, adminDashboard)

router.route('/user')
    .get(isAuthenticated, userDashboard)

router.route('/contact')
    .post(contactMessage)

export default router