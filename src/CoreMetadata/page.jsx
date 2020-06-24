import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import BackLink from '../components/BackLink';
import { ReduxCoreMetadataHeader, ReduxFileTypePicture, ReduxCoreMetadataTable } from './reduxer';
import dictIcons from '../img/icons/file-icons/file-icons';
import './page.less';

class CoreMetadataPage extends Component {
  componentDidMount() {
    if (this.props.error) {
      // eslint-disable-next-line no-console
      console.error(this.props.error);
      this.props.history.push('/not-found');
    }
  }

  render() {
    return (
      <div className='core-metadata-page'>
        <BackLink url='/files' label='Back to File Explorer' />
        <div className='core-metadata-page__grid'>
          <div className='core-metadata-page__picture'>
            <ReduxFileTypePicture dictIcons={dictIcons} />
          </div>
          <div className='core-metadata-page__header'><ReduxCoreMetadataHeader /></div>
          <div className='core-metadata-page__table'><ReduxCoreMetadataTable /></div>
        </div>
      </div>
    );
  }
}

CoreMetadataPage.propTypes = {
  error: PropTypes.string,
  history: PropTypes.object.isRequired,
};

CoreMetadataPage.defaultProps = {
  error: null,
};

export default withRouter(CoreMetadataPage);
