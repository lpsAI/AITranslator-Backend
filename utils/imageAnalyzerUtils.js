import { fileUpload } from "../controller/aiBlobStorageController.js";
import imageAnalyzer from "../utils/imageAnalyzer.js";
import { azureTranslation } from "../utils/azureAiTranslatorUtils.js";

export default async function handleImageTranslation(req, res) {
  let response;
  try {
    const { resJson, jsonBody } = await fileUpload(req);

    const url = resJson.link;

    const originLanguage = jsonBody.fromLanguage;

    const detectedText = await imageAnalyzer(url, originLanguage);

    if (jsonBody.fromLanguage === "eng") {
      const translationTextResponse = await azureTranslation(
        detectedText.replace(/\n/g, ""),
        jsonBody.toLanguage,
        "en"
      );
      response = {
        imageUrl: url,
        detectedText: detectedText.replace(/\n/g, ""),
        translationTextResponse: translationTextResponse[0].translations,
      };
    }

    return response;
  } catch (error) {
    console.error(error);
  }
}
