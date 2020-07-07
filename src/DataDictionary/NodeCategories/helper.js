import { schemeCategory20 } from 'd3-scale';

import IconAdministrative from './icons/icon_administrative.svg';
import IconAnalysis from './icons/icon_analysis.svg';
import IconBiospecimen from './icons/icon_biospecimen.svg';
import IconClinical from './icons/icon_clinical.svg';
import IconClinicalAssessment from './icons/icon_clinical_assessment.svg';
import IconDataFile from './icons/icon_data_file.svg';
import IconMetadata from './icons/icon_metadata.svg';
import IconNotation from './icons/icon_notation.svg';
import IconIndexFile from './icons/icon_index_file.svg';
import IconDataObservations from './icons/icon_data_observations.svg';
import IconDefault from './icons/icon_default.svg';
import IconExperimentalMethods from './icons/icon_experimental_methods.svg';
import IconSubjectCharacteristics from './icons/icon_subject_characteristics.svg';
import IconImaging from './icons/icon_imaging.svg';
import IconStudyAdministration from './icons/icon_study_administration.svg';

const nodeCategoryDict = {
  clinical: {
    icon: IconClinical,
    color: '#05B8EE',
  },
  biospecimen: {
    icon: IconBiospecimen,
    color: '#27AE60',
  },
  data_file: {
    icon: IconDataFile,
    color: '#7EC500',
  },
  metadata_file: {
    icon: IconMetadata,
    color: '#F4B940',
  },
  analysis: {
    icon: IconAnalysis,
    color: '#FF7ABC',
  },
  administrative: {
    icon: IconAdministrative,
    color: '#AD91FF',
  },
  notation: {
    icon: IconNotation,
    color: '#E74C3C',
  },
  index_file: {
    icon: IconIndexFile,
    color: '#26D9B1',
  },
  clinical_assessment: {
    icon: IconClinicalAssessment,
    color: '#3283C8',
  },
  medical_history: {
    icon: IconClinical,
    color: '#05B8EE',
  },
  data_observations: {
    icon: IconDataObservations,
    color: '#FF8585',
  },
  experimental_methods: {
    icon: IconExperimentalMethods,
    color: '#E74C3C',
  },
  subject_characteristics: {
    icon: IconSubjectCharacteristics,
    color: '#05B8EE',
  },
  imaging: {
    icon: IconImaging,
    color: '#7EC500',
  },
  study_administration: {
    icon: IconStudyAdministration,
    color: '#733EA3',
  },
  satellite: {
    icon: IconDefault,
    color: schemeCategory20[11],
  },
  radar: {
    icon: IconDefault,
    color: schemeCategory20[16],
  },
  stream_gauge: {
    icon: IconDefault,
    color: schemeCategory20[19],
  },
  weather_station: {
    icon: IconDefault,
    color: schemeCategory20[10],
  },
};

const defaultCategory = {
  icon: IconDefault,
  color: '#9B9B9B',
};

export const getCategoryIconSVG = (category) => {
  if (nodeCategoryDict[category]) {
    return nodeCategoryDict[category].icon;
  }

  // look for a category name that's a suffix of
  // the category we're looking for
  const suffixCategory = Object.keys(nodeCategoryDict).find(
    key => category && category.endsWith(key),
  );
  if (suffixCategory) {
    return nodeCategoryDict[suffixCategory].icon;
  }

  return defaultCategory.icon;
};

export const getCategoryColor = (category) => {
  if (nodeCategoryDict[category]) {
    return nodeCategoryDict[category].color;
  }

  // look for a category name that's a suffix of
  // the category we're looking for
  const suffixCategory = Object.keys(nodeCategoryDict).find(
    key => category && category.endsWith(key),
  );
  if (suffixCategory) {
    return nodeCategoryDict[suffixCategory].color;
  }

  return defaultCategory.color;
};
