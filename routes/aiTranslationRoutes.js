// routes/userRoutes.js
import express from 'express';
import {  createTranslation, detectLang, transLiterate, getLanguages } from '../controller/aiTranslationController.js'
import { fileDownload, fileUpload, retrieveAllImgs } from '../controller/aiBlobStorageController.js';


const router = express.Router();

// Define routes and link them to controller methods
router.get('/v1/getLang', getLanguages)

router.post('/v1/ai', createTranslation);
router.post('/v1/detect', detectLang);
router.post('/v1/translib',transLiterate);

// for blob storage
router.post('/v1/upload', fileUpload)
router.post('/v1/download', fileDownload)
router.get('/v1/images/all', retrieveAllImgs)

export default router;
