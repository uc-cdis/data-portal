import moment from 'moment';
import { hostnameWithSubdomain } from '../../../../../../../../localconf';

const GenerateFilenameWithoutPrefix = (fileCategory: string, studyID: string = ''): string => {
  const currentDateString = moment().format('YYYY-MM-DD');
  const filenamePrefix = `${hostnameWithSubdomain}${(studyID) ? `-${studyID}` : ''}-${currentDateString}`;
  switch (fileCategory) {
  case 'metadata':
    return `${filenamePrefix}-meta`;
  case 'vlmd':
    return `${filenamePrefix}-vars`;
  case 'manifest':
    return `${filenamePrefix}-manifest`;
  case 'all_manifests':
    return `${filenamePrefix}-manifests`;
  case 'file':
    return `${filenamePrefix}-file`;
  case 'all_files':
    return `${filenamePrefix}`;
  default:
    console.error('Unknown file category passed into GenerateFilenameWithoutPrefix(): ', fileCategory);
    return '';
  }
};

export default GenerateFilenameWithoutPrefix;
