import React from 'react';

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

export const truncateLines = (str, maxCharInRow = 10) => {
  const wordsList = str.split(' ');
  const res = [];
  let cur = wordsList[0];
  for (let i = 1; i < wordsList.length; i += 1) {
    if (cur.length + wordsList[i].length > maxCharInRow) {
      res.push(cur);
      cur = wordsList[i];
    } else {
      cur = `${cur} ${wordsList[i]}`;
    }
  }
  res.push(cur);
  return res;
};

export const getTypeIconSVG = (type) => {
  const iconMap = {
    clinical: IconClinical,
    biospecimen: IconBiospecimen,
    data_file: IconDataFile,
    metadata_file: IconMetadata,
    analysis: IconAnalysis,
    administrative: IconAdministrative,
    notation: IconNotation,
    index_file: IconIndexFile,
    clinical_assessment: IconClinicalAssessment,
    medical_history: IconClinical,
  };
  return iconMap[type] ? iconMap[type] : IconDefault;
};

export const humanizeString = str => (str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()).replace('_', ' ');
