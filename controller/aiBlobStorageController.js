import busboy from "busboy"
import { downloadImg, getAllImgs, uploadImg } from "../utils/azureBlobStorageUtils.js";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const fileUpload = (req, res) => {
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
    })
  }).on('finish', async () => {
    const upload = await uploadImg(base64Data, mimeType)
    if (upload._response.status !== 201) {
      throw new Error(
        `Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`
      );
    }
    res.status(upload._response.status).json({message: `Upload succesful! Reference ID ${upload.requestId}`});
    res.end();
  });

  req.pipe(initBusBoy);


}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const fileDownload = (req, res) => {
  const downloadedImg = downloadImg(req.body.filename);

  res.status(200).json({downloadedImg});
}

export const retrieveAllImgs = async (req, res) => {
  const listOfFiles = await getAllImgs();

  res.status(200).json({listOfFiles});
}