import { fileUpload } from './aiBlobStorageController.js'
import { createTranslation } from './aiTranslationController.js'
import { BASE_URL, TRANSLATE_URL } from '../constants.js'
import axios from 'axios'
import imageAnalyzer from "../utils/imageAnalyzer.js"

export const analyzeImage = async (req, res) => {
  const uploadedUrl = await fileUpload(req, res)
  
  const detectedText = await imageAnalyzer(uploadedUrl)

  const translatedText = await axios.post(BASE_URL + TRANSLATE_URL, detectedText)

  console.log(detectedText)


  const response = {
    imageUrl: uploadedUrl,
    detectedText: detectedText,
    translatedText: translatedText
  } 

  res.status(200).json(response)

    }

