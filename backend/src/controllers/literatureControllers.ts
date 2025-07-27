import { Request, Response } from 'express';
import { getAllLiterature, getLiteratureById, createLiterature, approveLiterature,getAllAvailableLiterature, updateLiterature, deleteLiterature } from '../model/literatureModel';

export const getAllLiteratureController = async (req: Request, res: Response) => {
  try {
    const literature = await getAllLiterature();
    res.json(literature);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching literature', error: err });
  }
};

export const getLiteratureByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if the id is a valid number
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid ID format. ID must be a number.' });
  }

  try {
    const literature = await getLiteratureById(Number(id));
    if (!literature) {
      return res.status(404).json({ message: 'Literature not found' });
    }
    res.json(literature);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching literature', error: err });
  }
};

export const createLiteratureController = async (req: Request, res: Response) => {
  const { title, description, file_url } = req.body;
  const created_by = req.user?.id;  // Accessing the user ID from the JWT token

  if (!created_by) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  try {
    await createLiterature({ title, description, file_url, created_by, approved: false, created_at: new Date().toISOString() });
    res.status(201).json({ message: 'Literature created successfully' });
  } catch (err) {
    const error = err as Error;
    console.error(error);  // Log the error for debugging
    res.status(500).json({ message: 'Error creating literature', error: error.message });
  }
};

export const approveLiteratureController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await approveLiterature(Number(id));
    res.json({ message: 'Literature approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving literature', error: err });
  }
};

export const getAllAvailableLiteratureController = async (req: Request, res: Response) => {
  try {
    const literature = await getAllAvailableLiterature();
    console.log('Literature fetched:', literature);  // Log to debug
    res.json(literature);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all literature', error: err });
  }
};

export const updateLiteratureController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, file_url, approved } = req.body;
  try {
    const updatedLiterature = await updateLiterature(Number(id), { 
      title, 
      description, 
      file_url,
      approved 
    });
    res.json({ message: 'Literature updated successfully', updatedLiterature });
  } catch (err) {
    res.status(500).json({ message: 'Error updating literature', error: err });
  }
};

export const deleteLiteratureController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteLiterature(Number(id));
    res.json({ message: 'Literature deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting literature', error: err });
  }
};