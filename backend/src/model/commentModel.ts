// src/model/commentModel.ts
import db from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Create a new comment
export const createComment = (literature_id: number, user_id: number, username: string, comment: string): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO comments (literature_id, user_id, username, comment) VALUES (?, ?, ?, ?)',
      [literature_id, user_id, username, comment],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results as ResultSetHeader);  // Cast to ResultSetHeader
        }
      }
    );
  });
};

// Get comments by literature ID
export const getCommentsByLiterature = (literature_id: number): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM comments WHERE literature_id = ?', [literature_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results as RowDataPacket[]);  // Cast to RowDataPacket[]
      }
    });
  });
};

// Get comments by literature ID
export const getAllComments = (): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM comments',  (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results as RowDataPacket[]);  // Cast to RowDataPacket[]
      }
    });
  });
};

// Update a comment
export const updateComment = (id: number, newComment: string): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE comments SET comment = ? WHERE id = ?',
      [newComment, id],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results as ResultSetHeader);  // Cast to ResultSetHeader
        }
      }
    );
  });
};

// Delete a comment
export const deleteComment = (id: number): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM comments WHERE id = ?', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results as ResultSetHeader);  // Cast to ResultSetHeader
      }
    });
  });
};
