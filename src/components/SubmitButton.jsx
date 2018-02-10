import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import { localTheme } from '../localconf';
import React from 'react';

class SubmitButton extends React.Component {
  render() {
    return (<Link to={this.props.projName} title="Submit or View Graph">
      <FlatButton backgroundColor={localTheme['projectTable.submitButtonColor']} label="Submit or View Graph" />
    </Link>);
  }
}

SubmitButton.propTypes = {
  projName: PropTypes.string.isRequired,
};

export default SubmitButton;
