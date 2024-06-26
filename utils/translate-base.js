const blobStorageConnectionString = process.env.BLOB_ACCOUNT_CONNECTION_STRING
import { BlobServiceClient } from "@azure/storage-blob"
import axios from "axios"
import {v4} from 'uuid';
const apiKey = process.env.TEXT_TRANSLATOR_API_KEY
const endpoint = process.env.ENDPOINT
const region = process.env.TEXT_TRANSLATOR_REGION

// Vision
const visionEndpoint = process.env.COMPUTER_VISION_ENDPOINT;
const visionKey = process.env.COMPUTER_VISION_KEY;
const visionApiVersion = process.env.COMPUTER_VISION_API_VERSION;

// For Azure Blob Storage
/**
 * 
 * @param {Translation} transObjs 
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const initTranslationPath = (transObjs) => {
    return axios({
      baseURL: endpoint,
      url: `/${transObjs.path}`,
      method: transObjs.method,
      headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          // location required if you're using a multi-service or regional (not global) resource.
          'Ocp-Apim-Subscription-Region': region,
          'Content-type': 'application/json',
          'X-ClientTraceId': v4().toString()
      },
      params: {
          'api-version': '3.0',
          language: transObjs.baseLang ?? 'en',
          from: transObjs.fromLang ?? 'en',
          to: transObjs.toLang,
          fromScript: transObjs.fromScript,
          toScript: transObjs.toScript,
          scope: transObjs.scope         
      },
      data: transObjs.data,
      responseType: 'json'
  })
}

export const initAZBlobStorage = () => {
    return BlobServiceClient.fromConnectionString(blobStorageConnectionString);
}

/**
 * 
 * @param {string} url
 * @param {'POST' | 'GET'} method
 * @param {string} language
 * @param {boolean} isOctet
 * @returns {Promise<import("axios").AxiosResponse>} 
 */
export const initVisionPath = (url, method, language, isOctet) => {
   return axios({
    baseURL: `${visionEndpoint}`,
    url: `computervision/imageanalysis:analyze?api-version=${visionApiVersion}`,
    method,
    headers: {
        'Ocp-Apim-Subscription-Key': visionKey,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': region,
        'Content-type': isOctet ? 'application/octet-stream' : 'application/json',
        'X-ClientTraceId': v4().toString()
    },
    params: {
        features: ['read'].toString(), // ['caption', 'denseCaptions']
        language
    },
    data: isOctet ? url : {url},
    responseType: 'json'
   })

}