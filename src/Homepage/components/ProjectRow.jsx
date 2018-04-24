import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TableRow, TableCell } from '../style';
import SubmitButton from '../../components/SubmitButton';

/**
 * Table row component - fills in columns given project property
 */
class ProjectTR extends Component {
  render() {
    const proj = this.props.project;
    console.log(`${proj.name}: ${this.props.index}`);
    if (this.props.index % 2 === 1)
    {
      return (
        <TableRow key={proj.name} summaryRow={!!this.props.summaryRow} oddRow>
          <TableCell className={'h4-typo'}>
            {proj.name}
          </TableCell>
          {
            proj.counts.map(
              (count, index) => (
                <TableCell key={`${proj.name}count${index.toString()}`}>
                  {count}
                </TableCell>
              ),
            )
          }
          <TableCell>
            {
              proj.name !== 'Totals:' ?
                <SubmitButton
                  link={`/${proj.name}`}
                  buttonClassName='button-primary-orange'
                  dictIcons={this.props.dictIcons}
                /> : ''
            }
          </TableCell>
        </TableRow>);
    }
    return (
      <TableRow key={proj.name} summaryRow={!!this.props.summaryRow}>
        <TableCell className={'h4-typo'}>
          {proj.name}
        </TableCell>
        {
          proj.counts.map(
            (count, index) => (
              <TableCell key={`${proj.name}count${index.toString()}`}>
                {count}
              </TableCell>
            ),
          )
        }
        <TableCell>
          {
            proj.name !== 'Totals:' ?
              <SubmitButton
                link={`/${proj.name}`}
                buttonClassName='button-primary-orange'
                dictIcons={this.props.dictIcons}
              /> : ''
          }
        </TableCell>
      </TableRow>);
  }
}

ProjectTR.propTypes = {
  project: PropTypes.object.isRequired,
  summaryRow: PropTypes.bool,
  index: PropTypes.number.isRequired,
  dictIcons: PropTypes.object,
};

ProjectTR.defaultProps = {
  summaryRow: false,
  dictIcons: undefined
};

export default ProjectTR;
