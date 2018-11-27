import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { downloadTemplate } from '../../utils';
import { getCategoryIconSVG } from '../../NodeCategories/helper';
import DataDictionaryPropertyTable from '../../table/DataDictionaryPropertyTable/.';
import './OverlayPropertyTable.css';

class OverlayPropertyTable extends React.Component {
  handleClose = () => {
    this.props.onCloseOverlayPropertyTable();
  };

  render() {
    if (!this.props.node || this.props.hidden) return (<React.Fragment />);
    const IconSVG = getCategoryIconSVG(this.props.node.category);
    return (
      <div className='overlay-property-table'>
        <div className='overlay-property-table__background' />
        <div className='overlay-property-table__fixed-container'>
          <div className='overlay-property-table__content'>
            <div className='overlay-property-table__header'>
              <div className='overlay-property-table__category'>
                <IconSVG className='overlay-property-table__category-icon' />
                <h4 className='overlay-property-table__category-text'>{this.props.node.category}</h4>
                <span
                  className='overlay-property-table__close'
                  onClick={this.handleClose}
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
                  {this.props.node.title}
                </h3>
                <div className='overlay-property-table__node-description introduction'>
                  {this.props.node.description}
                </div>
              </div>
            </div>
            <div className='overlay-property-table__property'>
              <DataDictionaryPropertyTable
                properties={this.props.node.properties}
                requiredProperties={this.props.node.required}
                hasBorder={false}
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
};

OverlayPropertyTable.defaultProps = {
  hidden: true,
  node: null,
  onCloseOverlayPropertyTable: () => {},
};

export default OverlayPropertyTable;
