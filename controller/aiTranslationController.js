   import {azureTranslation, detectLanguage} from '../utils/azureAiTranslatorUtils.js'
   export const createTranslation = async (req, res) => {
    const translations = await azureTranslation(req.body.text, req.body.language)
    res.status(200).json({ translations: translations[0]})

  };
  
  export const conversate = async (req, res) => {
    const detected = await detectLanguage(req.body)

    res.status(200).json({result: detected})
  }