import { Translation } from '../model/Translation.js';
import { initTranslationPath } from './translate-base.js'

export const azureTranslation = async (textTranslation, language, fromLang = 'en') => {

  const inputText = [{ Text: textTranslation }];
  let resData;
  const transObj = new Translation('translate', inputText, 'POST', fromLang, language);

  try {
    resData = (await initTranslationPath(transObj)).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
  
  return resData;
}

export const detectLanguage = async (payload) => {
  let resData;
  const transObj = new Translation('detect', payload, 'POST');

  try {
    resData = (await initTranslationPath(transObj)).data
  } catch (error) {
    throw error;
  }

  return resData
}

export const transLiterateText = async (payload, fromLang, toLang, baseLang) => {
  let resData;
  const transObj =
     new Translation('transliterate', payload, 'POST', null, null, baseLang, null, fromLang, toLang);
  try {
    resData = (await initTranslationPath(transObj)).data
  } catch (error) {
    throw error;
  }

  return resData
}

export const getListOfLanguages = async () => {
  let resData;
  const transObj = new Translation('languages', null, 'GET', null, null, null, 'translation');
  try {
    resData = (await initTranslationPath(transObj)).data.translation;
   
    resData = Object.keys(resData).map(key => Object.assign({ 
      langId: key,
      langName: resData[key].name
    }));    

  } catch (error) {
    throw error;
  }

  return resData;
}

