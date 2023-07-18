import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import QQPlot from '../../../../Components/Diagrams/QQPlot/QQPlot';
import smallJsonDataFile from '../../../../TestData/Diagrams/QQPlotData/SmallQQPlotTestData.json';

const QQPlotModal = ({ modalOpen, setModalOpen }) => (
  <Modal
    open={modalOpen}
    footer={null}
    onCancel={() => {
      setModalOpen(false);
    }}
    title={
      <div className='flex-row'>
        <div style={{ width: '100%', padding: '0 25%' }}>
          QQ Plot
          <QQPlot
            qq_plot_container_id='qq-plot-container-id'
            maf_ranges={smallJsonDataFile.by_maf}
            qq_ci={smallJsonDataFile.ci}
          />
        </div>
      </div>
    }
  ></Modal>
);
/*
JobInputModal.propTypes = {

};
*/
export default QQPlotModal;
