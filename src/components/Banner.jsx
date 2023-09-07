import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';

class Banner extends React.Component {
  /**
 * Determine if we need to display any global banners
 * This is added by defining a object in
 * gitops.json:
 * "components": {
    "banner": [
      {
        "type": "info",
        "message": "I'm a banner",
        "resetMsgDays": 100
      }
    ],

 * "type": "info", // Type of Alert styles, options: success, info, warning, error
 * "message": "I'm a banner", // message to be displayed
 * "resetMsgDays": // optional; set to number of days until displaying banner again, defaults to 365
 */

  render() {
    const onBannerClose = () => {
      this.props.onClose({
        id: this.props.id,
        resetDate: this.props.resetDate,
      });
    };
    return (
      <Alert
        message={this.props.message}
        type={this.props.type}
        showIcon
        closable
        banner
        onClose={onBannerClose}
      />
    );
  }
}

Banner.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
  message: PropTypes.string.isRequired,
  resetDate: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Banner;
