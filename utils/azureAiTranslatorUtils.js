import { createRequire } from "module";
import require from '../utils/require.js'
const TextTranslationClient = require("@azure-rest/ai-translation-text").default

// const TextTranslationClient = require("@azure-rest/ai-translation-text").default

const apiKey = process.env.TEXT_TRANSLATOR_API_KEY || "47c7adebf3e84ed9a35c4d4c85bc05f6"
const endpoint = process.env.ENDPOINT || "https://api.cognitive.microsofttranslator.com"
const region = process.env.TEXT_TRANSLATOR_REGION || "southeastasia"

const azureTranslation = async(textTranslation, language) => {

  console.log("== Text translation sample ==");

  const translateCredential = {
    key: apiKey,
    region,
  };
  const translationClient = new TextTranslationClient(endpoint,translateCredential);

  const inputText = [{ text: textTranslation }];
  const translateResponse = await translationClient.path("/translate").post({
    body: inputText,
    queryParameters: {
      to: language,
      from: "fil",
    },
  });

  const translations = translateResponse.body;
  for (const translation of translations) {
    console.log(
      `Text was translated to: '${translation?.translations[0]?.to}' and the result is: '${translation?.translations[0]?.text}'.`
    );
  }

  return translations
}


export default azureTranslation