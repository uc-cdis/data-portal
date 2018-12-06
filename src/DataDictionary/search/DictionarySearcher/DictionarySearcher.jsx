import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import AutoComplete from '@gen3/ui-component/dist/components/AutoComplete';
import Fuse from 'fuse.js';
import { parseDictionaryNodes, getPropertyDescription, getType } from '../../utils';
import './DictionarySearcher.css';

class DataDictionarySearcher extends React.Component {
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
    let matchedTypesCount = 0;
    let matchedDescriptionsCount = 0;
    result.forEach((resItem) => {
      resItem.matches.forEach((matchedItem) => {
        switch (matchedItem.key) {
        case 'properties.type':
          matchedTypesCount += 1;
          break;
        case 'properties.name':
          matchedPropertiesCount += 1;
          break;
        case 'properties.description':
          matchedDescriptionsCount += 1;
          break;
        default:
          break;
        }
      });
    });
    return {
      matchedPropertiesCount,
      matchedTypesCount,
      matchedDescriptionsCount,
    };
  }

  prepareSearch = (dictionary) => {
    const options = {
      keys: ['description', 'properties.name', 'properties.description', 'properties.type'],
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

  search = (str) => {
    this.props.setIsSearching(true);
    const result = this.searchHandler.search(str).filter(resItem => resItem.matches.length > 0);
    this.props.setIsSearching(false);
    this.props.onSearchResultUpdated(result);
    this.setState({
      searched: true,
      searchResult: {
        matchedNodes: result,
        summary: this.getSearchSummary(result),
      },
      suggestionList: [],
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
    this.props.onSearchResultUpdated([]);
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
                  {this.state.searchResult.summary.matchedPropertiesCount}
                </span> matches in Properties
              </li>
              <li className='dictionary-searcher__result-item body'>
                <span className='dictionary-searcher__result-count'>
                  {this.state.searchResult.summary.matchedTypesCount}
                </span> matches in Types
              </li>
              <li className='dictionary-searcher__result-item body'>
                <span className='dictionary-searcher__result-count'>
                  {this.state.searchResult.summary.matchedDescriptionsCount}
                </span> matches in Descriptions
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

DataDictionarySearcher.propTypes = {
  dictionary: PropTypes.object.isRequired,
  setIsSearching: PropTypes.func,
  onSearchResultUpdated: PropTypes.func,
  isGraphView: PropTypes.bool,
};

DataDictionarySearcher.defaultProps = {
  setIsSearching: () => {},
  onSearchResultUpdated: () => {},
  isGraphView: true,
};

export default DataDictionarySearcher;
