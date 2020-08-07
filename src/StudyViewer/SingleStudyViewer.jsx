import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Space, Typography } from 'antd';
import BackLink from '../components/BackLink';

import StudyDetails from './StudyDetails';
import './StudyViewer.css';

const { Title } = Typography;

const data = [
  {
    title: 'COVID-19-associated Lymphopenia Pathogenesis Study in Blood (CALYPSO)',
    description: 'This study is an adaptive, randomized, double-blind, placebo-controlled trial to evaluate the safety and efficacy of novel therapeutic agents in hospitalized adults diagnosed with COVID-19. The study is a multicenter trial that will be conducted in up to approximately 100 sites globally. The study will compare different investigational therapeutic agents to a control arm. There will be interim monitoring to introduce new arms and allow early stopping for futility, efficacy, or safety.',
    url: '/CALYPSO',
    meta: {
      condition: 'COVID-19',
      study_design: 'Interventional (Clinical Trial), Randomized Allocation',
      sponsor: 'National Institute of Allergy and Infectious Diseases (NIAID)',
      study_dates: 'February 21, 2020 - April 1, 2023',
    },
    hasAccess: true,
  },
  {
    title: 'The Adaptive COVID-19 Treatment Trial (ATCC)',
    description: 'This study is an adaptive, randomized, double-blind, placebo-controlled trial to evaluate the safety and efficacy of novel therapeutic agents in hospitalized adults diagnosed with COVID-19. The study is a multicenter trial that will be conducted in up to approximately 100 sites globally. The study will compare different investigational therapeutic agents to a control arm. There will be interim monitoring to introduce new arms and allow early stopping for futility, efficacy, or safety.',
    url: '/ATCC',
    meta: {
      condition: 'COVID-19',
      study_design: 'Interventional (Clinical Trial), Randomized Allocation',
      sponsor: 'National Institute of Allergy and Infectious Diseases (NIAID)',
      study_dates: 'February 21, 2020 - May 21, 2020',
      data_available: 'Patient-level data',
      trial_website: 'https://clinicaltrials.gov/ct2/show/NCT04280705',
    },
    hasAccess: false,
  },
  {
    title: 'Longitudinal Study of COVID-19 Sequelae and Immunity (RECON_19)',
    description: 'This study is an adaptive, randomized, double-blind, placebo-controlled trial to evaluate the safety and efficacy of novel therapeutic agents in hospitalized adults diagnosed with COVID-19. The study is a multicenter trial that will be conducted in up to approximately 100 sites globally. The study will compare different investigational therapeutic agents to a control arm. There will be interim monitoring to introduce new arms and allow early stopping for futility, efficacy, or safety.',
    url: '/RECON_19',
    meta: {
      condition: 'COVID-19',
      study_design: 'Interventional (Clinical Trial), Randomized Allocation',
      sponsor: 'National Institute of Allergy and Infectious Diseases (NIAID)',
      study_dates: 'February 21, 2020 - April 1, 2023',
    },
    hasAccess: false,
  },
];

class SingleStudyViewer extends React.Component {
  render() {
    // some hacky way to load mock data in here
    // of course this will be replaced by passing in a prop or read from redux later
    const dataUrl = this.props.location.pathname.replace('/study-viewer', '');
    const studyData = data.find(element => element.url === dataUrl);

    return (
      <div className='study-viewer'>
        <BackLink url='/study-viewer' label='Back' />
        {(studyData) ?
          <Space className='study-viewer__space' direction='vertical'>
            <div className='study-viewer__title'>
              <Title level={4}>{studyData.title}</Title>
            </div>
            <StudyDetails data={studyData} />
          </Space>
          : null}
      </div>
    );
  }
}

SingleStudyViewer.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withRouter(SingleStudyViewer);
