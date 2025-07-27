import express from 'express';
import bodyParser from 'body-parser';
import literatureRoutes from './routes/literatureRoutes';
import commentRoutes from './routes/commentRoutes';

const app = express();
app.use(bodyParser.json());

app.use('/api/literature', literatureRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
