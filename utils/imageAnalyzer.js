import { createWorker, createScheduler } from 'tesseract.js';

const imageAnalyzer = async (url, language) => {
    try {
        const worker = await createWorker(language);
        const {
          data: { text },
        } = await worker.recognize(url);
        await worker.terminate();
        return text;
    } catch (error) {
        console.error(error.message)
    }
    
}

export default imageAnalyzer
