import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Gen3ClientSvg from '../img/gen3client.svg';
import MapFilesSvg from '../img/mapfiles.svg';
import { humanFileSize } from '../utils.js';
import './SubmissionHeader.less';

class SubmissionHeader extends React.Component {
  componentDidMount = () => {
    this.props.fetchUnmappedFileStats(this.props.user.username);
  }

  openGen3DataClient = () => {
    window.open('https://github.com/uc-cdis/cdis-data-client/releases', '_blank');
  }

  openGen3Tutorials = () => {
    window.open('https://gen3.org/resources/user/gen3-client/', '_blank');
  }

  render() {
    const totalFileSize = humanFileSize(this.props.unmappedFileSize);

    return (
      <div className='submission-header'>
        <div className='submission-header__section'>
          <div className='submission-header__section-image'>
            <div className='submission-header__section-image--clear' />
            <Gen3ClientSvg />
            <Button
              onClick={this.openGen3Tutorials}
              className='submission-header__section-button'
              label='Read Tutorials'
              buttonType='default'
              enabled
            />
          </div>
          <div className='submission-header__section-info'>
            <div className='h3-typo'>Gen3 Client</div>
            <div className='h4-typo'>Powerful Uploading for Large Files</div>
            <div className='body-typo'>
              Upload your large files quickly and safely without interruptions.
            </div>
            <Button
              onClick={this.openGen3DataClient}
              className='submission-header__section-button'
              label='Download App'
              rightIcon='download'
              buttonType='default'
              enabled
            />
          </div>
        </div>
        <div className='submission-header__section'>
          <div className='submission-header__section-image'>
            <MapFilesSvg />
          </div>
          <div className='submission-header__section-info'>
            <div className='h3-typo'>Map My Files</div>
            <div className='h4-typo'>
              {this.props.unmappedFileCount} files | {totalFileSize}
            </div>
            <div className='body-typo'>
              Mapping files to metadata in order to create medical meaning.
            </div>
            <Button
              onClick={() => { window.location.href = `${window.location.href}/files`; }}
              className='submission-header__section-button'
              label='Map My Files'
              buttonType='primary'
              enabled
            />
          </div>
        </div>
      </div>
    );
  }
}

SubmissionHeader.propTypes = {
  unmappedFileSize: PropTypes.number,
  unmappedFileCount: PropTypes.number,
  fetchUnmappedFileStats: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

SubmissionHeader.defaultProps = {
  unmappedFileSize: 0,
  unmappedFileCount: 0,
};

export default SubmissionHeader;
