import { initTranslationPath } from './translate-base.js'

export const azureTranslation = async (textTranslation, language) => {

  const inputText = [{ Text: textTranslation }];
  let resData;

  try {
    resData = (await initTranslationPath('translate', inputText, 'POST', 'en', language)).data;
  } catch (error) {
    throw error;
  }
  
  return resData;
}

export const detectLanguage = async (payload) => {
  let resData;
  try {
    resData = (await initTranslationPath('detect', payload, 'POST')).data
  } catch (error) {
    throw error;
  }
  return resData
}

