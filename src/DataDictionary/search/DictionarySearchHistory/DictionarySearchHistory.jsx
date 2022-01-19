import PropTypes from 'prop-types';
import './DictionarySearchHistory.css';

/**
 * @param {Object} props
 * @param {() => void} props.onClearSearchHistoryItems
 * @param {(keyword: string) => void} props.onClickSearchHistoryItem
 * @param {import('../../types').SearchHistoryItem[]} props.searchHistoryItems
 */
function DictionarySearchHistory({
  onClearSearchHistoryItems,
  onClickSearchHistoryItem,
  searchHistoryItems = [],
}) {
  return searchHistoryItems.length > 0 ? (
    <div className='dictionary-search-history'>
      <div className='dictionary-search-history__title'>
        <h4 className='dictionary-search-history__title-text'>Last Search</h4>
        <span
          className='dictionary-search-history__clear'
          onClick={onClearSearchHistoryItems}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              onClearSearchHistoryItems?.();
            }
          }}
          role='button'
          tabIndex={0}
          aria-label='Clear history'
        >
          Clear History
        </span>
      </div>
      <div>
        {searchHistoryItems.map((item) => {
          const zeroCountModifier =
            item.matchedCount === 0
              ? 'dictionary-search-history__item-badge--zero'
              : '';
          return (
            <div
              className='dictionary-search-history__item'
              key={item.keywordStr}
              onClick={() => onClickSearchHistoryItem?.(item.keywordStr)}
              onKeyPress={(e) => {
                if (e.charCode === 13 || e.charCode === 32) {
                  e.preventDefault();
                  onClickSearchHistoryItem?.(item.keywordStr);
                }
              }}
              role='button'
              tabIndex={0}
              aria-label='Search history item'
            >
              <span className='dictionary-search-history__item-keyword'>
                {item.keywordStr}
              </span>
              <span
                className={`dictionary-search-history__item-badge ${zeroCountModifier}`}
              >
                {item.matchedCount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
}

DictionarySearchHistory.propTypes = {
  onClearSearchHistoryItems: PropTypes.func,
  onClickSearchHistoryItem: PropTypes.func,
  searchHistoryItems: PropTypes.arrayOf(
    PropTypes.exact({
      keywordStr: PropTypes.string,
      matchedCount: PropTypes.number,
    })
  ),
};

export default DictionarySearchHistory;
