import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import AutoComplete from '@gen3/ui-component/dist/components/AutoComplete';
import Fuse from 'fuse.js';
import {
  parseDictionaryNodes,
  getPropertyDescription,
  getType,
} from '../../utils';
import './DictionarySearcher.css';

class DictionarySearcher extends React.Component {
  constructor(props) {
    super(props);
    this.searchHandler = this.prepareSearch(props.dictionary);
    this.autoCompleteRef = React.createRef();
    this.state = {
      suggestionList: [],
      searched: false,
      searchResult: {
        matchedNodes: [],
        summary: {},
      },
    };
  }

  onClearResult = () => {
    this.resetSearchResult();
    this.autoCompleteRef.current.clearInput();
  }

  getSearchSummary = (result) => {
    let matchedPropertiesCount = 0;
    let matchedNodesCount = 0;
    result.forEach((resItem) => {
      resItem.matches.forEach((matchedItem) => {
        switch (matchedItem.key) {
        case 'properties.type':
        case 'properties.name':
        case 'properties.description':
          matchedPropertiesCount += 1;
          break;
        case 'id':
        case 'description':
          matchedNodesCount += 1;
          break;
        default:
          break;
        }
      });
    });
    return {
      matchedPropertiesCount,
      matchedNodesCount,
    };
  }

  prepareSearch = (dictionary) => {
    const options = {
      keys: ['id', 'description', 'properties.name', 'properties.description', 'properties.type'],
      includeMatches: true,
      threshold: 0.3,
      shouldSort: true,
      includeScore: true,
      minMatchCharLength: 2,
    };
    const searchData = parseDictionaryNodes(dictionary)
      .map((node) => {
        const properties = Object.keys(node.properties).map((propertyKey) => {
          let type = getType(node.properties[propertyKey]);
          if (type === 'UNDEFINED') type = undefined;
          return {
            name: propertyKey,
            description: getPropertyDescription(node.properties[propertyKey]),
            type,
          };
        });
        return {
          id: node.id,
          title: node.title,
          description: node.description,
          properties,
        };
      });
    return new Fuse(searchData, options);
  }

  launchSearchFromOutside = (keyword) => {
    this.autoCompleteRef.current.setInputText(keyword);
    this.search(keyword);
  }

  search = (str) => {
    this.props.setIsSearching(true);
    const result = this.searchHandler.search(str).filter(resItem => resItem.matches.length > 0);
    this.props.setIsSearching(false);
    this.props.onSearchResultUpdated(result);
    const summary = this.getSearchSummary(result);
    this.setState({
      searched: true,
      searchResult: {
        matchedNodes: result,
        summary,
      },
      suggestionList: [],
    });
    this.props.onSearchHistoryItemCreated({
      keywordStr: str,
      matchedCount: summary.matchedNodesCount,
    });
  }

  resetSearchResult = () => {
    this.setState({
      searched: false,
      searchResult: {
        matchedNodes: [],
        summary: {},
      },
    });
    this.props.onSearchResultCleared();
  }

  inputChangeFunc = (inputText) => {
    this.resetSearchResult();
    const result = this.searchHandler.search(inputText);
    const matchedStrings = {};
    result.forEach((resItem) => {
      resItem.matches.forEach((matchItem) => {
        if (!matchedStrings[matchItem.value]) {
          matchedStrings[matchItem.value] = {
            matchedPieceIndices: matchItem.indices.map(arr => ([arr[0], arr[1] + 1])),
          };
        }
      });
    });
    const suggestionList = Object.keys(matchedStrings)
      .sort()
      .map(str => ({
        fullString: str,
        matchedPieceIndices: matchedStrings[str].matchedPieceIndices,
      }));
    this.setState({
      suggestionList,
    });
  };

  suggestionItemClickFunc = (suggestionItem) => {
    this.search(suggestionItem.fullString);
  };

  submitInputFunc = (inputText) => {
    this.search(inputText);
  };

  render() {
    return (
      <div className='data-dictionary-searcher'>
        <AutoComplete
          ref={this.autoCompleteRef}
          suggestionList={this.state.suggestionList}
          inputPlaceHolderText='Search in Dictionary'
          onSuggestionItemClick={this.suggestionItemClickFunc}
          onInputChange={this.inputChangeFunc}
          onSubmitInput={this.submitInputFunc}
        />
        {
          this.state.searched && this.state.searchResult.matchedNodes.length > 0 ? (
            <React.Fragment>
              <div className='dictionary-searcher__result'>
                <h4 className='dictionary-searcher__result-text'>Search Results</h4>
                <span
                  className='dictionary-searcher__result-clear body'
                  onClick={this.onClearResult}
                  role='button'
                  tabIndex={0}
                  onKeyPress={this.onClearResult}
                >Clear Result</span>
              </div>
              <li className='dictionary-searcher__result-item body'>
                <span className='dictionary-searcher__result-count'>
                  {this.state.searchResult.summary.matchedNodesCount}
                </span> matched Nodes
              </li>
              <li className='dictionary-searcher__result-item body'>
                <span className='dictionary-searcher__result-count'>
                  {this.state.searchResult.summary.matchedPropertiesCount}
                </span> matches in Properties
              </li>
              {
                this.props.isGraphView && (
                  <Button
                    label={'Extend All Results'}
                    buttonType='default'
                    rightIcon={'eye'}
                  />
                )
              }
            </React.Fragment>
          ) : (
            this.state.searched && (
              <p>0 result found. Please try another keyword.</p>
            )
          )
        }
      </div>
    );
  }
}

DictionarySearcher.propTypes = {
  dictionary: PropTypes.object.isRequired,
  setIsSearching: PropTypes.func,
  onSearchResultUpdated: PropTypes.func,
  isGraphView: PropTypes.bool,
  onSearchHistoryItemCreated: PropTypes.func,
  onSearchResultCleared: PropTypes.func,
};

DictionarySearcher.defaultProps = {
  setIsSearching: () => {},
  onSearchResultUpdated: () => {},
  isGraphView: true,
  onSearchHistoryItemCreated: () => {},
  onSearchResultCleared: () => {},
};

export default DictionarySearcher;
