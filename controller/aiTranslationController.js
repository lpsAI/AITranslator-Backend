   import {azureTranslation, detectLanguage, getListOfLanguages, transLiterateText} from '../utils/azureAiTranslatorUtils.js'
   export const createTranslation = async (req, res) => {
    const translations = await azureTranslation(req.body.text, req.body.language, req.body.fromLang)
    res.status(200).json({ translations: translations[0].translations})

  };
  
  export const conversate = async (req, res) => {
    const payload = [{Text: req.body.text}];

    const detected = await detectLanguage(payload);

    res.status(200).json({result: detected})
  }

  export const transLiterate = async (req, res) => {
    const payload = [{Text: req.body.text}];

    const fromLang = req.body.fromLang;
    const toLang = req.body.toLang;
    const baseLang = req.body.baseLang;

    const transliterate = await transLiterateText(payload, fromLang, toLang, baseLang);

    res.status(200).json({transliterate: transliterate})

  }

  export const getLanguages = async (_, res) => {
    const languages = await getListOfLanguages();

    res.status(200).json({languages});
  }