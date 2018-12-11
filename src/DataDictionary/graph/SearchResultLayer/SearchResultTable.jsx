import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { downloadTemplate, getPropertyDescription, getType } from '../../utils';
import './SearchResultTable.css';

class SearchResultTable extends React.Component {
  escapeString = (str) => {
    // TODO
  };

  addHighlightingSpans = (str, indices) => {
    let cursor = 0;
    let currentIndices = 0;
    const resultFragments = [];
    while (currentIndices < indices.length) {
      if (cursor < indices[currentIndices][0]) {
        resultFragments.push(
          (<span>{str.substring(cursor, indices[currentIndices][0])}</span>),
        );
      }
      resultFragments.push(
        (
          <span className='search-result-table__highlight'>
            {str.substring(indices[currentIndices][0], indices[currentIndices][1] + 1)}
          </span>
        ),
      );
      cursor = indices[currentIndices][1] + 1;
      currentIndices += 1;
    }
    if (cursor < str.length) {
      resultFragments.push(
        (<span>{str.substring(cursor)}</span>),
      );
    }
    return resultFragments;
  };

  getPropertyNameFragment = (propertyName, index) => {
    let propertyNameFragment;
    const matchedItem = this.isPropertyNameOrDescriptionMatched(index, true);
    if (matchedItem) {
      propertyNameFragment = this.addHighlightingSpans(propertyName, matchedItem.indices);
    } else {
      propertyNameFragment = (<span>{propertyName}</span>);
    }
    return propertyNameFragment;
  };

  getPropertyTypeFragment = (property) => {
    const matchedItem = this.isPropertyTypeMatched(property);
    const type = getType(property);
    let propertyTypeFragment;
    if (matchedItem) {
      if (typeof type === 'string') {
        propertyTypeFragment = (
          <li>
            {this.addHighlightingSpans(type, matchedItem.value)}
          </li>
        );
      } else {
        propertyTypeFragment = type.map((t) => {
          if (t === matchedItem.value) {
            return (
              <li>
                {this.addHighlightingSpans(t, matchedItem.indices)}
              </li>
            );
          }
          return (
            <li>{t}</li>
          );
        });
      }
    } else if (typeof type === 'string') {
      propertyTypeFragment = (<li>{type}</li>);
    } else {
      propertyTypeFragment = type.map(t => (<li>{t}</li>));
    }
    return propertyTypeFragment;
  };

  getPropertyDescriptionFragment = (property, index) => {
    const matchedItem = this.isPropertyNameOrDescriptionMatched(index, false);
    let descriptionStr = getPropertyDescription(property);
    if (!descriptionStr) descriptionStr = 'No Description';
    let propertyDescriptionFragment;
    if (matchedItem) {
      propertyDescriptionFragment = this.addHighlightingSpans(descriptionStr, matchedItem.indices);
    } else {
      propertyDescriptionFragment = (<span>{descriptionStr}</span>);
    }
    return propertyDescriptionFragment;
  };

  isPropertyNameOrDescriptionMatched = (propertyIndex, nameOrDescription) => {
    const matchedKey = nameOrDescription ? 'properties.name' : 'properties.description';
    const matchedItem = this.props.matchResult.matches
      .find(item => item.key === matchedKey && item.arrayIndex === propertyIndex);
    return matchedItem;
  };

  isPropertyTypeMatched = (property) => {
    const matchedItem = this.props.matchResult.matches
      .filter(item => item.key === 'properties.type')
      .find((item) => {
        const type = getType(property);
        if (typeof type === 'string') return type === item.value;
        return type.includes(item.value);
      });
    return matchedItem;
  };

  getNodeDescriptionFragment = () => {
    const matchedItem = this.props.matchResult.matches.find(item => item.key === 'description');
    if (matchedItem) {
      return this.addHighlightingSpans(this.props.node.description, matchedItem.indices);
    }

    return (<span>{this.props.node.description}</span>);
  };

  handleCloseNode = () => {
    this.props.onCloseNode();
  };

  handleOpenNode = () => {
    this.props.onOpenNode();
  };

  render() {
    if (!this.props.nodeSVGElement || !this.props.node) return null;
    const svgBoundingBox = this.props.nodeSVGElement
      && this.props.nodeSVGElement.getBoundingClientRect
      ? this.props.nodeSVGElement.getBoundingClientRect()
      : { top: 0, left: 0, width: 0, bottom: 0 };
    const popupLeft = (svgBoundingBox.left - this.props.canvasBoundingRect.left);
    const popupTop = svgBoundingBox.bottom - this.props.canvasBoundingRect.top;
    const nodeDescriptionFragment = this.getNodeDescriptionFragment();
    let propertyMatchCount = 0;
    Object.keys(this.props.node.properties).forEach((propertyKey, i) => {
      const property = this.props.node.properties[propertyKey];
      if (this.isPropertyNameOrDescriptionMatched(i, true)
        || this.isPropertyNameOrDescriptionMatched(i, false)
        || this.isPropertyTypeMatched(property)) {
        propertyMatchCount += 1;
      }
    });
    return (
      <div
        className='search-result-table'
        style={{
          top: popupTop,
          left: popupLeft,
        }}
      >
        <div
          className='search-result-table__close'
          role='button'
          onClick={this.handleCloseNode}
          onKeyPress={this.handleCloseNode}
          tabIndex={0}
        >
          <span className='search-result-table__close-text'>Close</span>
          <i className='g3-icon g3-icon--cross search-result-table__close-icon' />
        </div>
        <div className='search-result-table__header'>
          <div className='search-result-table__action-group'>
            <Button
              className='search-result-table__button search-result-table__button--open'
              onClick={this.handleOpenNode}
              label='Open Node'
              buttonType='secondary'
            />
            <div className='search-result-table__button-wrapper'>
              <Button
                className='search-result-table__button search-result-table__button--download'
                onClick={() => { downloadTemplate('tsv', this.props.node.id); }}
                label='TSV'
                buttonType='secondary'
                rightIcon='download'
              />
            </div>
            <div className='search-result-table__button-wrapper'>
              <Button
                className='search-result-table__button search-result-table__button--download'
                onClick={() => { downloadTemplate('json', this.props.node.id); }}
                label='JSON'
                buttonType='secondary'
                rightIcon='download'
              />
            </div>
          </div>
          <div className='search-result-table__description'>
            {nodeDescriptionFragment}
          </div>
        </div>
        {
          propertyMatchCount > 0 && (
            <table className='search-result-table__property'>
              <tr className='search-result-table__property-row search-result-table__property-row--head'>
                <th className='search-result-table__property-cell'>Property</th>
                <th className='search-result-table__property-cell'>Type</th>
                <th className='search-result-table__property-cell'>Description</th>
                <th className='search-result-table__property-cell'>Terms</th>
              </tr>
              {
                Object.keys(this.props.node.properties).map((propertyKey, i) => {
                  const property = this.props.node.properties[propertyKey];
                  if (this.isPropertyNameOrDescriptionMatched(i, true)
                    || this.isPropertyNameOrDescriptionMatched(i, false)
                    || this.isPropertyTypeMatched(property)) {
                    const propertyNameFragment = this.getPropertyNameFragment(propertyKey, i);
                    const propertyTypeFragment = this.getPropertyTypeFragment(property, i);
                    const propertyDescriptionFragment = this.getPropertyDescriptionFragment(
                      property,
                      i,
                    );
                    return (
                      <tr className='search-result-table__property-row'>
                        <td className='search-result-table__property-cell search-result-table__property-cell--name'>
                          {propertyNameFragment}
                        </td>
                        <td className='search-result-table__property-cell search-result-table__property-cell--type'>
                          {propertyTypeFragment}
                        </td>
                        <td className='search-result-table__property-cell search-result-table__property-cell--description'>
                          {propertyDescriptionFragment}
                        </td>
                        <td className='search-result-table__property-cell search-result-table__property-cell--term' />
                      </tr>
                    );
                  }

                  return null;
                })
              }
            </table>
          )
        }
      </div>
    );
  }
}

const MatchedItemShape = PropTypes.shape({
  indices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  arrayIndex: PropTypes.number,
  key: PropTypes.string,
  value: PropTypes.string,
});

const SearchItemPropertyShape = PropTypes.shape({
  name: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOf(PropTypes.arrayOf(PropTypes.string), PropTypes.string),
});

const SearchItemShape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  properties: PropTypes.arrayOf(SearchItemPropertyShape),
});

SearchResultTable.propTypes = {
  node: PropTypes.object,
  nodeSVGElement: PropTypes.object,
  canvasBoundingRect: PropTypes.object,
  matchResult: PropTypes.shape({
    matches: PropTypes.arrayOf(MatchedItemShape),
    item: SearchItemShape,
  }),
  onOpenNode: PropTypes.func,
  onCloseNode: PropTypes.func,
};

SearchResultTable.defaultProps = {
  node: null,
  nodeSVGElement: null,
  canvasBoundingRect: { top: 0, left: 0 },
  matchResult: [],
  onOpenNode: () => {},
  onCloseNode: () => {},
};

export default SearchResultTable;
