import { dataDictionaryTemplatePath } from '../localconf';
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

export const getCategoryColor = (category) => {
  const colorMap = {
    clinical: '#05B8EE',
    biospecimen: '#27AE60',
    data_file: '#7EC500',
    metadata_file: '#F4B940',
    analysis: '#FF7ABC',
    administrative: '#AD91FF',
    notation: '#E74C3C',
    index_file: '#26D9B1',
    clinical_assessment: '#3283C8',
    medical_history: '#05B8EE',
  };
  const defaultColor = '#9B9B9B';
  return colorMap[category] ? colorMap[category] : defaultColor;
};

/**
 * Little helper to extract the type for some dictionary node property.
 * Export just for testing.
 * @param {Object} property one of the properties of a dictionary node
 * @return {String|Array<String>} string for scalar types, array for enums
 *                   and other listish types or 'UNDEFINED' if no
 *                   type information availabale
 */
export const getType = (property) => {
  let type = 'UNDEFINED';
  if ('type' in property) {
    if (typeof property.type === 'string') {
      type = property.type;
    } else {
      type = property.type;
    }
  } else if ('enum' in property) {
    type = property.enum;
  } else if ('oneOf' in property) {
    // oneOf has nested type list - we want to flatten nested enums out here ...
    type = property.oneOf
      .map(item => getType(item))
      .reduce(
        (flatList, it) => {
          if (Array.isArray(it)) {
            return flatList.concat(it);
          }
          flatList.push(it);
          return flatList;
        }, [],
      );
  } else {
    type = 'UNDEFINED';
  }

  return type;
};


export const downloadTemplate = (format, nodeId) => {
  if (format === 'tsv' || format === 'json') {
    const templatePath = `${dataDictionaryTemplatePath}${nodeId}?format=${format}`;
    window.open(templatePath);
  }
};