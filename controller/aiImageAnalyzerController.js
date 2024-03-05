import handleImageTranslation from '../utils/imageAnalyzerUtils.js'

export const analyzeImage = async (req, res) => {

  const translatedResponse =  await handleImageTranslation(req);

  res.status(200).json(translatedResponse)
};

