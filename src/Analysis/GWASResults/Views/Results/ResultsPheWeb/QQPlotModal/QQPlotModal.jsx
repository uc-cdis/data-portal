import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { Modal, Spin } from 'antd';
import QQPlot from '../../../../Components/Diagrams/QQPlot/QQPlot';
import SharedContext from '../../../../Utils/SharedContext';
import { getDataForWorkflowArtifact } from '../../../../Utils/gwasWorkflowApi';
import queryConfig from '../../../../../SharedUtils/QueryConfig';
import LoadingErrorMessage from '../../../../../SharedUtils/LoadingErrorMessage/LoadingErrorMessage';

const QQPlotModal = ({ modalOpen, setModalOpen }) => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;

  const { data, status } = useQuery(
    ['getDataForWorkflowArtifact', name, uid, 'pheweb_qq_json_index'],
    () => getDataForWorkflowArtifact(name, uid, 'pheweb_qq_json_index'),
    queryConfig,
  );

  const displayModalContent = () => {
    if (status === 'error') {
      return (
        <React.Fragment>
          <LoadingErrorMessage message='Error getting QQ plot data' />
        </React.Fragment>
      );
    }
    if (status === 'loading') {
      return (
        <React.Fragment>
          <div className='spinner-container'>
            Fetching QQ plot data... <Spin />
          </div>
        </React.Fragment>
      );
    }
    if (!data || !data?.by_maf || !data.ci) {
      return (
        <React.Fragment>
          <LoadingErrorMessage message='Failed to load data for Manhattan plot' />
        </React.Fragment>
      );
    }
    return (
      <div className='qqplot-modal-container'>
        <QQPlot
          qq_plot_container_id='qq-plot-container-id'
          maf_ranges={data.by_maf}
          qq_ci={data.ci}
        />
      </div>
    );
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
