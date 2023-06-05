import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button } from 'antd';
import * as d3 from 'd3-selection';
import SharedContext from '../../Utils/SharedContext';
import {
  getDataForWorkflowArtifact,
  queryConfig,
} from '../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../Components/LoadingErrorMessage/LoadingErrorMessage';
import './Results.css';
import ManhattanPlot from '../../Components/Diagrams/ManhattanPlot/ManhattanPlot';

/* eslint func-names: 0 */ // --> OFF

const ResultsPheWeb = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const { data, status } = useQuery(
    ['getDataForWorkflowArtifact', name, uid, 'pheweb_json_index'],
    () => getDataForWorkflowArtifact(name, uid, 'pheweb_json_index'),
    queryConfig,
  );
  const manhattanPlotContainerId = 'manhattan_plot_container';

  const downloadManhattanPlot = () => {
    const svgAsInnerHTML = d3.select(`#${manhattanPlotContainerId}`).select('svg')
      .attr('version', 1.1)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink') // https://stackoverflow.com/questions/59138117/svg-namespace-prefix-xlink-for-href-on-image-is-not-defined - this deprecated xlink is still used by PheWeb
      .node().parentNode.innerHTML;

    const svgAsInnerHTMLAsUtf8Buffer = Buffer.from(svgAsInnerHTML);
    const svgAsInnerHTMLAsBase64 = svgAsInnerHTMLAsUtf8Buffer.toString('base64');

    const svgData = `data:image/svg+xml;base64,${svgAsInnerHTMLAsBase64}`;
    const tmpImage = new Image();
    tmpImage.src = svgData;
    tmpImage.onload = function () {
      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = document.body.clientWidth;
      hiddenCanvas.height = document.body.clientHeight * 0.6;
      const canvasContext = hiddenCanvas.getContext('2d');
      canvasContext.drawImage(tmpImage, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
      const canvasData = hiddenCanvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.download = 'plot.png';
      a.href = canvasData;
      a.click();
    };
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
          manhattan_plot_container_id={manhattanPlotContainerId}
        />
      </section>
    </div>
  );
};
export default ResultsPheWeb;
