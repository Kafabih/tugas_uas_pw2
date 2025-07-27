import db from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get a user by email (SELECT query)
export const getUserByEmail = async (email: string): Promise<RowDataPacket | null> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        return reject(err);
      }
      // TypeScript knows that results is an array of RowDataPacket
      const [rows] = results as [RowDataPacket[], unknown];
      resolve(rows[0] || null);  // Return the first row or null if not found
    });
  });
};

// Create a new user (INSERT query)
export const createUser = async (userData: { email: string; password: string; role: number }): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const { email, password, role } = userData;
    db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, password, role],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results as ResultSetHeader);  // Casting to ResultSetHeader
      }
    );
  });
};

// Update a user's information (UPDATE query)
export const updateUser = async (id: number, userData: { email?: string; password?: string; role?: number }): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const { email, password, role } = userData;
    db.query(
      'UPDATE users SET email = ?, password = ?, role = ? WHERE id = ?',
      [email, password, role, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results as ResultSetHeader);
      }
    );
  });
};

// Delete a user (DELETE query)
export const deleteUser = async (id: number): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results as ResultSetHeader);
    });
  });
};

export const getAllUsers = async (): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        return reject(err);
      }
      
      // Handle empty results
      if (!Array.isArray(results) || results.length === 0) {
        return resolve([]);
      }

      // Return all users as RowDataPacket array
      resolve(results as RowDataPacket[]);
    });
  });
};
