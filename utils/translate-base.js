
const apiKey = process.env.TEXT_TRANSLATOR_API_KEY || "47c7adebf3e84ed9a35c4d4c85bc05f6"
const endpoint = process.env.ENDPOINT || "https://api.cognitive.microsofttranslator.com"
const region = process.env.TEXT_TRANSLATOR_REGION || "southeastasia"
import axios from "axios"
import {v4} from 'uuid';

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