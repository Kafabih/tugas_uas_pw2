import { Request, Response } from 'express';
import { likeLiterature, getLikesCount, removeLike } from '../model/likesModel';

// Like a literature
export const likeLiteratureController = async (req: Request, res: Response) => {
  const { literature_id } = req.params;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  try {
    await likeLiterature(Number(literature_id), Number(user_id));
    res.status(200).json({ message: 'Literature liked successfully' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: 'Error liking literature', error: error.message });
  }
};

// Get the number of likes for a literature
export const getLikesCountController = async (req: Request, res: Response) => {
  const { literature_id } = req.params;

  try {
    const count = await getLikesCount(Number(literature_id));
    res.status(200).json({ likesCount: count });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: 'Error fetching likes count', error: error.message });
  }
};

// Remove like from a literature
export const removeLikeController = async (req: Request, res: Response) => {
  const { literature_id } = req.params;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  try {
    await removeLike(Number(literature_id), Number(user_id));
    res.status(200).json({ message: 'Like removed successfully' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: 'Error removing like', error: error.message });
  }
};
