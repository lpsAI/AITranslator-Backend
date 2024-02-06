
const apiKey = process.env.TEXT_TRANSLATOR_API_KEY || "47c7adebf3e84ed9a35c4d4c85bc05f6"
const endpoint = process.env.ENDPOINT || "https://api.cognitive.microsofttranslator.com"
const region = process.env.TEXT_TRANSLATOR_REGION || "southeastasia"
import axios from "axios"
import {v4} from 'uuid';

/**
 * 
 * @param {'translate' | 'detect' | 'transliterate'} path 
 * @param {{Text: string}[]} data 
 * @param {string} method 
 * @param {string} fromLang optional except path is transliterate
 * @param {string} toLang optional except path is translate, transliterate
 * @param {string} baseLang optional except path is transliterate
 * @returns 
 */
export const initTranslationPath = (path, data, method, fromLang, toLang, baseLang) => {
    return axios({
      baseURL: endpoint,
      url: `/${path}`,
      method: method,
      headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          // location required if you're using a multi-service or regional (not global) resource.
          'Ocp-Apim-Subscription-Region': region,
          'Content-type': 'application/json',
          'X-ClientTraceId': v4().toString()
      },
      params: {
          'api-version': '3.0',
          language: baseLang ?? 'en',
          from: fromLang ?? 'en',
          to: toLang,
          fromScript: fromLang,
          toScript: toLang          
      },
      data,
      responseType: 'json'
  })
}