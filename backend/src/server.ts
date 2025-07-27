import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import literatureRoutes from './routes/literatureRoutes';
import commentRoutes from './routes/commentRoutes';
import authRoutes from './routes/authRoutes';  // Add this line
import userRoutes from './routes/userRoutes';  // Add this line
import likeRoutes from './routes/likeRoutes';  // Add this line
import dotenv from 'dotenv';  // Import dotenv
import { likeLiterature } from './model/likesModel';

dotenv.config();  // Configure dotenv to load the .env file

// Enable CORS for all routes

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/literature', literatureRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/auth', authRoutes);  // Register auth routes

const PORT = process.env.PORT;

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
