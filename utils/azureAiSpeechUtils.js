import { AudioConfig, OutputFormat, ProfanityOption, ResultReason, SpeechTranslationConfig, TranslationRecognizer } from "microsoft-cognitiveservices-speech-sdk";
import logger from "../logger/logger.js";
import { readFileSync } from 'node:fs'

const SPEECH_KEY = process.env.SPEECH_KEY;
const SPEECH_REGION = process.env.SPEECH_REGION;

export const processSpeechToText = (wavFile, sourceLang, targetLang) => {
  const speechConfig = SpeechTranslationConfig.fromSubscription(
    SPEECH_KEY,
    SPEECH_REGION
  );
  speechConfig.speechRecognitionLanguage = sourceLang;
  speechConfig.addTargetLanguage(targetLang)
  speechConfig.setProfanity(ProfanityOption.Raw);
  speechConfig.outputFormat = OutputFormat.Detailed;
  const audioConfig = AudioConfig.fromWavFileInput(readFileSync(wavFile));

  const recognizer = new TranslationRecognizer(
    speechConfig,
    audioConfig
  );

  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(result => {
      if (result.reason === ResultReason.TranslatedSpeech) {
        resolve(result.translations.get(targetLang));
        recognizer.close();

      } else {
        logger.error('Error on translating audio: ' + result.errorDetails)
        reject('Not Translated')
        recognizer.close();
      }

    }, (err) => {
      logger.error("err - " + err);
      reject(err);
      recognizer.close();
    });
  })


}