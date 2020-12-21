import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AutoComplete from '../src/components/AutoComplete';
import Button from '../src/components/Button';

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

const clearInputFunc = (ref) => {
  ref.current.clearInput();
};

const setInputFunc = (ref) => {
  ref.current.setInputText('some new content');
}

storiesOf('AutoComplete', module)
  .add('autocomplete', () => {
    const autoCompleteRef = React.createRef();
    return (
      <div>
        <AutoComplete
          ref={autoCompleteRef}
          suggestionList={suggestionList}
          inputPlaceHolderText='Search in Dictionary'
          onSuggestionItemClick={action('click suggestion item')}
          onInputChange={action('input change')}
          onSubmitInput={action('submit input')}
        />
        <Button
          label='call clearInput from outside'
          onClick={() => clearInputFunc(autoCompleteRef)}
        />
        <Button
          label='call setInputText from outside'
          onClick={() => setInputFunc(autoCompleteRef)}
        />
      </div>
    );
  });
