import React from 'react';
import PropTypes from 'prop-types';
import './DictionarySearchHistory.css';

class DictionarySearchHistory extends React.Component {
  handleClick = (keyword) => {
    this.props.onClickSearchHistoryItem(keyword);
  };

  handleClearHistory = () => {
    this.props.onClearSearchHistoryItems();
  };

  render() {
    if (
      this.props.searchHistoryItems &&
      this.props.searchHistoryItems.length > 0
    ) {
      return (
        <div className='dictionary-search-history'>
          <div className='dictionary-search-history__title'>
            <h4 className='dictionary-search-history__title-text'>
              Last Search
            </h4>
            <span
              className='dictionary-search-history__clear'
              onClick={this.handleClearHistory}
              onKeyPress={(e) => {
                if (e.charCode === 13 || e.charCode === 32) {
                  e.preventDefault();
                  this.handleClearHistory();
                }
              }}
              role='button'
              tabIndex={0}
            >
              Clear History
            </span>
          </div>
          <div>
            {this.props.searchHistoryItems &&
              this.props.searchHistoryItems.map((item) => {
                const zeroCountModifier =
                  item.matchedCount === 0
                    ? 'dictionary-search-history__item-badge--zero'
                    : '';
                return (
                  <div
                    className='dictionary-search-history__item'
                    key={item.keywordStr}
                    onClick={() => this.handleClick(item.keywordStr)}
                    onKeyPress={(e) => {
                      if (e.charCode === 13 || e.charCode === 32) {
                        e.preventDefault();
                        this.handleClick(item.keywordStr);
                      }
                    }}
                    role='button'
                    tabIndex={0}
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
      );
    }
    return null;
  }
}

const SearchHistoryItemShape = PropTypes.shape({
  keywordStr: PropTypes.string,
  matchedCount: PropTypes.number,
});

DictionarySearchHistory.propTypes = {
  searchHistoryItems: PropTypes.arrayOf(SearchHistoryItemShape),
  onClickSearchHistoryItem: PropTypes.func,
  onClearSearchHistoryItems: PropTypes.func,
};

DictionarySearchHistory.defaultProps = {
  searchHistoryItems: [],
  onClickSearchHistoryItem: () => {},
  onClearSearchHistoryItems: () => {},
};

export default DictionarySearchHistory;
