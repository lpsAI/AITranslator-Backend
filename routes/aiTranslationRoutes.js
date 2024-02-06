// routes/userRoutes.js
import express from 'express';
import {  createTranslation, conversate, transLiterate } from '../controller/aiTranslationController.js'


const router = express.Router();

// Define routes and link them to controller methods
router.post('/v1/ai', createTranslation);
router.post('/v1/convo', conversate);
router.post('/v1/translib',transLiterate)

export default router;
