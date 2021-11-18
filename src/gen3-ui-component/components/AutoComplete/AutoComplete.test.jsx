import React, { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { getSuggestionItemHTML } from './AutoCompleteSuggestions';
import AutoComplete from './index';

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

test('renders', () => {
  const { container } = render(
    <AutoComplete suggestionList={[suggestionItem1, suggestionItem2]} />
  );
  expect(container.firstElementChild).toHaveClass('auto-complete');
});

test('calls onInputChange on type', () => {
  const onInputChange = jest.fn();
  const props = {
    suggestionList: [suggestionItem1, suggestionItem2],
    onInputChange,
  };
  const { container } = render(<AutoComplete {...props} />);

  const inputText = 'test';
  const inputElement = container.querySelector(
    '.auto-complete-input__input-box'
  );
  for (let i = 0; i < inputText.length; i += 1)
    fireEvent.change(inputElement, {
      target: { value: inputText.substring(i) },
    });
  expect(onInputChange).toHaveBeenCalledTimes(inputText.length);
});

test('call onSubmitInput on submit', () => {
  const onSubmitInput = jest.fn();
  const props = {
    suggestionList: [suggestionItem1, suggestionItem2],
    onSubmitInput,
  };
  const { container } = render(<AutoComplete {...props} />);

  const formElement = container.querySelector('.auto-complete-input__form');
  fireEvent.submit(formElement);
  expect(onSubmitInput).toHaveBeenCalledTimes(1);

  const iconElement = container.querySelector('.auto-complete-input__icon');
  fireEvent.click(iconElement);
  expect(onSubmitInput).toHaveBeenCalledTimes(2);
});

test('calls onSuggestionItemClick on suggestion items click', () => {
  const onSuggestionItemClick = jest.fn();
  const props = {
    suggestionList: [suggestionItem1, suggestionItem2],
    onSuggestionItemClick,
  };
  const { container } = render(<AutoComplete {...props} />);

  const firstItemElemenet = container.querySelector(
    '.auto-complete-suggestions__item'
  );
  fireEvent.click(firstItemElemenet);
  expect(onSuggestionItemClick).toHaveBeenCalledTimes(1);
});

test('builds html for suggestion items', () => {
  const { container } = render(
    <div>{getSuggestionItemHTML(suggestionItem1)}</div>
  );
  expect(
    container.querySelectorAll('.auto-complete-suggestions__highlight')
  ).toHaveLength(suggestionItem1.matchedPieceIndices.length);
});

test('clears input from outside', () => {
  function AutoCompleteWrapper() {
    const ref = useRef(null);
    return (
      <>
        <button type='button' onClick={() => ref.current.clearInput()}>
          Clear
        </button>
        <AutoComplete
          ref={ref}
          suggestionList={[suggestionItem1, suggestionItem2]}
        />
      </>
    );
  }
  const { container } = render(<AutoCompleteWrapper />);
  const inputElement = container.querySelector(
    '.auto-complete-input__input-box'
  );

  fireEvent.change(inputElement, { target: { value: 'test' } });
  expect(inputElement).toHaveValue('test');

  fireEvent.click(screen.getByText('Clear'));
  expect(inputElement).toHaveValue('');
});
