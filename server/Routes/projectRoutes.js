import express from 'express';

import { getAllProjects, createProject, updateProjectById, deleteProjectById, getProjectById } from "../Controllers/ProjectController.js"
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router()

router.route('/')
    .post(isAuthenticated, isAdmin, createProject)
    .get(isAuthenticated, isAdmin, getAllProjects)
router.route('/:id')
    .put(isAuthenticated, isAdmin, updateProjectById)
    .delete(isAuthenticated, isAdmin, deleteProjectById)
    .get(isAuthenticated, getProjectById);

export default router