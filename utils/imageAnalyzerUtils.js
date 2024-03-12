// import { fileUpload } from "../controller/aiBlobStorageController.js";
// import { azureTranslation } from "../utils/azureAiTranslatorUtils.js";
import logger from "../logger/logger.js";
import { initVisionPath } from "./translate-base.js";

/**
 * 
 */
export default async function handleImageTranslation(resJson,  jsonBody) {
  let response;
  try {
    // const { resJson, jsonBody } = await fileUpload(req);
    const url = resJson.link;
    let status = 200;
    const { fromLanguage, toLanguage } = jsonBody;
    const rawResult = await azureImageAnalyzer(url, fromLanguage);
    // const translationTextResponse = await azureTranslation(
    //   detectedText,
    //   toLanguage,
    //   fromLanguage
    // );

    let detectedText = [];
    if (rawResult && rawResult.readResult) {
      rawResult.readResult.blocks.forEach(aBlock => {
        aBlock.lines.forEach(aLine => {
          detectedText.push(aLine.text);
        })
      })
    } else {
      status = 400;
      detectedText = []
    }
        
    detectedText = detectedText && detectedText.length != 0 ? detectedText.join(' ').trim() : ''

    response = {
      status,
      imageUrl: url,
      detectedText,
      // translationTextResponse: translationTextResponse[0].translations,
    };

    return response;
  } catch (error) {
    logger.error(error);
    throw new Error('Error on handleImageTranslation')
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
    text = (await initVisionPath(url, 'POST', fromLang)).data;
    // text = resData.readResult.content.replaceAll(/(\r\n|\n|\r)/gm, " ");
  } catch (error) {
    logger.error(error);
    throw new Error('Error on azureImageAnalyzer')
  }
    

  return text;
}
