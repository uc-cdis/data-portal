import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
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
    const params = queryString.parse(window.location.search);
    const filesMapped = params && params.filesMapped ? parseInt(params.filesMapped, 10) : null;

    return (
      <div className='submission-header'>
        {
          filesMapped ? (
            <div className='submission-header__notification'>
              <p className='submission-header__notification-text'>
                {filesMapped} files successfully mapped!
              </p>
            </div>
          ) : null
        }
        <div className='submission-header-section'>
          <div className='submission-header-section-image'>
            <div className='submission-header-section-image__clear' />
            <Gen3ClientSvg />
            <Button
              onClick={this.openGen3DataClient}
              className='submission-header-section__button'
              label='Read tutorials'
              buttonType='default'
              enabled
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
              enabled
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
              onClick={() => { window.location.href = `${window.location.href}/files`; }}
              className='submission-header-section__button'
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
};

SubmissionHeader.defaultProps = {
  unmappedFileSize: 0,
  unmappedFileCount: 0,
};

export default SubmissionHeader;
