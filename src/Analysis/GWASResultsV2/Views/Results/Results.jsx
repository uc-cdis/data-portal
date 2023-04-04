import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button } from 'antd';

import DetailPageHeader from '../../SharedComponents/DetailPageHeader/DetailPageHeader';
import SharedContext from '../../Utils/SharedContext';
import {
  fetchPresignedUrlForWorkflowArtifact,
  queryConfig,
} from '../../Utils/gwasWorkflowApi';
import '../../../GWASApp/GWASApp.css';
import LoadingErrorMessage from '../../SharedComponents/LoadingErrorMessage/LoadingErrorMessage';

const Results = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;

  const { data, status } = useQuery(
    [
      'fetchPresignedUrlForWorkflowArtifact',
      name,
      uid,
      'manhattan_plot_index',
    ],
    () => fetchPresignedUrlForWorkflowArtifact(
      name,
      uid,
      'manhattan_plot_index',
    ),
    queryConfig,
  );


  const downloadAll = () => {
    fetchPresignedUrlForWorkflowArtifact(
      name,
      uid,
      'gwas_archive_index',
    ).then((res) => {
      window.open(res, '_blank');
    }).catch((error) => {
      alert(`Could not download. \n\n${error}`);
    });
  };

  const downloadManhattanPlot = () => {
    fetchPresignedUrlForWorkflowArtifact(
      name,
      uid,
      'manhattan_plot_index',
    ).then((res) => {
      window.open(res, '_blank');
    }).catch((error) => {
      alert(`Could not download. \n\n${error}`);
    });
  };

  const displayTopSection = () => (
    <React.Fragment>
      <div className='GWASUI-flexRow' style={{ width: '100%' }}>
        <div className='GWASUI-flexCol'>
          <DetailPageHeader pageTitle={'Results'} />
        </div>
        <div className='GWASUI-flexCol'>
          <Button
            style={{ width: '50%' }}
            onClick={downloadAll}
          >Download All Results
          </Button>
        </div>
      </div>
      <div className='GWASUI-flexRow' style={{ background: 'rgb(209,219,229)', width: '100%' }}>
        <div className='GWASUI-flexCol' todo='this is for the QQ plot button' />
        <div className='GWASUI-flexCol'>
          <Button
            style={{ width: '50%' }}
            onClick={downloadManhattanPlot}
          >Download Manhattan Plot
          </Button>
        </div>
      </div>
    </React.Fragment>
  );

  if (status === 'error') {
    return (
      <React.Fragment>
        {displayTopSection()}
        <LoadingErrorMessage message='Error getting Manhattan plot' />
      </React.Fragment>
    );
  }
  if (status === 'loading') {
    return (
      <React.Fragment>
        {displayTopSection()}
        <div>
          Fetching Manhattan plot... <Spin />
        </div>
      </React.Fragment>
    );
  }

  if (!data) {
    return (
      <React.Fragment>
        {displayTopSection()}
        <LoadingErrorMessage message='Failed to load image, no image path' />
      </React.Fragment>
    );
  }

  const displaySpinnerWhileImageLoadsOrErrorIfItFails = () => {
    if (imageLoadFailed) {
      return (<LoadingErrorMessage message='Failed to load image, invalid image path' />)
    }
    if (imageLoaded) {
      return '';
    }
    return (
      <div>
          Loading... <Spin />
      </div>
    );
  };

  return (
    <React.Fragment>
      {displayTopSection()}
      <img
        src={data}
        alt={'Manhattan plot'}
        onLoad={() => {
          setImageLoaded(true);
        }}
        onError={() => {
          setImageLoadFailed(true);
        }}
        style={{ height: 450, width: 900 }}
      />
      {displaySpinnerWhileImageLoadsOrErrorIfItFails()}
    </React.Fragment>
  );
};
export default Results;
