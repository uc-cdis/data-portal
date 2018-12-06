import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Gen3ClientSvg from '../img/gen3client.svg';
import MapFilesSvg from '../img/mapfiles.svg';
import './SubmissionHeader.less';

export class SubmissionHeader extends React.Component {
  componentDidMount = () => {
    this.props.fetchUnmappedFileStats();
  }

  openGen3DataClient = () => {
    window.open('https://github.com/uc-cdis/cdis-data-client', '_blank');
  }

  render() {
    return (
      <div className='submission-header'>
        <div className='submission-header-section'>
          <div className='submission-header-section-image'>
            <div className='submission-header-section-image__clear' />
            <Gen3ClientSvg />
            <Button
              onClick={this.openGen3DataClient}
              className='submission-header-section__button'
              label='Read tutorials'
              buttonType='default'
              enabled={true}
            />
          </div>
          <div className='submission-header-section-info'>
            <div className='h3-typo'>Gen3 Client</div>
            <div className='h4-typo'>Powerful Uploading for Large Files</div>
            <div className='body-typo'>
              Upload your large files quickly and safely without interruptions.
            </div>
            <Button
              onClick={this.openGen3DataClient}
              className='submission-header-section__button'
              label='Download App'
              rightIcon='download'
              buttonType='default'
              enabled={true}
            />
          </div>
        </div>
        <div className='submission-header-section'>
          <div className='submission-header-section-image'>
            <MapFilesSvg />
          </div>
          <div className='submission-header-section-info'>
            <div className='h3-typo'>Map My Files</div>
            <div className='h4-typo'>{this.props.unmappedFileCount} files | {this.props.unmappedFileSize} B</div>
            <div className='body-typo'>
              Mapping files to metadata in order to create medical meaning.
            </div>
            <Button
              onClick={() => window.location.href = `${window.location.href}/files`}
              className='submission-header-section__button'
              label="Map My Files"
              buttonType='primary'
              enabled={true}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SubmissionHeader;
