import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button, notification } from 'antd';
import * as d3 from 'd3-selection';
import SharedContext from '../../../Utils/SharedContext';
import {
  getDataForWorkflowArtifact,
  queryConfig,
} from '../../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../../Components/LoadingErrorMessage/LoadingErrorMessage';
import QQPlotModal from './QQPlotModal/QQPlotModal';
import ManhattanPlot from '../../../Components/Diagrams/ManhattanPlot/ManhattanPlot';
import TopLociTable from './TopLociTable/TopLociTable';
import '../Results.css'; // --> OFF

/* eslint func-names: 0 */ const ResultsPheWeb = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const { data, status } = useQuery(
    ['getDataForWorkflowArtifact', name, uid, 'pheweb_manhattan_json_index'],
    () => getDataForWorkflowArtifact(name, uid, 'pheweb_manhattan_json_index'),
    queryConfig,
  );
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (notificationMessage) => {
    api.open({
      message: notificationMessage,
      description: '',
      duration: 0,
    });
  };
  const manhattanPlotContainerId = 'manhattan_plot_container';

  const downloadManhattanPlot = () => {
    const svgAsInnerHTML = d3
      .select(`#${manhattanPlotContainerId}`)
      .select('svg')
      .attr('version', 1.1)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .node().parentNode.innerHTML;

    const svgAsInnerHTMLAsUtf8Buffer = Buffer.from(svgAsInnerHTML);
    const svgAsInnerHTMLAsBase64 = svgAsInnerHTMLAsUtf8Buffer.toString(
      'base64',
    );

    const svgData = `data:image/svg+xml;base64,${svgAsInnerHTMLAsBase64}`;
    const tmpImage = new Image();
    tmpImage.onload = function () {
      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = document.body.clientWidth;
      hiddenCanvas.height = document.body.clientHeight * 0.6;
      const canvasContext = hiddenCanvas.getContext('2d');
      canvasContext.drawImage(
        tmpImage,
        0,
        0,
        hiddenCanvas.width,
        hiddenCanvas.height,
      );
      const canvasData = hiddenCanvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.download = 'plot.png';
      a.href = canvasData;
      a.click();
    };
    tmpImage.onerror = function (error) {
      // when SVG is invalid, the error.message will be undefined:
      if (!error.message) {
        openNotification('❌ Could not download. Invalid SVG');
      } else {
        openNotification(`❌ Could not download. \n\n${error.message}`);
      }
    };
    tmpImage.src = svgData;
  };

  const displayTopSection = () => (
    <section className='results-top'>
      <div className='GWASResults-flex-row section-header'>
        <div className='GWASResults-flex-col qq-plot-button'>
          <Button onClick={() => setModalOpen(true)}>View QQ Plot</Button>
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
    <React.Fragment>
      {contextHolder}
      <QQPlotModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <div className='results-view'>
        {displayTopSection()}
        <section className='data-viz'>
          <ManhattanPlot
            variant_bins={data.variant_bins}
            unbinned_variants={data.unbinned_variants}
            manhattan_plot_container_id={manhattanPlotContainerId}
          />
        </section>
        <TopLociTable data={data.unbinned_variants} />
      </div>
    </React.Fragment>
  );
};
export default ResultsPheWeb;
