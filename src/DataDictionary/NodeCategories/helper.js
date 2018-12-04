import IconAdministrative from './icons/icon_administrative.svg';
import IconAnalysis from './icons/icon_analysis.svg';
import IconBiospecimen from './icons/icon_biospecimen.svg';
import IconClinical from './icons/icon_clinical.svg';
import IconClinicalAssessment from './icons/icon_clinical_assessment.svg';
import IconDataFile from './icons/icon_data_file.svg';
import IconMetadata from './icons/icon_metadata.svg';
import IconNotation from './icons/icon_notation.svg';
import IconIndexFile from './icons/icon_index_file.svg';
import IconDefault from './icons/icon_default.svg';

const nodeCategoryList = {
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
};

const defaultCategory = {
  icon: IconDefault,
  color: '#9B9B9B',
};

export const getCategoryIconSVG = (category) => {
  if (nodeCategoryList[category]) {
    return nodeCategoryList[category].icon;
  }

  return defaultCategory.icon;
};

export const getCategoryColor = (category) => {
  if (nodeCategoryList[category]) {
    return nodeCategoryList[category].color;
  }

  return defaultCategory.color;
};
