let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

export function getPdfjs(): Promise<typeof import('pdfjs-dist')> {
    if (!pdfjsPromise) {
        pdfjsPromise = import('pdfjs-dist').then((mod) => {
            mod.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
            return mod;
        });
    }
    return pdfjsPromise;
}
