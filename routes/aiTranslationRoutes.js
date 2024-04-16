// routes/userRoutes.js
import express from 'express';
import {  createTranslation, detectLang, transLiterate, getLanguages, getLocalLang } from '../controller/aiTranslationController.js'
import { fileDownload, fileUpload, fileUploadOnly, initContainer, retrieveAllImgs } from '../controller/aiBlobStorageController.js';
import { analyzeImage, analyzeImageOnce } from '../controller/aiImageAnalyzerController.js'
import { errorLoggerMiddleware, loggerMiddleware } from '../logger/logger.js';
import { convertToWavFile } from '../controller/aiAudioController.js';


const router = express.Router();
router.use(loggerMiddleware);

// Define routes and link them to controller methods
router.get('/v1/getLang', getLanguages)
router.get('/v1/getLocaleLang', getLocalLang)

router.post('/v1/ai', createTranslation);
router.post('/v1/detect', detectLang);
router.post('/v1/translib',transLiterate);

// for blob storage
router.post('/v1/upload', initContainer, fileUploadOnly)
router.post('/v1/download', initContainer, fileDownload)
router.get('/v1/images/all', initContainer, retrieveAllImgs)

// For image analyzer
// router.post('/v1/imageAnalyzer', initContainer, analyzeImage)
router.post('/v1/imageAnalyzer', initContainer, fileUpload, analyzeImage)
router.post('/v1/textDetectOnly', analyzeImageOnce)
// router.post('/v1/preprocessImg', preprocessImgs)

// For audio process
router.post('/v1/convertToWav', convertToWavFile)
router.use(errorLoggerMiddleware);

export default router;
