import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { downloadTemplate, SearchResultItemShape } from '../../utils';
import {
  getMatchesSummaryForProperties,
  getNodeDescriptionFragment,
  getPropertyNameFragment,
  getPropertyDescriptionFragment,
  getPropertyTypeFragment,
} from './highlightHelper';
import './SearchResultTable.css';

class SearchResultTable extends React.Component {
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
    const nodeDescriptionFragment = getNodeDescriptionFragment(
      this.props.matchResult.matches,
      this.props.node.description,
    );
    const matchedPropertiesSummary = getMatchesSummaryForProperties(
      this.props.node.properties,
      this.props.matchResult.matches,
    );

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
          matchedPropertiesSummary.length > 0 && (
            <table className='search-result-table__property'>
              <tbody>
                <tr className='search-result-table__property-row search-result-table__property-row--head'>
                  <th className='search-result-table__property-cell'>Property</th>
                  <th className='search-result-table__property-cell'>Type</th>
                  <th className='search-result-table__property-cell'>Description</th>
                  <th className='search-result-table__property-cell'>Terms</th>
                </tr>
                {
                  matchedPropertiesSummary.map((matchedSummaryItem) => {
                    const {
                      propertyKey,
                      property,
                      nameMatch,
                      descriptionMatch,
                      typeMatch,
                    } = matchedSummaryItem;
                    const propertyNameFragment = getPropertyNameFragment(
                      propertyKey,
                      nameMatch,
                    );
                    const propertyTypeFragment = getPropertyTypeFragment(
                      property,
                      typeMatch,
                    );
                    const propertyDescriptionFragment = getPropertyDescriptionFragment(
                      property,
                      descriptionMatch,
                    );
                    return (
                      <tr key={propertyKey} className='search-result-table__property-row'>
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
                  })
                }
              </tbody>
            </table>
          )
        }
      </div>
    );
  }
}

SearchResultTable.propTypes = {
  node: PropTypes.object,
  nodeSVGElement: PropTypes.object,
  canvasBoundingRect: PropTypes.object,
  matchResult: SearchResultItemShape,
  onOpenNode: PropTypes.func,
  onCloseNode: PropTypes.func,
};

SearchResultTable.defaultProps = {
  node: null,
  nodeSVGElement: null,
  canvasBoundingRect: { top: 0, left: 0 },
  matchResult: {},
  onOpenNode: () => {},
  onCloseNode: () => {},
};

export default SearchResultTable;
