// src/controllers/commentControllers.ts
import { Request, Response } from 'express';
import { createComment, getCommentsByLiterature, updateComment, deleteComment, getAllComments } from '../model/commentModel';

export const createCommentController = async (req: Request, res: Response) => {
  const { literature_id, comment,  username} = req.body;
  const user_id = req.user?.id;  // Get user ID from JWT token

  if (!user_id) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  try {
    await createComment(literature_id, user_id,username, comment, );
    res.status(201).json({ message: 'Comment created successfully' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

export const getCommentsByLiteratureController = async (req: Request, res: Response) => {
  const { literature_id } = req.params;
  try {
    const comments = await getCommentsByLiterature(Number(literature_id));
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err });
  }
};

export const getAllCommentsController = async (req: Request, res: Response) => {
  const { literature_id } = req.params;
  try {
    const comments = await getAllComments();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all comments', error: err });
  }
};

export const updateCommentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;

  const user_id = req.user?.id;  // Get user ID from JWT token

  const commentToUpdate = await getCommentsByLiterature(Number(id));  // Get the comment by ID

  if (!commentToUpdate) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  if (commentToUpdate[0]?.user_id !== user_id && req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'You are not authorized to update this comment' });
  }

  try {
    await updateComment(Number(id), comment);  // Update the comment in DB
    res.json({ message: 'Comment updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating comment', error: err });
  }
};

export const deleteCommentController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user_id = req.user?.id;  // Get user ID from JWT token

  const commentToDelete = await getCommentsByLiterature(Number(id));  // Get the comment by ID

  if (!commentToDelete) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  if (commentToDelete[0]?.user_id !== user_id && req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'You are not authorized to delete this comment' });
  }

  try {
    await deleteComment(Number(id));  // Delete the comment from the DB
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err });
  }
};
