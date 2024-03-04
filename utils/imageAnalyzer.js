import { createWorker, createScheduler } from 'tesseract.js';

const imageAnalyzer = async (url, language) => {
    const worker = await createWorker(language);
    const { data: { text } } = await worker.recognize(url);
    await worker.terminate();

    return text;
}

export default imageAnalyzer
