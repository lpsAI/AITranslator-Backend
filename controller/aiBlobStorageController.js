import busboy from "busboy"
import { downloadImg, getAllImgs, initializeContainer, uploadImg } from "../utils/azureBlobStorageUtils.js";
import { logger } from "../server.js";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next
 */
export const fileUpload = (req, res, next) => {
  const initBusBoy = busboy({ headers: req.headers });
    let base64Data = '';
    let mimeType = '';
    let jsonBody = {}

    initBusBoy.on('file', (name, file, info) => {
      mimeType = info.mimeType;
      file.setEncoding('base64');
      let buffer = '';
      file.on('data', rawData => {
        buffer += rawData;
      }).on('end', () => {
        base64Data = buffer;
      });
    }).on('field', (fieldname, val) => {
      jsonBody[fieldname] = val
    }).on('finish', async () => {
      try {
        const resJson = await uploadImg(base64Data, mimeType);
        res.locals.jsonBody = jsonBody;
        res.locals.resJson = resJson;
        next();
      } catch (error) {
        logger.error(error.message)
        next(error);
      }
    });

    req.pipe(initBusBoy);

    // Handle any errors
    initBusBoy.on('error', err => {
      next(err);
    });
  }

/**
 * 
 * @param {import("express").Request} _ unused request
 * @param {import("express").Response} _2 unused response
 * @param {import("express").NextFunction} next continue if container is created
 */
export const initContainer = (_, _2, next) => {
  initializeContainer().then(() => {
    next();
  }).catch(error => {
    logger.error(error.message);
    next(error);
  })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns {{downloadedImg: string}}
 */
export const fileDownload = (req, res) => {
  const downloadedImg = downloadImg(req.body.filename);

  res.status(200).json({ downloadedImg });
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns {{listOfFiles: import("@azure/storage-blob").BlobItem[] }}
 */
export const retrieveAllImgs = async (req, res) => {
  const listOfFiles = await getAllImgs();

  res.status(200).json({ listOfFiles });
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next
 */
export const fileUploadOnly = async (req, res, next) => {
  const initBusBoy = busboy({ headers: req.headers });
  let base64Data = '';
  let mimeType = '';

  initBusBoy.on('file', (name, file, info) => {
    mimeType = info.mimeType;
    file.setEncoding('base64');
    let buffer = '';
    file.on('data', rawData => {
      buffer += rawData;
    }).on('end', () => {
      base64Data = buffer;
    });
  }).on('finish', async () => {
    try {
      const resJson = await uploadImg(base64Data, mimeType);
      res.status(resJson.status).json(resJson);
      res.end();
    } catch (error) {
      res.status(500).json({error});
    }
  });

  res.on('error', err => next(err));

  res.pipe(initBusBoy);
}