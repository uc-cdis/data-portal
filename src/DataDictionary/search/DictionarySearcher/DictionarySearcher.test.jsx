import React, { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DictionarySearcher from './DictionarySearcher';

const testDict = {
  a1: {
    id: 'a1',
    category: 'A',
    description: 'whatever',
    properties: [],
  },
  a2: {
    id: 'a2',
    category: 'A',
    description: 'whatever description.',
    properties: [],
  },
  b1: {
    id: 'b1',
    category: 'B',
    description: 'whatever',
    properties: [],
  },
  b2: {
    id: 'b2',
    category: 'B',
    description: 'test node description',
    properties: [],
  },
  b3: {
    id: 'b3',
    category: 'B',
    description: 'whatever',
    properties: [],
  },
  b4: {
    id: 'b4',
    category: 'B',
    description: 'whatever',
    properties: [],
  },
};

test('renders', () => {
  const { container } = render(<DictionarySearcher dictionary={testDict} />);
  expect(container.firstElementChild).toHaveClass('data-dictionary-searcher');
});

test('autocompeletes, searches, and resets', () => {
  const onSearchResultCleared = jest.fn();
  const onSearchResultUpdated = jest.fn();
  const onSearchHistoryItemCreated = jest.fn();
  const onSaveCurrentSearchKeyword = jest.fn();
  const setIsSearching = jest.fn();
  const props = {
    dictionary: testDict,
    onSearchResultCleared,
    onSearchResultUpdated,
    onSearchHistoryItemCreated,
    onSaveCurrentSearchKeyword,
    setIsSearching,
  };
  const { container } = render(<DictionarySearcher {...props} />);
  fireEvent.change(container.querySelector('.auto-complete-input__input-box'), {
    target: { value: 'test' },
  });
  fireEvent.submit(container.querySelector('.auto-complete-input__form'));
  expect(onSearchResultCleared).toHaveBeenCalledTimes(1);
  expect(onSearchResultUpdated).toHaveBeenCalledTimes(1);
  expect(onSearchHistoryItemCreated).toHaveBeenCalledTimes(1);
  expect(onSaveCurrentSearchKeyword).toHaveBeenCalledTimes(1);
  expect(setIsSearching).toHaveBeenCalledTimes(2);

  fireEvent.click(screen.getByLabelText('Clear result'));
  expect(onSearchResultCleared).toHaveBeenCalledTimes(2);
});

test('calls search from outside', () => {
  function DictionarySearcherWrapper(props) {
    const ref = useRef(null);
    return (
      <div>
        <button
          onClick={() => ref.current.launchSearchFromOutside('test')}
          type='button'
        >
          Search
        </button>
        <DictionarySearcher ref={ref} {...props} />
      </div>
    );
  }

  const onSearchResultUpdated = jest.fn();
  const props = { dictionary: testDict, onSearchResultUpdated };
  render(<DictionarySearcherWrapper {...props} />);

  fireEvent.click(screen.getByText('Search'));
  expect(onSearchResultUpdated).toHaveBeenCalledTimes(1);
});
