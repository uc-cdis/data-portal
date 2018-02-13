import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { countNames } from '../../localconf';
import { TableRow, TableCell } from '../style';
import SubmitButton from '../../components/SubmitButton';

/**
 * Table row component - fills in columns given project property
 */
class ProjectTR extends Component {
  render() {
    const proj = this.props.project;
    return (<TableRow key={proj.name} summaryRow={!!this.props.summaryRow}>
      <TableCell>
        {proj.name}
      </TableCell>
      <TableCell>{proj.countOne}
      </TableCell>
      <TableCell>{proj.countTwo}
      </TableCell>
      <TableCell>{proj.countThree}
      </TableCell>
      <TableCell>
        {(countNames[2] === 'File') ? proj.fileCount : proj.countThree}
      </TableCell>
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
