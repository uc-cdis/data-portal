import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Space } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';

import './StudyViewer.css';
import StudyCard from './StudyCard';

export const data = [
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
      trial_website: <a href='https://clinicaltrials.gov/ct2/show/NCT04280705'>Visit NIH.gov</a>,
    },
    document: [
      {
        name: 'Data Dictionary',
        format: 'PDF',
        link: '/',
        size: 763843,
      },
      {
        name: 'Protocol',
        format: 'PDF',
        link: '/',
        size: 7638643,
      },
    ],
    hasAccess: false,
  },
  {
    title: 'COVID-19-associated Lymphopenia Pathogenesis Study in Blood (CALYPSO)',
    description: 'This study is an adaptive, randomized, double-blind, placebo-controlled trial to evaluate the safety and efficacy of novel therapeutic agents in hospitalized adults diagnosed with COVID-19. The study is a multicenter trial that will be conducted in up to approximately 100 sites globally. The study will compare different investigational therapeutic agents to a control arm. There will be interim monitoring to introduce new arms and allow early stopping for futility, efficacy, or safety.',
    url: '/CALYPSO',
    meta: {
      condition: 'COVID-19',
      study_design: 'Interventional (Clinical Trial), Randomized Allocation',
      sponsor: 'National Institute of Allergy and Infectious Diseases (NIAID)',
      study_dates: 'February 21, 2020 - April 1, 2023',
      data_available: 'Patient-level data',
      trial_website: '',
    },
    document: [
      {
        name: 'Data Dictionary',
        format: 'PDF',
        link: '/',
        size: 763843,
      },
      {
        name: 'Database Documentation and Forms',
        format: 'PDF',
        link: '/',
        size: 3421325,
      },
      {
        name: 'Manual of Procedures',
        format: 'PDF',
        link: '/',
        size: 6538352,
      },
      {
        name: 'Protocol',
        format: 'PDF',
        link: '/',
        size: 7638643,
      },
    ],
    hasAccess: true,
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
      data_available: 'Patient-level data',
      trial_website: '',
    },
    document: [
      {
        name: 'Data Dictionary',
        format: 'PDF',
        link: '/',
        size: 763843,
      },
      {
        name: 'Manual of Procedures',
        format: 'PDF',
        link: '/',
        size: 6538352,
      },
      {
        name: 'Protocol',
        format: 'PDF',
        link: '/',
        size: 7638643,
      },
    ],
    hasAccess: false,
  },
];

class StudyViewer extends React.Component {
  render() {
    const onRedirectToLoginClicked = () => this.props.history.push('/login', { from: this.props.location.pathname });
    const userHasLoggedIn = !!this.props.user.username;
    return (
      <div className='study-viewer'>
        <div className='h2-typo study-viewer__title'>
              Studies
        </div>
        {(!userHasLoggedIn) ?
          <div className='study-viewer__login-banner'>
            <Space>
              <Button
                label={'Login'}
                buttonType='primary'
                onClick={onRedirectToLoginClicked}
              />
              <div className='h3-typo'>to see approved trials or requested trials</div>
            </Space>
          </div>
          : null}
        <Space className='study-viewer__space' direction='vertical'>
          {(data.map((d, i) => <StudyCard key={i} data={d} />))}
        </Space>
      </div>
    );
  }
}

StudyViewer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default withRouter(StudyViewer);
