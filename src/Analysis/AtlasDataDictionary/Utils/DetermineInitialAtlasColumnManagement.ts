import DefaultAtlasColumnManagement from './DefaultAtlasColumnManagement';

const hasSameKeys = (a, b) => {
  // Checks that the keys of two objects match
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};

const hasOnlyBoolValues = (obj) => Object.values(obj).every(Boolean);

const columnManagementLocalStorageIsValid = () => {
  const retrievedObject: any = localStorage.getItem('columnManagement');
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
    // columnManagement is already set & valid,
    // we can return the user's saved settings
    const retrievedObject: any = localStorage.getItem('columnManagement');
    return JSON.parse(retrievedObject);
  }
  // we have local storage available,
  // but haven't set a valid columnManagement yet so we set it to default
  localStorage.setItem(
    'columnManagement',
    JSON.stringify(DefaultAtlasColumnManagement),
  );
  return DefaultAtlasColumnManagement;
};

export default DetermineInitialColumnManagement;
