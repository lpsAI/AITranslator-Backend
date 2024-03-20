import busboy from 'busboy';
import {handleImageTranslation, handleTextDectectionOnly} from '../utils/imageAnalyzerUtils.js'
import logger from '../logger/logger.js';

/**
 * 
 * @param {import('express').Response} res 
 */
export const analyzeImage = async (_, res) => {
  const translatedResponse =  await handleImageTranslation(res.locals.resJson, res.locals.jsonBody);

  res.status(translatedResponse.status).json(translatedResponse)
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
export const analyzeImageOnce = async (req, res, next) => {
  const initBusBoy = busboy({ headers: req.headers });
  let arrayBuffer = '';
  let jsonBody = {}

  initBusBoy.on('file', (name, file, info) => {
    file.setEncoding('binary');
    let buffer = '';
    file.on('data', rawData => {
      buffer += rawData;
    }).on('end', () => {
      arrayBuffer = buffer;
    });
  }).on('field', (fieldname, val) => {
    jsonBody[fieldname] = val
  }).on('finish', async () => {
    try {
      const resJson = await handleTextDectectionOnly(Buffer.from(arrayBuffer, 'binary'), jsonBody);
      res.status(resJson.status).json(resJson);
      res.end();
    } catch (error) {
      logger.error(error);
      res.status(500).json({error: error.message});
    }
  });

  res.on('error', err => next(err));

  req.pipe(initBusBoy);
}

