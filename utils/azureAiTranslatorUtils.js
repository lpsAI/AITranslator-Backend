import { createRequire } from "module";
import require from '../utils/require.js'
const TextTranslationClient = require("@azure-rest/ai-translation-text").default

// const TextTranslationClient = require("@azure-rest/ai-translation-text").default

const apiKey = process.env.API_KEY
const endpoint = process.env.API_ENDPOINT
const region = process.env.REGION

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
      from: "en",
    },
  });

  const translations = translateResponse.body;
  for (const translation of translations) {
    console.log(
      `Text was translated to: '${translation?.translations[0]?.to}' and the result is: '${translation?.translations[0]?.text}'.`
    );
  }
}


export default azureTranslation