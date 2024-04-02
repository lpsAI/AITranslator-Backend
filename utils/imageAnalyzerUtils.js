// import { fileUpload } from "../controller/aiBlobStorageController.js";
import logger from "../logger/logger.js";
import { detectLanguage } from "./azureAiTranslatorUtils.js";
import { initVisionPath } from "./translate-base.js";

/**
 * 
 */
export const handleImageTranslation = async (resJson,  jsonBody) => {
  let response;
  try {
    // const { resJson, jsonBody } = await fileUpload(req);
    const url = resJson.link;
    let status = 200;
    const { fromLanguage, toLanguage } = jsonBody;
    const rawResult = await azureImageAnalyzer(url, fromLanguage, false);

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

    const detectPayload = [{ Text: detectedText}];

    const translationTextResponse = await detectLanguage(detectPayload);

    response = {
      status,
      imageUrl: url,
      detectedText,
      detectedLang: translationTextResponse[0].language
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
 * @param {Buffer} imgBuffer 
 * @param {{fromLanguage: string}} jsonBody 
 * @returns 
 */
export const handleTextDectectionOnly = async (imgBuffer, jsonBody) => {
  let response
  let status = 200
  const { fromLanguage } = jsonBody;

  try {
    const rawResult = await azureImageAnalyzer(imgBuffer, fromLanguage, true);

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

    const detectPayload = [{ Text: detectedText}];

    const translationTextResponse = await detectLanguage(detectPayload);


    response = {
      status,
      detectedText,
      detectedLang: translationTextResponse[0].language
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
async function azureImageAnalyzer(url, fromLang, isOctet = false) {
  let text;
  try {
    text = (await initVisionPath(url, 'POST', fromLang, isOctet)).data;
    // text = resData.readResult.content.replaceAll(/(\r\n|\n|\r)/gm, " ");
  } catch (error) {
    logger.error(error);
    throw new Error('Error on azureImageAnalyzer')
  }
    

  return text;
}
