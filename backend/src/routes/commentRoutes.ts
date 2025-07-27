// src/routes/commentRoutes.ts
import express from 'express';
import {
  createCommentController,
  getCommentsByLiteratureController,
  updateCommentController,
  deleteCommentController,
  getAllCommentsController
} from '../controllers/commentControllers';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Create a new comment (protected route)
router.post('/create_comment', verifyToken, createCommentController);

// Get comments by literature ID (public route)
router.get('/get_comment_literature/:literature_id', getCommentsByLiteratureController);

// Update a comment (protected route)
router.put('/get_comment/:id', verifyToken, updateCommentController);

// Delete a comment (protected route)
router.delete('/delete_comment/:id', verifyToken, deleteCommentController);

// Delete a comment (protected route)
router.get('/get_all', getAllCommentsController);

export default router;
