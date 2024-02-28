import { createWorker, createScheduler } from 'tesseract.js';

const imageAnalyzer = async (url) => {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(url);
    console.log(text);
    await worker.terminate();

    return text;
}

export default imageAnalyzer
