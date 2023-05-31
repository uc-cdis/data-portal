import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button } from 'antd';
import SharedContext from '../../Utils/SharedContext';
import {
  fetchPresignedUrlForWorkflowArtifact,
  getDataForWorkflowArtifact,
  queryConfig,
} from '../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../Components/LoadingErrorMessage/LoadingErrorMessage';
import './Results.css';
import ManhattanPlot from '../../Components/Diagrams/ManhattanPlot/ManhattanPlot';

const ResultsPheWeb = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const { data, status } = useQuery(
    ['getDataForWorkflowArtifact', name, uid, 'pheweb_json_index'],
    () => getDataForWorkflowArtifact(name, uid, 'pheweb_json_index'),
    queryConfig,
  );

  const downloadManhattanPlot = () => {
    fetchPresignedUrlForWorkflowArtifact(name, uid, 'pheweb_json_index')
      .then((res) => {
        // TODO - the download should maybe move to the component itself...?
        window.open(res, '_blank');
      })
      .catch((error) => {
        alert(`Could not download. \n\n${error}`);
      });
  };

  const displayTopSection = () => (
    <section className='results-top'>
      <div className='GWASResults-flex-row section-header'>
        <div className='GWASResults-flex-col qq-plot-button'>
          <Button>View QQ Plot</Button>
        </div>
        <Button onClick={downloadManhattanPlot}>Download Manhattan Plot</Button>
      </div>
    </section>
  );

  if (status === 'error') {
    return (
      <React.Fragment>
        {displayTopSection()}
        <LoadingErrorMessage message='Error getting Manhattan plot data' />
      </React.Fragment>
    );
  }
  if (status === 'loading') {
    return (
      <React.Fragment>
        {displayTopSection()}
        <div className='spinner-container'>
          Fetching Manhattan plot data... <Spin />
        </div>
      </React.Fragment>
    );
  }

  if (!data) {
    return (
      <React.Fragment>
        {displayTopSection()}
        <LoadingErrorMessage message='Failed to load data for Manhattan plot' />
      </React.Fragment>
    );
  }

  return (
    <div className='results-view'>
      {displayTopSection()}
      <section className='data-viz'>
        <ManhattanPlot
          variant_bins={data.variant_bins}
          unbinned_variants={data.unbinned_variants}
        />
      </section>
    </div>
  );
};
export default ResultsPheWeb;
