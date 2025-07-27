import db from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';  // Import ResultSetHeader

// Like literature (INSERT query)
export const likeLiterature = async (literature_id: number, user_id: number): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO literature_likes (literature_id, user_id) VALUES (?, ?)',
      [literature_id, user_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results as ResultSetHeader);
      }
    );
  });
};

// Get the number of likes for a literature
export const getLikesCount = async (literature_id: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) AS likesCount FROM literature_likes WHERE literature_id = ?', [literature_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      // Cast results to RowDataPacket[] to ensure correct type for accessing the result
      const row = results as RowDataPacket[];
      resolve(row[0].likesCount);  // Access the first row and get the likesCount field
    });
  });
};

// Remove like from literature (DELETE query)
export const removeLike = async (literature_id: number, user_id: number): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    db.query(
      'DELETE FROM literature_likes WHERE literature_id = ? AND user_id = ?',
      [literature_id, user_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results as ResultSetHeader);
      }
    );
  });
};
