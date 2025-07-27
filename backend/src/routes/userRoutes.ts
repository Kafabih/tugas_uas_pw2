import express from 'express';
import { registerUserController, updateUserController, deleteUserController, getAllUsersController } from '../controllers/userControllers';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';

const router = express.Router();

// Register new user (public route)
router.post('/register', registerUserController);

// Update user (protected route)
router.put('/:id', verifyToken, authorizeRole(['superadmin', 'teacher']), updateUserController);

// Delete user (protected route)
router.delete('/:id', verifyToken, authorizeRole(['superadmin']), deleteUserController);

// Get all users (protected route - superadmin only)
router.get('/', verifyToken, authorizeRole(['superadmin']), getAllUsersController);


export default router;