   import azureTranslation from '../utils/azureAiTranslatorUtils.js'
   const createTranslation = async (req, res) => {

    const translations = await azureTranslation(req.body.textTranslation, req.body.language)

    console.log(translations)
    
    res.status(200).json({ Translation: translations})

  };
  
  export {
    createTranslation
  };
  