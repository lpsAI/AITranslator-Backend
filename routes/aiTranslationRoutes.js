// routes/userRoutes.js
import express from 'express';
import {  createTranslation } from '../controller/aiTranslationController.js'


const router = express.Router();

// Define routes and link them to controller methods
router.post('/ai', createTranslation);

export default router;
