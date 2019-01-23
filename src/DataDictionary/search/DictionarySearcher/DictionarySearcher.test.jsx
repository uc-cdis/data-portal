import React from 'react';
import { mount } from 'enzyme';
import DictionarySearcher from './DictionarySearcher';

describe('DictionarySearcher', () => {
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

  const keyword = 'test';
  const updateFunc = jest.fn();
  const resetFunc = jest.fn();
  const createHistoryFunc = jest.fn();
  const saveResultFunc = jest.fn();
  const setSearchFunc = jest.fn();
  const wrapper = mount(
    <DictionarySearcher
      dictionary={testDict}
      onSearchResultUpdated={updateFunc}
      onSearchResultCleared={resetFunc}
      onSearchHistoryItemCreated={createHistoryFunc}
      onSaveCurrentSearchKeyword={saveResultFunc}
      setIsSearching={setSearchFunc}
    />,
  );
  const dictionarySearcherInstance = wrapper.instance();

  it('can render', () => {
    expect(wrapper.find(DictionarySearcher).length).toBe(1);
  });

  it('can autocomplete, search, and reset', () => {
    // type in keyword, and hit enter
    const inputElem = wrapper.find('.auto-complete-input__input-box');
    inputElem.instance().value = keyword;
    const formElem = wrapper.find('.auto-complete-input__form');
    formElem.simulate('submit');
    expect(updateFunc.mock.calls.length).toBe(1);
    expect(saveResultFunc.mock.calls.length).toBe(1);
    expect(createHistoryFunc.mock.calls.length).toBe(1);
    expect(setSearchFunc.mock.calls.length).toBe(2);

    // clear input content, check: reset search result
    const resetElem = wrapper.find('.dictionary-searcher__result-clear');
    resetElem.simulate('click');
    expect(resetFunc.mock.calls.length).toBe(1);

    // call search from outside
    dictionarySearcherInstance.launchSearchFromOutside(keyword);
    expect(updateFunc.mock.calls.length).toBe(2);
  });
});
