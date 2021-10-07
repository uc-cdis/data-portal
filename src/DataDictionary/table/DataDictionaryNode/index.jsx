import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../gen3-ui-component/components/Button';
import { downloadTemplate } from '../../utils';
import { getCategoryColor } from '../../NodeCategories/helper';
import DataDictionaryPropertyTable from '../DataDictionaryPropertyTable';
import './DataDictionaryNode.css';

/**
 * @typedef {Object} DataDictionaryNodeProps
 * @property {string} [description]
 * @property {boolean} [expanded]
 * @property {Object} node
 * @property {(id: string) => void} [onExpandNode]
 */

/** @param {DataDictionaryNodeProps} props */
function DataDictionaryNode({
  description = '',
  expanded = false,
  node,
  onExpandNode,
}) {
  function handleClickNode() {
    onExpandNode?.(expanded ? null : node.id);
  }

  function handleCloseNode() {
    onExpandNode?.(null);
  }

  function handleDownloadTemplate(e, format) {
    e.stopPropagation(); // no toggling
    downloadTemplate(format, node.id);
  }

  return (
    <>
      <div
        className='data-dictionary-node'
        style={{
          borderLeftColor: getCategoryColor(node.category),
        }}
        onClick={handleClickNode}
        onKeyPress={(e) => {
          if (e.charCode === 13 || e.charCode === 32) {
            e.preventDefault();
            handleClickNode();
          }
        }}
        role='button'
        tabIndex={0}
        aria-label='Dictionary node'
      >
        <span className='data-dictionary-node__title'>
          <i className='g3-icon g3-icon--folder data-dictionary-node__file-icon' />
          {node.title}
          <i
            className={`g3-icon g3-icon--chevron-${
              expanded ? 'down' : 'right'
            } data-dictionary-node__toggle-icon`}
          />
        </span>
        <span className='data-dictionary-node__description'>{description}</span>
        <div className='data-dictionary-node__download-group'>
          <span className='data-dictionary-node__button-wrap'>
            <Button
              className='data-dictionary-node__download-button'
              onClick={(e) => {
                handleDownloadTemplate(e, 'json');
              }}
              label='JSON'
              rightIcon='download'
              buttonType='secondary'
            />
          </span>
          <span className='data-dictionary-node__button-wrap'>
            <Button
              className='data-dictionary-node__download-button'
              onClick={(e) => {
                handleDownloadTemplate(e, 'tsv');
              }}
              label='TSV'
              rightIcon='download'
              buttonType='secondary'
            />
          </span>
        </div>
      </div>
      {expanded && (
        <div className='data-dictionary-node__property'>
          <span
            className='data-dictionary-node__property-close'
            onClick={handleCloseNode}
            onKeyPress={(e) => {
              if (e.charCode === 13 || e.charCode === 32) {
                e.preventDefault();
                handleCloseNode();
              }
            }}
            role='button'
            tabIndex={0}
            aria-label='Close property tab'
          >
            Close tab
            <i className='g3-icon g3-icon--cross data-dictionary-node__property-close-icon' />
          </span>
          <div className='data-dictionary-node__property-summary'>
            <span>{node.title}</span>
            <span> has </span>
            <span>{Object.keys(node.properties).length}</span>
            <span> properties. </span>
          </div>
          <DataDictionaryPropertyTable
            properties={node.properties}
            requiredProperties={node.required}
          />
        </div>
      )}
    </>
  );
}

DataDictionaryNode.propTypes = {
  description: PropTypes.string,
  expanded: PropTypes.bool,
  node: PropTypes.object.isRequired,
  onExpandNode: PropTypes.func,
};

export default DataDictionaryNode;
