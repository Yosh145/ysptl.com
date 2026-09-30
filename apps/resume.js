(() => {
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs';
  const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs';
  const PDF_PATH = 'YashPatel_Resume2026.pdf';

  let pdfDoc = null;
  let loading = null;
  let currentPage = 1;
  let currentScale = 1.5;
  let currentRotation = 0;

  const $ = id => document.getElementById(id);

  async function renderPage(num) {
    const canvas = $('pdf-canvas');
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: currentScale, rotation: currentRotation });
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = Math.floor(viewport.width) + 'px';
    canvas.style.height = Math.floor(viewport.height) + 'px';

    await page.render({
      canvasContext: canvas.getContext('2d'),
      viewport: viewport,
      transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null
    }).promise;
    $('page-info').textContent = `Page ${num} / ${pdfDoc.numPages}`;
  }

  // auto scale page
  async function fitWidth() {
    const page = await pdfDoc.getPage(currentPage);
    const base = page.getViewport({ scale: 1, rotation: currentRotation });
    const container = $('pdf-container');
    const pad = parseFloat(getComputedStyle(container).paddingLeft) * 2;
    const avail = container.clientWidth - pad;
    if (avail > 0) currentScale = Math.min(Math.max(avail / base.width, 0.5), 4);
  }

  // pdfjs load
  async function loadPDF() {
    const canvas = $('pdf-canvas');
    const pdfMessage = $('pdf-message');
    try {
      const pdfjsLib = await import(PDFJS);
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      pdfDoc = await pdfjsLib.getDocument(PDF_PATH).promise;
      pdfMessage.style.display = 'none';
      canvas.style.display = 'block';
      await fitWidth();
      await renderPage(currentPage);
    } catch (err) {
      pdfMessage.innerHTML = '<i class="fa-solid fa-file-circle-exclamation"></i>Could not load resume PDF.<br><small>Place <b>YashPatel_Resume2026.pdf</b> in the site root.</small>';
      canvas.style.display = 'none';
      loading = null;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('pdf-canvas').style.display = 'none';

    // wire up zoom, page turn, and rotate actions
    $('btn-prev').addEventListener('click', () => {
      if (pdfDoc && currentPage > 1) { currentPage--; renderPage(currentPage); }
    });

    $('btn-next').addEventListener('click', () => {
      if (pdfDoc && currentPage < pdfDoc.numPages) { currentPage++; renderPage(currentPage); }
    });

    $('btn-zoom-in').addEventListener('click', () => {
      currentScale = Math.min(currentScale + 0.25, 4);
      if (pdfDoc) renderPage(currentPage);
    });

    $('btn-zoom-out').addEventListener('click', () => {
      currentScale = Math.max(currentScale - 0.25, 0.5);
      if (pdfDoc) renderPage(currentPage);
    });

    $('btn-rotate').addEventListener('click', () => {
      currentRotation = (currentRotation + 90) % 360;
      if (pdfDoc) renderPage(currentPage);
    });
  });

  window.APPS = window.APPS || {};
  window.APPS.resume = {
    onOpen() {
      if (!loading) loading = loadPDF();
    }
  };
})();
