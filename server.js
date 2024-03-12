import './env.js'
import express from 'express';
import aiRoutes from './routes/aiTranslationRoutes.js'
import cors from 'cors';
import compression from 'compression'

const app = express();
const port = process.env.NODE_PORT;

app.use(cors({
  origin: '*'
}));

app.use(cors())

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use(compression())

app.use('/api', aiRoutes);

app.get("/", (req, res) => {
  res.send("API is running...")
})

app.get('/healthcheck', (req, res) => {
  res.status(200).json('The API is running 🤞');
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});