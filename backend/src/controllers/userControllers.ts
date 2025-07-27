import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import db from '../config/db';  // Import your DB configuration
import { RowDataPacket } from 'mysql2';  // Import RowDataPacket for proper typing
import { createUser, updateUser, deleteUser, getAllUsers } from '../model/userModel';

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user by email in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

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

      // Generate JWT token if password matches
      const payload = { id: user.id, email: user.email, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

      console.log("Generated Token:", token);  // Log the generated token for debugging

      res.json({ message: 'Login successful', token, role: user.role, username: user.username });
    });
  });
};

// Create new user (register)
export const registerUserController = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [username, email, hashedPassword, role], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Registration failed', error: err });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
};

// Update user
export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, password, role } = req.body;

  try {
    // If password is provided, hash it
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updatedUserData = { email, password: hashedPassword, role };

    await updateUser(Number(id), updatedUserData);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteUser(Number(id));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    
    // Remove passwords from response for security
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }));

    res.status(200).json(sanitizedUsers);
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve users', 
      error: error.message 
    });
  }
};

