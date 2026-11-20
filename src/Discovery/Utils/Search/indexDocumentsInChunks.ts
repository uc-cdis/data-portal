// js-search indexing (especially with AllSubstringsIndexStrategy) is CPU heavy and
// synchronous. Indexing thousands of studies in one go blocks the main thread for
// seconds, freezing the whole page. Instead, add documents to the index in small
// time-boxed chunks and yield to the browser in between, so it can paint and stay
// responsive while the index is being built in the background.

// Max time spent indexing before yielding to the browser; keeps each task short
// enough that the page stays responsive (~2 frames at 60fps)
const DEFAULT_TIME_BUDGET_IN_MS = 30;

/**
 * Adds `documents` to the js-search `search` object in time-boxed chunks.
 * Indexing starts on the next macrotask, so the caller's render is painted first.
 * @returns a function that cancels any remaining indexing work
 */
const indexDocumentsInChunks = (
  search: { addDocuments: (docs: any[]) => void },
  documents: any[],
  onComplete: () => void,
  timeBudgetInMs: number = DEFAULT_TIME_BUDGET_IN_MS,
): (() => void) => {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let nextIndex = 0;

  const indexNextChunk = () => {
    if (cancelled) {
      return;
    }
    const chunkStart = Date.now();
    // index at least one document per chunk to guarantee progress
    do {
      search.addDocuments([documents[nextIndex]]);
      nextIndex += 1;
    } while (nextIndex < documents.length && Date.now() - chunkStart < timeBudgetInMs);

    if (nextIndex < documents.length) {
      timer = setTimeout(indexNextChunk, 0);
    } else {
      onComplete();
    }
  };

  if (documents.length === 0) {
    timer = setTimeout(() => { if (!cancelled) onComplete(); }, 0);
  } else {
    timer = setTimeout(indexNextChunk, 0);
  }

  return () => {
    cancelled = true;
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  };
};

export default indexDocumentsInChunks;
