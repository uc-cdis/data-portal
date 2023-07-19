import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { Modal, Spin } from 'antd';
import QQPlot from '../../../../Components/Diagrams/QQPlot/QQPlot';
import smallJsonDataFile from '../../../../TestData/Diagrams/QQPlotData/SmallQQPlotTestData.json';
import SharedContext from '../../../../Utils/SharedContext';
import {
  getDataForWorkflowArtifact,
  queryConfig,
} from '../../../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../../../Components/LoadingErrorMessage/LoadingErrorMessage';

const QQPlotModal = ({ modalOpen, setModalOpen }) => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;

  const { data, status } = useQuery(
    ['getDataForWorkflowArtifact', name, uid, 'pheweb_qq_json_index'],
    () => getDataForWorkflowArtifact(name, uid, 'pheweb_qq_json_index'),
    queryConfig
  );

  const displayModalContent = () => {
    console.log('status', status);
    console.log('data', data);
    if (status === 'error') {
      return (
        <React.Fragment>
          <LoadingErrorMessage message='Error getting QQ plot data' />
        </React.Fragment>
      );
    } else if (status === 'loading') {
      return (
        <React.Fragment>
          <div className='spinner-container'>
            Fetching QQ plot data... <Spin />
          </div>
        </React.Fragment>
      );
    } else if (!data || !data?.by_maf || !data.ci) {
      return (
        <React.Fragment>
          {displayTopSection()}
          <LoadingErrorMessage message='Failed to load data for Manhattan plot' />
        </React.Fragment>
      );
    } else {
      return (
        <div style={{ width: '100%', padding: '0 25%' }}>
          <QQPlot
            qq_plot_container_id='qq-plot-container-id'
            maf_ranges={data.by_maf}
            qq_ci={data.ci}
          />
        </div>
      );
    }
  };

  return (
    <Modal
      className='qq-modal'
      open={modalOpen}
      footer={null}
      onCancel={() => {
        setModalOpen(false);
      }}
      title={<h2>QQ Plot</h2>}
    >
      <div className='flex-row'>{displayModalContent()}</div>
    </Modal>
  );
};

QQPlotModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

export default QQPlotModal;
