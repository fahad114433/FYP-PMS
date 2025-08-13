import express from 'express';
import {
    createTask,
    updateTaskById,
    deleteTaskById,
    getTaskListById,
    taskAssignedToUser,
    getTaskById,
    taskAssignmentUpdate,
} from '../Controllers/TaskController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(isAuthenticated, createTask)

router
    .route('/:id')
    .put(isAuthenticated, updateTaskById)
    .delete(isAuthenticated, deleteTaskById)
    .get(isAuthenticated, getTaskListById);

router.route('/:moduleId/:taskId')
    .get(isAuthenticated, getTaskById);

router.route('/assigned/:id')
    .post(isAuthenticated, taskAssignedToUser)

router.route("/assignment/:taskId/:userId")
    .put(isAuthenticated, taskAssignmentUpdate);

export default router;