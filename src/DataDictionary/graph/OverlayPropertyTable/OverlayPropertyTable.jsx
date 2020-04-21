import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { downloadTemplate, SearchResultItemShape } from '../../utils';
import { getCategoryIconSVG } from '../../NodeCategories/helper';
import {
  getNodeDescriptionFragment,
  getNodeTitleFragment,
} from '../../highlightHelper';
import DataDictionaryPropertyTable from '../../table/DataDictionaryPropertyTable/.';
import './OverlayPropertyTable.css';

class OverlayPropertyTable extends React.Component {
  getTitle = () => {
    if (this.props.isSearchMode) {
      const nodeTitleFragment = getNodeTitleFragment(
        this.props.matchedResult.matches,
        this.props.node.title,
        'overlay-property-table__span',
      );
      return nodeTitleFragment;
    }

    return this.props.node.title;
  };

  getDescription = () => {
    if (this.props.isSearchMode) {
      const nodeDescriptionFragment = getNodeDescriptionFragment(
        this.props.matchedResult.matches,
        this.props.node.description,
        'overlay-property-table__span',
      );
      return nodeDescriptionFragment;
    }

    return this.props.node.description;
  };

  /**
   * Close the whole overlay property table
   */
  handleClose = () => {
    this.props.onCloseOverlayPropertyTable();
  };

  /**
   * Toggle the property tabl to display all properties
   */
  handleOpenAllProperties = () => {
    this.props.onOpenMatchedProperties();
  };

  /**
   * Toggle the property table to display matched properties only
   */
  handleDisplayOnlyMatchedProperties = () => {
    this.props.onCloseMatchedProperties();
  };

  render() {
    if (!this.props.node || this.props.hidden) return (<React.Fragment />);
    const IconSVG = getCategoryIconSVG(this.props.node.category);
    const searchedNodeNotOpened = this.props.isSearchMode && !this.props.isSearchResultNodeOpened;
    const needHighlightSearchResult = this.props.isSearchMode;
    return (
      <div className='overlay-property-table'>
        <div className='overlay-property-table__background' />
        <div className='overlay-property-table__fixed-container'>
          <div className='overlay-property-table__content'>
            <div className='overlay-property-table__header'>
              <div className='overlay-property-table__category'>
                <IconSVG className='overlay-property-table__category-icon' />
                <h4 className='overlay-property-table__category-text'>{this.props.node.category}</h4>
                {
                  this.props.isSearchMode && (
                    <Button
                      className='overlay-property-table__toggle-node'
                      onClick={searchedNodeNotOpened
                        ? this.handleOpenAllProperties : this.handleDisplayOnlyMatchedProperties}
                      label={searchedNodeNotOpened ? 'See All' : 'See Only Matched'}
                      buttonType='secondary'
                    />
                  )
                }
                <span
                  className='overlay-property-table__close'
                  onClick={this.handleClose}
                  onKeyPress={this.handleClose}
                  role='button'
                  tabIndex={0}
                >
                  Close
                  <i className='overlay-property-table__close-icon g3-icon g3-icon--cross g3-icon--sm' />
                </span>
                <Button
                  className='overlay-property-table__download-button'
                  onClick={() => { downloadTemplate('tsv', this.props.node.id); }}
                  label='TSV'
                  buttonType='secondary'
                  rightIcon='download'
                />
                <Button
                  className='overlay-property-table__download-button'
                  onClick={() => { downloadTemplate('json', this.props.node.id); }}
                  label='JSON'
                  buttonType='secondary'
                  rightIcon='download'
                />
              </div>
              <div className='overlay-property-table__node'>
                <h3 className='overlay-property-table__node-title'>
                  {this.getTitle()}
                </h3>
                <div className='overlay-property-table__node-description introduction'>
                  {this.getDescription()}
                </div>
              </div>
            </div>
            <div className='overlay-property-table__property'>
              <DataDictionaryPropertyTable
                properties={this.props.node.properties}
                requiredProperties={this.props.node.required}
                hasBorder={false}
                onlyShowMatchedProperties={searchedNodeNotOpened}
                needHighlightSearchResult={needHighlightSearchResult}
                hideIsRequired={searchedNodeNotOpened}
                matchedResult={this.props.matchedResult}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OverlayPropertyTable.propTypes = {
  hidden: PropTypes.bool,
  node: PropTypes.object,
  onCloseOverlayPropertyTable: PropTypes.func,
  isSearchMode: PropTypes.bool,
  matchedResult: SearchResultItemShape,
  onOpenMatchedProperties: PropTypes.func,
  onCloseMatchedProperties: PropTypes.func,
  isSearchResultNodeOpened: PropTypes.bool,
};

OverlayPropertyTable.defaultProps = {
  hidden: true,
  node: null,
  onCloseOverlayPropertyTable: () => {},
  isSearchMode: false,
  matchedResult: {},
  onOpenMatchedProperties: () => {},
  onCloseMatchedProperties: () => {},
  isSearchResultNodeOpened: false,
};

export default OverlayPropertyTable;
