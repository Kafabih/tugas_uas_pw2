import express from 'express';
import { likeLiteratureController, getLikesCountController, removeLikeController } from '../controllers/likesControllers';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Like a literature (protected route)
router.post('/:literature_id/like', verifyToken, likeLiteratureController);

// Get the number of likes for a literature (public route)
router.get('/:literature_id/likes', getLikesCountController);

// Remove like from a literature (protected route)
router.delete('/:literature_id/like', verifyToken, removeLikeController);

export default router;
