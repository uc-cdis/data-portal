import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button, Tooltip, message } from 'antd';
import DetailPageHeader from '../../SharedComponents/DetailPageHeader/DetailPageHeader';
import SharedContext from '../../Utils/SharedContext';
import {
  fetchPresignedUrlForWorkflowArtifact,
  queryConfig,
} from '../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../SharedComponents/LoadingErrorMessage/LoadingErrorMessage';
import './Results.css';

const Results = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const { data, status } = useQuery(
    ['fetchPresignedUrlForWorkflowArtifact', name, uid, 'manhattan_plot_index'],
    () => fetchPresignedUrlForWorkflowArtifact(name, uid, 'manhattan_plot_index'),
    queryConfig,
  );

  const downloadAll = () => {
    fetchPresignedUrlForWorkflowArtifact(name, uid, 'gwas_archive_index')
      .then((res) => {
        window.open(res, '_blank');
      })
      .catch((error) => {
        message.error(`Could not download. \n\n${error}`);
      });
  };

  const downloadManhattanPlot = () => {
    fetchPresignedUrlForWorkflowArtifact(name, uid, 'manhattan_plot_index')
      .then((res) => {
        window.open(res, '_blank');
      })
      .catch((error) => {
        message.error(`Could not download. \n\n${error}`);
      });
  };

  const displayTopSection = () => (
    <section className='results-top'>
      <div className='GWASResults-flex-row'>
        <div className='GWASResults-flex-col'>
          <DetailPageHeader pageTitle={'Results'} />
        </div>
        <div>
          <Button onClick={downloadAll}>Download All Results</Button>
        </div>
      </div>
      <div className='GWASResults-flex-row section-header'>
        <div className='GWASResults-flex-col qq-plot-button'>
          <Button>View QQ Plot</Button>
        </div>
        <Button onClick={downloadManhattanPlot}>View Image in New Tab</Button>
      </div>
    </section>
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
        <div className='spinner-container'>
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
      return (
        <LoadingErrorMessage message='Failed to load image, invalid image path' />
      );
    }
    if (imageLoaded) {
      return '';
    }
    return (
      <div className='spinner-container'>
        Loading... <Spin />
      </div>
    );
  };

  return (
    <div className='results-view'>
      {displayTopSection()}
      <section className='data-viz'>
        {!imageLoadFailed && (
          <Tooltip title='Right click and select “Save Image As” to download'>
            <img
              src={data}
              alt='Manhattan plot'
              onLoad={() => {
                setImageLoaded(true);
              }}
              onError={() => {
                setImageLoadFailed(true);
              }}
            />
          </Tooltip>
        )}
        {displaySpinnerWhileImageLoadsOrErrorIfItFails()}
      </section>
    </div>
  );
};
export default Results;
