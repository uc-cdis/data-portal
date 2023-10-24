import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button } from 'antd';
import DetailPageHeader from '../../Components/DetailPageHeader/DetailPageHeader';
import SharedContext from '../../Utils/SharedContext';
import { fetchPresignedUrlForWorkflowArtifact, getWorkflowDetails } from '../../Utils/gwasWorkflowApi';
import queryConfig from '../../../SharedUtils/QueryConfig';
import LoadingErrorMessage from '../../../SharedUtils/LoadingErrorMessage/LoadingErrorMessage';
import './Results.css';
import ResultsPheWeb from './ResultsPheWeb/ResultsPheWeb';
import ResultsPng from './ResultsPng/ResultsPng';

/* eslint no-alert: 0 */ // --> OFF
const Results = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const { data, status } = useQuery(
    ['getWorkflowDetails', name, uid],
    () => getWorkflowDetails(name, uid),
    queryConfig,
  );

  const downloadAll = () => {
    fetchPresignedUrlForWorkflowArtifact(name, uid, 'gwas_archive_index')
      .then((res) => {
        window.open(res, '_blank');
      })
      .catch((error) => {
        alert(`Could not download. \n\n${error}`);
      });
  };

  const displayTopSection = () => (
    <section className='results-top'>
      <div className='GWASResults-flex-row'>
        <div className='GWASResults-flex-col'>
          <DetailPageHeader pageTitle={`Results / ${name}`} />
        </div>
        <div>
          <Button onClick={downloadAll}>Download All Results</Button>
        </div>
      </div>
    </section>
  );

  if (status === 'error') {
    return (
      <React.Fragment>
        {displayTopSection()}
        <LoadingErrorMessage message='Error getting workflow details' />
      </React.Fragment>
    );
  }
  if (status === 'loading') {
    return (
      <React.Fragment>
        {displayTopSection()}
        <div className='spinner-container'>
          Fetching workflow details... <Spin />
        </div>
      </React.Fragment>
    );
  }

  if (!data) {
    return (
      <React.Fragment>
        {displayTopSection()}
        <LoadingErrorMessage message='Workflow details empty/not found' />
      </React.Fragment>
    );
  }

  const displayManhattanPlot = () => {
    // Try the pheweb option first:
    let results = data?.outputs?.parameters?.filter(
      (entry) => entry.name === 'pheweb_manhattan_json_index',
    );
    if (results && results.length !== 0) {
      return <ResultsPheWeb />;
    }
    // If no pheweb json file, try to see if there is a PNG Manhattan plot:
    results = data?.outputs?.parameters?.filter(
      (entry) => entry.name === 'manhattan_plot_index',
    );
    if (results && results.length !== 0) {
      return <ResultsPng />;
    }
    // If none of the above, show error:
    return (
      <LoadingErrorMessage message='Plot cannot display. This workflow pre-dates the availability of the plot in the user interface. To see the plot please use the “Download All Results” button.' />
    );
  };

  return (
    <div className='results-view'>
      {displayTopSection()}
      <section className='data-viz'>{displayManhattanPlot()}</section>
    </div>
  );
};
export default Results;
