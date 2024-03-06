import busboy from "busboy"
import { downloadImg, getAllImgs, initializeContainer, uploadImg } from "../utils/azureBlobStorageUtils.js";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const fileUpload = (req, res) => {
  return new Promise((resolve, reject) => {
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
        resolve({ resJson, jsonBody });
      } catch (error) {
        reject(error);
      }
    });

    req.pipe(initBusBoy);

    // Handle any errors
    initBusBoy.on('error', err => {
      reject(err);
    });
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
    throw new Error(error.message);
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
 */
export const fileUploadOnly = async (req, res) => {
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

  res.pipe(initBusBoy);
}