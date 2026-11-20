import * as JsSearch from 'js-search';
import indexDocumentsInChunks from './indexDocumentsInChunks';

const waitForCompletion = (search, documents, timeBudgetInMs?: number) => new Promise<void>((resolve) => {
  indexDocumentsInChunks(search, documents, resolve, timeBudgetInMs);
});

describe('indexDocumentsInChunks', () => {
  const documents = Array.from({ length: 50 }, (_, i) => ({ uid: `id${i}`, text: `study number${i} cohort` }));

  it('does not index anything synchronously', () => {
    const search = { addDocuments: jest.fn() };
    const cancel = indexDocumentsInChunks(search, documents, jest.fn());
    expect(search.addDocuments).not.toHaveBeenCalled();
    cancel();
  });

  it('produces the same search results as indexing all documents at once', async () => {
    const makeSearch = () => {
      const search = new JsSearch.Search('uid');
      search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
      search.addIndex('text');
      return search;
    };
    const allAtOnce = makeSearch();
    allAtOnce.addDocuments(documents);
    const chunked = makeSearch();
    // a 0ms budget forces one document per chunk
    await waitForCompletion(chunked, documents, 0);
    ['cohort', 'number1', 'mber4', 'missing'].forEach((term) => {
      expect(chunked.search(term)).toEqual(allAtOnce.search(term));
    });
  });

  it('calls onComplete when there are no documents', async () => {
    const search = { addDocuments: jest.fn() };
    await waitForCompletion(search, []);
    expect(search.addDocuments).not.toHaveBeenCalled();
  });

  it('stops indexing and never completes once cancelled', async () => {
    const search = { addDocuments: jest.fn() };
    const onComplete = jest.fn();
    const cancel = indexDocumentsInChunks(search, documents, onComplete, 0);
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    cancel();
    const indexedCount = search.addDocuments.mock.calls.length;
    await new Promise((resolve) => { setTimeout(resolve, 20); });
    expect(search.addDocuments.mock.calls.length).toBe(indexedCount);
    expect(indexedCount).toBeLessThan(documents.length);
    expect(onComplete).not.toHaveBeenCalled();
  });
});
