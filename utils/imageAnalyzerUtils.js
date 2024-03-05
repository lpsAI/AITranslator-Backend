import { fileUpload } from "../controller/aiBlobStorageController.js";
import { azureTranslation } from "../utils/azureAiTranslatorUtils.js";
import require from "../utils/require.js";
const createClient = require("@azure-rest/ai-vision-image-analysis").default;
import { AzureKeyCredential } from "@azure/core-auth";

export default async function handleImageTranslation(req, res) {
  let response;
  try {
    const { resJson, jsonBody } = await fileUpload(req);
    const url = resJson.link;
    const { fromLanguage, toLanguage } = jsonBody;
    const detectedText = await azureImageAnalyzer(url);
    const translationTextResponse = await azureTranslation(
      detectedText,
      toLanguage,
      fromLanguage
    );

    response = {
      imageUrl: url,
      detectedText: detectedText,
      translationTextResponse: translationTextResponse[0].translations,
    };

    return response;
  } catch (error) {
    console.error(error);
  }
}

async function azureImageAnalyzer(url) {
  const endpoint = process.env.COMPUTER_VISION_ENDPOINT;
  const key = process.env.COMPUTER_VISION_KEY;
  const credential = new AzureKeyCredential(key);
  const client = createClient(endpoint, credential);
  const features = ["Read"];
  const imageUrl = url;
  let text;

  await client
    .path("/imageanalysis:analyze")
    .post({
      body: { url: imageUrl },
      queryParameters: { features: features },
      contentType: "application/json",
    })
    .then((result) => {
      const iaResult = result.body;
      if (iaResult.readResult && iaResult.readResult.blocks.length > 0) {
        iaResult.readResult.blocks.forEach((block) => {
          const blockResponse = JSON.stringify(block);
          const parsedResponse = JSON.parse(blockResponse);
          text = parsedResponse.lines[0].text;
        });
      } else {
        console.log("No text blocks detected.");
      }
    });

  return text;
}
