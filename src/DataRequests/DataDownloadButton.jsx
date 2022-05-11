import PropTypes from 'prop-types';
import Button from '../gen3-ui-component/components/Button';

/** @param {{ project: import('./index.jsx').DataRequestProject }} props */
function DataDownloadButton({ project }) {
  return (
    <Button
      buttonType='primary'
      enabled={project.status === 'Data Delivered' && project.has_access}
      onClick={() =>
        fetch(`/amanuensis/download-urls/${project.id}`)
          .then((res) => res.json())
          .then((data) =>
            window.open(data.download_url, '_blank', 'noopener, noreferrer')
          )
      }
      label='Download Data'
      rightIcon='download'
    />
  );
}

DataDownloadButton.propTypes = {
  project: PropTypes.shape({
    has_access: PropTypes.bool,
    id: PropTypes.number,
    status: PropTypes.oneOf([
      'Approved',
      'Rejected',
      'In Review',
      'Data Delivered',
    ]),
  }),
};

export default DataDownloadButton;
