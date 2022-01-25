import PropTypes from 'prop-types';
import './AutoCompleteSuggestions.css';

/**
 * @typedef {Object} SuggestionItem
 * @property {string} fullString
 * @property {number[][]} matchedPieceIndices
 */

/**
 * Wrap suggestion item into HTML, take following as an e.g.:
 *   suggestionsItem={
 *     fullString: 'abcdea',
 *     matchedPieceIndices: [
 *       [0, 1],
 *       [5, 6]
 *     ];
 *   };
 * Return HTML should be:
 *     <span className='auto-complete-suggestions__highlight'>
 *       a
 *     </span>
 *     <span>bcde</span>
 *     <span className='auto-complete-suggestions__highlight'>
 *       a
 *     </span>
 * @param {SuggestionItem} suggestionItem
 */
export function getSuggestionItemHTML({ fullString, matchedPieceIndices }) {
  let cursor = 0;
  let currentHighlighPieceIndex = 0;
  const resultHTMLSnippits = [];
  while (currentHighlighPieceIndex < matchedPieceIndices.length) {
    const highlightStartPos = matchedPieceIndices[currentHighlighPieceIndex][0];
    const highlightEndPos = matchedPieceIndices[currentHighlighPieceIndex][1];
    if (cursor < highlightStartPos) {
      resultHTMLSnippits.push(
        <span key={cursor}>
          {fullString.substring(cursor, highlightStartPos)}
        </span>
      );
    }
    resultHTMLSnippits.push(
      <span
        key={highlightStartPos}
        className='auto-complete-suggestions__highlight'
      >
        {fullString.substring(highlightStartPos, highlightEndPos)}
      </span>
    );
    cursor = highlightEndPos;
    currentHighlighPieceIndex += 1;
  }
  if (cursor < fullString.length) {
    resultHTMLSnippits.push(
      <span key={cursor}>{fullString.substring(cursor)}</span>
    );
  }
  return resultHTMLSnippits;
}

/**
 * @param {Object} props
 * @param {SuggestionItem[]} props.suggestionList
 * @param {(suggestionItem: SuggestionItem, i: number) => void} props.onSuggestionItemClick
 */
function AutoCompleteSuggestions({
  suggestionList = [],
  onSuggestionItemClick,
}) {
  return (
    <div>
      {suggestionList.map((suggestionItem, i) => (
        <div
          key={`${i}-${suggestionItem.fullString}`}
          className='auto-complete-suggestions__item body'
          onClick={() => onSuggestionItemClick?.(suggestionItem, i)}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              onSuggestionItemClick?.(suggestionItem, i);
            }
          }}
          role='button'
          tabIndex={0}
          aria-label={suggestionItem.fullString}
        >
          {getSuggestionItemHTML(suggestionItem)}
        </div>
      ))}
    </div>
  );
}

export const SuggestionItemType = {
  fullString: PropTypes.string.isRequired,
  matchedPieceIndices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    .isRequired,
};

AutoCompleteSuggestions.propTypes = {
  suggestionList: PropTypes.arrayOf(PropTypes.shape(SuggestionItemType)),
  onSuggestionItemClick: PropTypes.func,
};

export default AutoCompleteSuggestions;
