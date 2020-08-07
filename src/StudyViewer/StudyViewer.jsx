import React from 'react';
import { Space } from 'antd';

import './StudyViewer.css';
import StudyCard from './StudyCard';

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
      data_available: 'Patient-level data',
      trial_website: '',
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
      trial_website: <a href="'https://clinicaltrials.gov/ct2/show/NCT04280705'">Visit NIH.gov</a>,
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
      data_available: 'Patient-level data',
      trial_website: '',
    },
    hasAccess: false,
  },
];

class StudyViewer extends React.Component {
  render() {
    return (
      <div className='study-viewer'>
        <div className='h2-typo study-viewer__title'>
              Studies
        </div>
        <Space className='study-viewer__space' direction='vertical'>
          {(data.map((d, i) => <StudyCard key={i} data={d} />))}
        </Space>
      </div>
    );
  }
}

export default StudyViewer;
