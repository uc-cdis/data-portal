import PropTypes from 'prop-types';
import Button from '../../../gen3-ui-component/components/Button';
import { downloadTemplate, SearchResultItemShape } from '../../utils';
import { getCategoryIconSVG } from '../../NodeCategories/helper';
import {
  getNodeDescriptionFragment,
  getNodeTitleFragment,
} from '../../highlightHelper';
import DataDictionaryPropertyTable from '../../table/DataDictionaryPropertyTable';
import './OverlayPropertyTable.css';

/**
 * @param {Object} props
 * @param {boolean} [props.hidden]
 * @param {boolean} [props.isSearchMode]
 * @param {boolean} [props.isSearchResultNodeOpened]
 * @param {import('../../types').MatchedResult} [props.matchedResult]
 * @param {Object} [props.node]
 * @param {() => void} [props.onCloseMatchedProperties] Toggle the property table to display matched properties only
 * @param {() => void} [props.onCloseOverlayPropertyTable] Close the whole overlay property table
 * @param {() => void} [props.onOpenMatchedProperties] Toggle the property tabl to display all properties
 */
function OverlayPropertyTable({
  hidden = true,
  isSearchMode = false,
  isSearchResultNodeOpened = false,
  matchedResult,
  node = null,
  onCloseMatchedProperties,
  onCloseOverlayPropertyTable,
  onOpenMatchedProperties,
}) {
  if (!node || hidden) return null;

  const IconSVG = getCategoryIconSVG(node.category);
  const searchedNodeNotOpened = isSearchMode && !isSearchResultNodeOpened;

  return (
    <div className='overlay-property-table'>
      <div className='overlay-property-table__background' />
      <div className='overlay-property-table__fixed-container'>
        <div className='overlay-property-table__content'>
          <div className='overlay-property-table__header'>
            <div className='overlay-property-table__category'>
              <IconSVG className='overlay-property-table__category-icon' />
              <h4 className='overlay-property-table__category-text'>
                {node.category}
              </h4>
              {isSearchMode && (
                <Button
                  className='overlay-property-table__toggle-node'
                  onClick={
                    searchedNodeNotOpened
                      ? onOpenMatchedProperties
                      : onCloseMatchedProperties
                  }
                  label={searchedNodeNotOpened ? 'See All' : 'See Only Matched'}
                  buttonType='secondary'
                />
              )}
              <div className='overlay-property-table__category-button-group'>
                <Button
                  className='overlay-property-table__download-button'
                  onClick={() => {
                    downloadTemplate('json', node.id);
                  }}
                  label='JSON'
                  buttonType='secondary'
                  rightIcon='download'
                />
                <Button
                  className='overlay-property-table__download-button'
                  onClick={() => {
                    downloadTemplate('tsv', node.id);
                  }}
                  label='TSV'
                  buttonType='secondary'
                  rightIcon='download'
                />
                <span
                  className='overlay-property-table__close'
                  onClick={onCloseOverlayPropertyTable}
                  onKeyPress={(e) => {
                    if (e.charCode === 13 || e.charCode === 32) {
                      e.preventDefault();
                      onCloseOverlayPropertyTable?.();
                    }
                  }}
                  role='button'
                  tabIndex={0}
                  aria-label='Close property table'
                >
                  Close
                  <i className='overlay-property-table__close-icon g3-icon g3-icon--cross g3-icon--sm' />
                </span>
              </div>
            </div>
            <div className='overlay-property-table__node'>
              <h3 className='overlay-property-table__node-title'>
                {isSearchMode
                  ? getNodeTitleFragment(
                      matchedResult.matches,
                      node.title,
                      'overlay-property-table__span'
                    )
                  : node.title}
              </h3>
              <div className='overlay-property-table__node-description introduction'>
                {isSearchMode
                  ? getNodeDescriptionFragment(
                      matchedResult.matches,
                      node.description,
                      'overlay-property-table__span'
                    )
                  : node.description}
              </div>
            </div>
          </div>
          <div className='overlay-property-table__property'>
            <DataDictionaryPropertyTable
              properties={node.properties}
              requiredProperties={node.required}
              hasBorder={false}
              onlyShowMatchedProperties={searchedNodeNotOpened}
              needHighlightSearchResult={isSearchMode}
              hideIsRequired={searchedNodeNotOpened}
              matchedResult={matchedResult}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

OverlayPropertyTable.propTypes = {
  hidden: PropTypes.bool,
  isSearchMode: PropTypes.bool,
  isSearchResultNodeOpened: PropTypes.bool,
  matchedResult: SearchResultItemShape,
  node: PropTypes.any,
  onCloseMatchedProperties: PropTypes.func,
  onCloseOverlayPropertyTable: PropTypes.func,
  onOpenMatchedProperties: PropTypes.func,
};

export default OverlayPropertyTable;
