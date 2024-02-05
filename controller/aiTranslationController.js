   import azureTranslation from '../utils/azureAiTranslatorUtils.js'
   const createTranslation = (req, res) => {
    // Business logic to create a new user
    const sampleText = " Hello"
    const language = "es"
    console.log(req.body)
    try {
      azureTranslation(sampleText, language)
    } catch (error) {
      console.log(error)
    }
  
    res.status(201).json(req.body);
  };
  
  export {
    createTranslation
  };
  