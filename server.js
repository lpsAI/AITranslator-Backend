import './env.js'
import express from 'express';
import aiRoutes from './routes/aiTranslationRoutes.js'
import cors from 'cors';
import compression from 'compression'
import winston from 'winston';

const app = express();
const port = process.env.NODE_PORT;

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize({level: true, message: false}),
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A'
    }),
    winston.format.align(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

app.use(cors({
  origin: '*'
}));

app.use(cors())

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use(compression())

app.use('/api', aiRoutes);

// app.use((err, req, res, next) => {
//   // Log the error message at the error level
//   logger.error(err.message);
//   res.status(500).send({err: err.message});
// });

app.get("/", (req, res) => {
  res.send("API is running...")
})

app.get('/healthcheck', (req, res) => {
  res.status(200).json('The API is running 🤞');
})

// Start the server
app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});