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
    return (
      <TableRow key={proj.name} summaryRow={!!this.props.summaryRow}>
        <TableCell>
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
          {proj.name !== 'Totals:' ? <SubmitButton projName={proj.name} /> : ''}
        </TableCell>
      </TableRow>);
  }
}

ProjectTR.propTypes = {
  project: PropTypes.object.isRequired,
  summaryRow: PropTypes.bool,
};

ProjectTR.defaultProps = {
  summaryRow: false,
};

export default ProjectTR;
