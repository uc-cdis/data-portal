import React from 'react';
import { mount } from 'enzyme';
import { getSuggestionItemHTML } from './AutoCompleteSuggestions';
import AutoComplete from '.';

describe('<AutoComplete />', () => {
  const suggestionItem1 = {
    fullString: 'abcdea',
    matchedPieceIndices: [
      [0, 1],
      [5, 6],
    ],
  };

  const suggestionItem2 = {
    fullString: 'abcdefga',
    matchedPieceIndices: [
      [0, 1],
      [7, 8],
    ],
  };

  const suggestionList = [
    suggestionItem1,
    suggestionItem2,
  ];

  const suggestionItemClickFunc = jest.fn();
  const inputChangeFunc = jest.fn();
  const submitInputFunc = jest.fn();

  const autoComplete = mount(
    <AutoComplete
      suggestionList={suggestionList}
      onSuggestionItemClick={suggestionItemClickFunc}
      onInputChange={inputChangeFunc}
      onSubmitInput={submitInputFunc}
    />,
  );

  it('renders', () => {
    expect(autoComplete.find(AutoComplete).length).toBe(1);
  });

  it('call onInputChange function when typing', () => {
    const inputElem = autoComplete.find('.auto-complete-input__input-box');
    const testInput = 'test';
    for (let i = 0; i < testInput.length; i += 1) { // mock typing
      inputElem.simulate('change', { target: { value: testInput.substring(i) } });
    }
    expect(inputChangeFunc.mock.calls.length).toBe(testInput.length);
  });

  it('call onSubmitInput function when submit', () => {
    const formElem = autoComplete.find('.auto-complete-input__form');
    formElem.simulate('submit');
    expect(submitInputFunc.mock.calls.length).toBe(1);

    const iconElem = autoComplete.find('.auto-complete-input__icon');
    iconElem.simulate('click');
    expect(submitInputFunc.mock.calls.length).toBe(2);
  });

  it('call onSuggestionItemClick when clicking suggestion items', () => {
    const firstItemElem = autoComplete.find('.auto-complete-suggestions__item').first();
    firstItemElem.simulate('click');
    expect(suggestionItemClickFunc.mock.calls.length).toBe(1);
  });

  it('build html for suggestion items', () => {
    const builtFragment = mount(
      <div>
        {getSuggestionItemHTML(suggestionItem1)}
      </div>,
    );
    expect(builtFragment.find('.auto-complete-suggestions__highlight').length)
      .toBe(suggestionItem1.matchedPieceIndices.length);
  });

  it('could clear input from outside', () => {
    autoComplete.find(AutoComplete).instance().clearInput();
    const inputElem = autoComplete.find('.auto-complete-input__input-box');
    expect(inputElem.text()).toBe('');
  });
});
