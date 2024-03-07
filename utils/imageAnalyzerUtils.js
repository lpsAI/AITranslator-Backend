// import { fileUpload } from "../controller/aiBlobStorageController.js";
// import { azureTranslation } from "../utils/azureAiTranslatorUtils.js";
import { initVisionPath } from "./translate-base.js";

/**
 * 
 */
export default async function handleImageTranslation(resJson,  jsonBody) {
  let response;
  try {
    // const { resJson, jsonBody } = await fileUpload(req);
    const url = resJson.link;
    const { fromLanguage, toLanguage } = jsonBody;
    const detectedText = await azureImageAnalyzer(url, fromLanguage);
    // const translationTextResponse = await azureTranslation(
    //   detectedText,
    //   toLanguage,
    //   fromLanguage
    // );

    response = {
      imageUrl: url,
      detectedText,
      // translationTextResponse: translationTextResponse[0].translations,
    };

    return response;
  } catch (error) {
    console.error(error);
  }
}

/**
 * 
 * @param {string} url 
 * @param {string} fromLang 
 * @returns 
 */
async function azureImageAnalyzer(url, fromLang) {
  let text;
  try {
    const resData = (await initVisionPath(url, 'POST', fromLang)).data;
    text = resData.readResult.content.replaceAll(/(\r\n|\n|\r)/gm, " ");
  } catch (error) {
    throw error;
  }
    

  return text;
}
