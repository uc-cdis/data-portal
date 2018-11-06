import { color } from '../../utils';
import React from 'react';

import IconAdministrative from './icons/icon_administrative.svg';
import IconAnalysis from './icons/icon_analysis.svg';
import IconBiospecimen from './icons/icon_biospecimen.svg';
import IconClinical from './icons/icon_clinical.svg';
import IconClinicalAssessment from './icons/icon_clinical_assessment.svg';
import IconDataFile from './icons/icon_data_file.svg';
import IconMetadata from './icons/icon_metadata.svg';
import IconNotation from './icons/icon_notation.svg';

export const getTypeColor = type => color[type];

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
    administrative: IconAdministrative,
    analysis: IconAnalysis,
    biospecimen: IconBiospecimen,
    clinical: IconClinical,
    clinical_assessment: IconClinicalAssessment,
    data_file: IconDataFile,
    metadata: IconMetadata,
    notation: IconNotation,
  };
  return iconMap[type];
};

export const humanizeString = str => (str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()).replace('_', ' ');
