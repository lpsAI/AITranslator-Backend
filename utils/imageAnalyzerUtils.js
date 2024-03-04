import { fileUpload } from "../controller/aiBlobStorageController.js";
import axios from "axios";
import imageAnalyzer from "../utils/imageAnalyzer.js";

export default async function handleImageTranslation(req, res) {
  let response 
  try {
    const { resJson, jsonBody } = await fileUpload(req);

    const url = resJson.link;

    const originLanguage = jsonBody.fromLanguage;

    const detectedText = await imageAnalyzer(url, originLanguage);

    const translatedTextResponse = await axios.post(
      process.env.BASE_URL + process.env.TRANSLATE_URL,
      {
        text: detectedText.replace(/\n/g, ""),
        language: jsonBody.toLanguage,
      }
    );

    const translatedText = translatedTextResponse.data;

    response = {
      imageUrl: url,
      detectedText: detectedText.replace(/\n/g, ""),
      translatedText: translatedText,
    };

    return response;
  } catch (error) {
    console.error(error);
  }
}
