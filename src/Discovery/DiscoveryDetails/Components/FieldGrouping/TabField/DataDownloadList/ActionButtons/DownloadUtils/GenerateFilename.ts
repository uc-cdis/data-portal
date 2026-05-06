import moment from 'moment';
import { hostnameWithSubdomain } from '../../../../../../../../localconf';

const GenerateFilename = (fileCategory: string, studyID: string = ''): string => {
  const currentDateString = moment().format('YYYY-MM-DD');
  const filenamePrefix = `${hostnameWithSubdomain}${(studyID) ? `-${studyID}` : ''}-${currentDateString}`;
  switch (fileCategory) {
  case 'metadata':
    return `${filenamePrefix}-meta.json`;
  case 'vlmd':
    return `${filenamePrefix}-vars.zip`;
  case 'manifest':
    return `${filenamePrefix}-manifest.json`;
  case 'all_manifests':
    return `${filenamePrefix}-manifests.zip`;
  case 'file':
    return `${filenamePrefix}-file.zip`;
  case 'all_files':
    return `${filenamePrefix}.zip`;
  default:
    console.error('Unknown file category passed into GenerateFilename(): ', fileCategory);
    return '';
  }
};

export default GenerateFilename;
