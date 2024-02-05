import express from 'express';
import aiRoutes from './routes/aiTranslationRoutes.js'
import dotenv from "dotenv"
dotenv.config()
const app = express();
const port = process.env.NODE_PORT || 3000;

app.use(express.json());

// app.use('/api/ai', aiRoutes);

app.get("/", (req, res) => {
  res.send("API is running...")
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});