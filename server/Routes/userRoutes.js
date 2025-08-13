import express from 'express';
import { createUser, updateUserById, loginUser, deleteUserById, getAllUsers, logoutUser } from '../Controllers/UserController.js';
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js"


const router = express.Router()
// Routes for Admin
router.route('/register').post(createUser)
router.route('/:id').delete(isAuthenticated, isAdmin, deleteUserById)

// Simple Routes
router.route("/all").get(isAuthenticated, isAdmin, getAllUsers)
router.route('/login').post(loginUser)
router.route('/logout').post(isAuthenticated, logoutUser)
router.route('/:id').put(isAuthenticated, updateUserById)

export default router;