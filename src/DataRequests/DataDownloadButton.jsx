import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from '../gen3-ui-component/components/Button';

/** @param {{ project: import('./index.jsx').DataRequestProject }} props */
function DataDownloadButton({ project }) {
  const [isLoading, setIsLoading] = useState(false);
  function handleClick() {
    setIsLoading(true);
    fetch(`/amanuensis/download-urls/${project.id}`)
      .then((res) => res.json())
      .then((data) =>
        window.open(data.download_url, '_blank', 'noopener, noreferrer')
      )
      .finally(() => setIsLoading(false));
  }
  return (
    <Button
      buttonType='primary'
      enabled={project.status === 'Data Delivered' && project.has_access}
      onClick={handleClick}
      label='Download Data'
      rightIcon='download'
      isPending={isLoading}
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
