import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import AutoCompleteInput from './AutoCompleteInput';
import AutoCompleteSuggestions, {
  SuggestionItemType,
} from './AutoCompleteSuggestions';
import './AutoComplete.css';

/**  @typedef {import('./AutoCompleteSuggestions').SuggestionItem} SuggestionItem */

const AutoComplete = forwardRef(
  /**
   * @param {Object} props
   * @param {string} [props.inputIcon]
   * @param {string} [props.inputPlaceHolderText]
   * @param {string} [props.inputTitle]
   * @param {(input: string) => void} [props.onInputChange]
   * @param {(input: string) => void} [props.onSubmitInput]
   * @param {(suggestionItem: SuggestionItem) => void} [props.onSuggestionItemClick]
   * @param {SuggestionItem[]} [props.suggestionList]
   * @param {React.Ref<any>} inputRef
   */
  // eslint-disable-next-line prefer-arrow-callback
  function AutoComplete(props, inputRef) {
    const {
      inputIcon = 'search',
      inputPlaceHolderText = 'Search',
      inputTitle = 'Search Input',
      onInputChange,
      onSubmitInput,
      onSuggestionItemClick,
      suggestionList = [],
    } = props;

    const emptySuggestionsClassModifier =
      suggestionList.length === 0 ? 'auto-complete--empty-suggestion-list' : '';
    return (
      <div className={`auto-complete ${emptySuggestionsClassModifier}`}>
        <div className='auto-complete__input-wrapper'>
          <AutoCompleteInput
            icon={inputIcon}
            inputTitle={inputTitle}
            onInputChange={onInputChange}
            onSubmitInput={onSubmitInput}
            placeHolderText={inputPlaceHolderText}
            ref={inputRef}
          />
        </div>
        <AutoCompleteSuggestions
          onSuggestionItemClick={onSuggestionItemClick}
          suggestionList={suggestionList}
        />
      </div>
    );
  }
);

AutoComplete.propTypes = {
  inputPlaceHolderText: PropTypes.string,
  inputTitle: PropTypes.string,
  inputIcon: PropTypes.string,
  onInputChange: PropTypes.func,
  onSubmitInput: PropTypes.func,
  onSuggestionItemClick: PropTypes.func,
  suggestionList: PropTypes.arrayOf(PropTypes.exact(SuggestionItemType)),
};

export default AutoComplete;
