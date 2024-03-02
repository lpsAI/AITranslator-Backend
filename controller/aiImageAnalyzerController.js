import { fileUpload } from './aiBlobStorageController.js'
import { createTranslation } from './aiTranslationController.js'
import { BASE_URL, TRANSLATE_URL } from '../constants.js'
import axios from 'axios'
import imageAnalyzer from "../utils/imageAnalyzer.js"

export const analyzeImage = async (req, res) => {

  try {
    const { resJson, jsonBody } = await fileUpload(req);

    const imageLink = resJson.link;

    const detectedText = await imageAnalyzer(imageLink);

    const translatedTextResponse = await axios.post(BASE_URL + TRANSLATE_URL, {
      text: detectedText.replace(/\n/g, ''),
      language: jsonBody.language
    });

    const translatedText = translatedTextResponse.data;

    const response = {
      imageUrl: imageLink,
      detectedText: detectedText.replace(/\n/g, ''),
      translatedText: translatedText
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while analyzing the image' });
  }
};

