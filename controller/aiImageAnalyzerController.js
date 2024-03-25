import busboy from 'busboy';
import {handleImageTranslation, handleTextDectectionOnly} from '../utils/imageAnalyzerUtils.js'
import logger from '../logger/logger.js';
import sharp from 'sharp';

/**
 * 
 * @param {import('express').Response} res 
 */
export const analyzeImage = async (_, res) => {
  const translatedResponse =  await handleImageTranslation(res.locals.resJson, res.locals.jsonBody);

  res.status(translatedResponse.status).json(translatedResponse)
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
export const analyzeImageOnce = async (req, res, next) => {
  const initBusBoy = busboy({ headers: req.headers });
  let arrayBuffer = '';
  let jsonBody = {}

  initBusBoy.on('file', (name, file, info) => {
    file.setEncoding('binary');
    let buffer = '';
    file.on('data', rawData => {
      buffer += rawData;
    }).on('end', () => {
      arrayBuffer = buffer;
    });
  }).on('field', (fieldname, val) => {
    jsonBody[fieldname] = val
  }).on('finish', async () => {
    try {

      const base64Img = (await sharp(Buffer.from(arrayBuffer, 'binary'))
      .grayscale()
      .resize({ width: 500, height: 550, kernel: 'nearest' })
      .sharpen({
        sigma: 2,
        m1: 0,
        m2: 20,
        x1: 10,
        y2: 7,
        y3: 15,
      })
      .normalise({lower: 13, upper: 90})
      .threshold(150, { grayscale: true})
      .toFormat('png')
      .toBuffer()).toString('binary')

      const resJson = await handleTextDectectionOnly(Buffer.from(base64Img, 'binary'), jsonBody);
      res.status(resJson.status).json(resJson);
      res.end();
    } catch (error) {
      logger.error(error);
      res.status(500).json({error: error.message});
    }
  });

  res.on('error', err => next(err));

  req.pipe(initBusBoy);
}

// /**
//  * 
//  * @param {import('express').Request} req 
//  * @param {import('express').Response} res 
//  * @param {import('express').NextFunction} next
//  */
// export const preprocessImgs = (req, res, next) => {
//   const initBusBoy = busboy({ headers: req.headers });
//   let arrayBuffer = '';
//   let jsonBody = {}

//   initBusBoy.on('file', (name, file, info) => {
//     file.setEncoding('binary');
//     let buffer = '';
//     file.on('data', rawData => {
//       buffer += rawData;
//     }).on('end', () => {
//       arrayBuffer = buffer;
//     });
//   }).on('field', (fieldname, val) => {
//     jsonBody[fieldname] = val
//   }).on('finish', async () => {
//     const imgBuffer = Buffer.from(arrayBuffer, 'binary');

//     const base64Img = (await sharp(imgBuffer)
//       .grayscale()
//       .resize({ width: 500, height: 550, kernel: 'nearest' })
//       .sharpen({
//         sigma: 2,
//         m1: 0,
//         m2: 20,
//         x1: 10,
//         y2: 7,
//         y3: 15,
//       })
//       .normalise({lower: 13, upper: 100})
      
//       .threshold(150, { grayscale: true})
//       .toFormat('webp')
//       .toBuffer()).toString('base64');

//     // res.status(200).json({base64Img});
//     res.set('Content-Type', 'text/html').status(200).send(`<img src="data:image/webp;base64, ${base64Img}" alt="test" />`)
//   });

//   res.on('error', err => next(err));

//   req.pipe(initBusBoy);
// }

