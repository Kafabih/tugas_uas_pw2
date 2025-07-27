import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import db from '../config/db';  // Import your DB configuration
import { RowDataPacket } from 'mysql2';  // Import RowDataPacket for proper typing

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user by email in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    // Cast results to RowDataPacket[] to be type-safe
    const user = (results as RowDataPacket[])[0];  // Access the first result

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the given password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords', error: err });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token if password matches
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,  // Optional: Include the user's role if needed
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Send the token in the response
      res.json({
        message: 'Login successful',
        token: token,
      });
    });
  });
};


