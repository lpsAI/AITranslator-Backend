import busboy from "busboy";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { processSpeechToText } from "../utils/azureAiSpeechUtils.js";

const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
import logger from "../logger/logger.js";
import { createWriteStream } from "node:fs";
import { dir, setGracefulCleanup } from "tmp";

ffmpeg.setFfmpegPath(ffmpegStatic);
setGracefulCleanup();
/**
 * 
 * @param {import("express").Request} req Express Request
 * @param {import("express").Response} res Express Response
 * @param {import("express").NextFunction} next
 * @returns 
 */
export const convertToWavFile = (req, res, next) => {
  const initBusBoy = busboy({ headers: req.headers });
 
  let mainFileName;
  let mainMimeType;
  let jsonBody = {sourceLang: '', targetLang: ''}
  let isWav = false;
  let isAudioVideo = false;
  let base64data = '';

  dir({unsafeCleanup: true}, (err, tmpDir) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to create temporary directory' }));
      return;
    }

    req.pipe(initBusBoy);

    const outputFilePath = `${tmpDir}/output.wav`;

    initBusBoy.on('field', (fieldname, val) => {
      jsonBody[fieldname] = val
    });


  
    initBusBoy.on('file', (fieldname, file, {encoding, filename, mimeType}) => {
      mainFileName = filename;
      mainMimeType = mimeType;
      if (mimeType === 'audio/wav') {
        isWav = true;
      } else if (mimeType.includes('audio') || mimeType.includes('video')) {
        isAudioVideo = true;
      }

      file.pipe(createWriteStream(`${tmpDir}/${mainFileName}`));
    })

    initBusBoy.on('finish', () => {
      if (isWav) {
        processWavFiles(ffmpeg, `${tmpDir}/${mainFileName}`, outputFilePath, jsonBody, res)
      } else if (isAudioVideo) {
        convertToWavThenProcess(ffmpeg,  `${tmpDir}/${mainFileName}`, outputFilePath, jsonBody, res)
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unsupported file type ' + mainMimeType }));
      }
    })
  });

  res.on('error', err => next(err));
}

/**
 * @param {ffmpeg} ffmpeg
 * @param {string} inputPath 
 * @param {string} outputFilePath 
 * @param {{sourceLang: string, targetLang: string}} jsonBody 
 * @param {import("express").Response} res 
 */
const processWavFiles = (ffmpeg, inputPath, outputFilePath, jsonBody, res) => {
  ffmpeg().input(inputPath)
  .audioCodec('pcm_s16le')
  .audioFilters('volume=2.0') // Double the volume
  .inputFormat('wav')
  .audioFrequency(16000)
  .audioChannels(1)
  .saveToFile(outputFilePath)
  .on('progress', (progress) => {
    if (progress.percent) {
      logger.info(`Processing: ${Math.floor(progress.percent)}% done`);
    }
  })
  .on('error', (err) => {
    logger.error('Error converting audio: ' + err);
  })
  .on('end', () => {
    console.log('Audio conversion complete');
    processSpeechToText(outputFilePath, jsonBody.sourceLang, jsonBody.targetLang).then(translated => {
      res.status(200).json({translated})
    }).catch(() => {
      res.status(400).json({message: "Not translated"})
    })
  })
}

/**
 * @param {ffmpeg} ffmpeg
 * @param {string} inputPath 
 * @param {string} outputFilePath 
 * @param {{sourceLang: string, targetLang: string}} jsonBody 
 * @param {import("express").Response} res 
 */
const convertToWavThenProcess = (ffmpeg, inputPath, outputFilePath, jsonBody, res) => {
  ffmpeg()
  .input(inputPath)
  .toFormat('wav')
  .audioCodec('pcm_s16le')
  .audioFilters('volume=2.0') // Double the volume
  .audioFrequency(16000)
  .audioChannels(1)
  .saveToFile(outputFilePath)
  .on('progress', (progress) => {
    if (progress.percent) {
      logger.info(`Processing: ${Math.floor(progress.percent)}% done`);
    }
  })
  .on('error', (err) => {
    logger.error('Error converting audio: ' + err);
  })
  .on('end', () => {
    console.log('Audio conversion complete');
    processSpeechToText(outputFilePath, jsonBody.sourceLang, jsonBody.targetLang).then(translated => {
      res.status(200).json({translated})
    }).catch(() => {
      res.status(400).json({message: "Not translated"})
    })
  })
}