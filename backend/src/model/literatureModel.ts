import db from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';  // Import ResultSetHeader

// Get all literature (approved)
export const getAllLiterature = (): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM literature WHERE approved = 1', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results as RowDataPacket[]);  // Cast to RowDataPacket[]
      }
    });
  });
};

// Get literature by ID
export const getLiteratureById = (id: number): Promise<RowDataPacket | null> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM literature WHERE id = ?', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        // Destructure results to get rows directly
        const [rows] = results as [RowDataPacket[], unknown];
        resolve(rows[0] || null);  // Access the first row
      }
    });
  });
};

// Create new literature
export const createLiterature = (literature: any): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const { title, description, file_url, created_by } = literature;
    db.query(
      'INSERT INTO literature (title, description, file_url, created_by) VALUES (?, ?, ?, ?)',
      [title, description, file_url, created_by],
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

// Approve literature
export const approveLiterature = (id: number): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE literature SET approved = 1 WHERE id = ?', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results as ResultSetHeader);  // Cast to ResultSetHeader
      }
    });
  });
};

export const getAllAvailableLiterature = (): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM literature', (err, results) => {  // This fetches all literature
      if (err) {
        reject(err);
      } else {
        resolve(results as RowDataPacket[]);
      }
    });
  });
};

// Update literature
export const updateLiterature = (id: number, data: any): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const { title, description, file_url, approved } = data;
    db.query(
      'UPDATE literature SET title = ?, description = ?, file_url = ?, approved = ? WHERE id = ?',
      [title, description, file_url, approved, id],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results as ResultSetHeader);
        }
      }
    );
  });
};

// Delete literature
export const deleteLiterature = (id: number): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM literature WHERE id = ?', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results as ResultSetHeader);
      }
    });
  });
};
