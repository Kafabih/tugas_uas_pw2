import express from 'express';
import { loginController, registerUserController } from '../controllers/userControllers';

const router = express.Router();

// **Login route should not be protected by JWT verification**
router.post('/login', loginController);

// **Login route should not be protected by JWT verification**
router.post('/register', registerUserController);


export default router;