import handleImageTranslation from '../utils/imageAnalyzerUtils.js'

/**
 * 
 * @param {import('express').Response} res 
 */
export const analyzeImage = async (_, res) => {
  const translatedResponse =  await handleImageTranslation(res.locals.resJson, res.locals.jsonBody);

  res.status(translatedResponse.status).json(translatedResponse)
};

