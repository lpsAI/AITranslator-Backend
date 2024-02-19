import { v4 } from "uuid";
import { initAZBlobStorage } from "./translate-base.js"

/**
 * 
 * @param {any} file,
 * @param {string} fileName
 */
export const uploadImg = async (file, blobContentType) => {
  let uploadBlobResponse;
  let blockBlobClient;
  
  try {
    const fileName = `${v4().toString()}_${new Date().getTime()}`;
    const data = Buffer.from(file, 'base64');
    
    const containerClient = initAZBlobStorage().getContainerClient('translate-img');
    
    blockBlobClient = containerClient.getBlockBlobClient(fileName);
  
    uploadBlobResponse =await blockBlobClient.upload(data, data.length, {
      blobHTTPHeaders: {
        blobContentType
      }
    });

  } catch (error) {
    throw new Error(error.message);
  }

  const isUploadSuccessful = uploadBlobResponse._response.status === 201;
  const linkUrl = `${process.env.LINK_URL}/${blockBlobClient.containerName}/${blockBlobClient.name}`;

  return {
    status: uploadBlobResponse._response.status,
    [isUploadSuccessful ? 'link': 'error']: 
      isUploadSuccessful ? linkUrl : `Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`
  };
}

/**
 * 
 * @param {string} blobName filename
 * @returns {string}
 */
export const downloadImg = async (blobName) => {
  let downloadedImg;

  try {
    const containerClient = initAZBlobStorage().getContainerClient('translate-img');
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download();

    downloadedImg = (
      await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
    );

  } catch (error) {
    throw new Error(error.message);
  }   

  return Buffer.from(downloadedImg).toString('base64')
}

export const getAllImgs = async () => {
  let listOfArrays = [];
  try {
    const containerClient = initAZBlobStorage().getContainerClient('translate-img');
    const allBlobs = containerClient.listBlobsFlat();

    for await (const blob of allBlobs) {
      listOfArrays.push(blob);
    }
  
  } catch (error) {
    throw new Error(error.message);
  }

  return listOfArrays;
}

export const initializeContainer  = async () => {
  return await initAZBlobStorage().getContainerClient('translate-img').createIfNotExists({
    access: 'container'
  });
}


const streamToBuffer = (readableStream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}