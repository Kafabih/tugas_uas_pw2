import express from 'express';
import { getAllLiteratureController, getLiteratureByIdController, createLiteratureController, approveLiteratureController, getAllAvailableLiteratureController, deleteLiteratureController, updateLiteratureController } from '../controllers/literatureControllers';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';

const router = express.Router();

// Get all approved literature
router.get('/get_all', getAllLiteratureController);

// Get literature by ID
router.get('/get_literature/:id', getLiteratureByIdController);

// Create new literature (only teachers and superadmins can create)
router.post(
  '/',
  verifyToken,  // Protect route
  authorizeRole(['teacher', 'superadmin']),  // Allow only teachers or superadmins to create literature
  createLiteratureController
);

// Approve literature (only superadmins can approve)
router.put(
  '/:id/approve',
  verifyToken,  // Protect route
  authorizeRole(['superadmin']),  // Only superadmins can approve literature
  approveLiteratureController
);

// Route for fetching all literature (approved or not) - only accessible by superadmins
router.get('/all', verifyToken, authorizeRole(['superadmin']), getAllAvailableLiteratureController);


router.put(
  '/edit/:id',
  verifyToken,  // Protect route
  authorizeRole(['teacher', 'superadmin']),  // Only teachers or superadmins can update literature
  updateLiteratureController
);

// Delete literature (only superadmins can delete)
router.delete(
  '/:id',
  verifyToken,  // Protect route
  authorizeRole(['superadmin']),  // Only superadmins can delete literature
  deleteLiteratureController
);

export default router;
