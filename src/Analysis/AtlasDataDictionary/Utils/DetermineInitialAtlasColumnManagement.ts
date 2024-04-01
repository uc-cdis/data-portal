import { IColumnManagementData } from '../Interfaces/Interfaces';
import DefaultAtlasColumnManagement from './DefaultAtlasColumnManagement';

const hasSameKeys = (a, b) => {
  // Checks that the keys of two objects match
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};

const hasOnlyBoolValues = (obj:any) => Object.values(obj).every(Boolean);

const columnManagementLocalStorageIsValid = () => {
  const retrievedObject: IColumnManagementData | any = localStorage.getItem('atlasDataDictionaryColumnManagement');
  const parsedRetrievedObject = JSON.parse(retrievedObject);
  return (
    hasSameKeys(parsedRetrievedObject, DefaultAtlasColumnManagement)
    && hasOnlyBoolValues(retrievedObject)
  );
};

const DetermineInitialColumnManagement = () => {
  if (
    localStorage.getItem('atlasDataDictionaryColumnManagement')
    && columnManagementLocalStorageIsValid()
  ) {
    // atlasDataDictionaryColumnManagement is already set & valid,
    // we can return the user's saved settings
    const retrievedObject: IColumnManagementData | any = localStorage.getItem('atlasDataDictionaryColumnManagement');
    return JSON.parse(retrievedObject);
  }
  // we have local storage available,
  // but haven't set a valid columnManagement yet so we set it to default
  localStorage.setItem(
    'atlasDataDictionaryColumnManagement',
    JSON.stringify(DefaultAtlasColumnManagement),
  );
  return DefaultAtlasColumnManagement;
};

export default DetermineInitialColumnManagement;
