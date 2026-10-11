import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Convert a PDF file to an array of { base64, mime, pageNumber, preview } objects.
 * Compresses each page to a JPEG under ~1.5MB.
 */
export async function pdfToImages(file, maxPages = 3, maxWidth = 1400) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  const pagesToProcess = Math.min(totalPages, maxPages);

  const images = [];
  for (let i = 1; i <= pagesToProcess; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });

    // Scale so width is maxWidth
    const scale = maxWidth / viewport.width;
    const scaled = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = scaled.width;
    canvas.height = scaled.height;
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport: scaled }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    images.push({
      base64: dataUrl.split(',')[1],
      mime: 'image/jpeg',
      preview: dataUrl,
      pageNumber: i,
    });
  }

  return { images, totalPages };
}

export async function imageFileToBase64(file, maxWidth = 1400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({
          base64: dataUrl.split(',')[1],
          mime: 'image/jpeg',
          preview: dataUrl,
          pageNumber: 1,
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}