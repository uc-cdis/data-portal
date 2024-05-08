import localStorageAvailable from './localStorageAvailable';
import DefaultColumnManagement from './DefaultColumnManagement';

const hasSameKeys = (a, b) => {
  // Checks that the keys of two objects match
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};

const hasOnlyBoolValues = (obj) => Object.values(obj).every(Boolean);

const columnManagementLocalStorageIsValid = () => {
  const retrievedObject = localStorage.getItem('columnManagement');
  const parsedRetrievedObject = JSON.parse(retrievedObject);
  return (
    hasSameKeys(parsedRetrievedObject, DefaultColumnManagement)
    && hasOnlyBoolValues(retrievedObject)
  );
};

const DetermineInitialColumnManagement = () => {
  console.log('called DetermineInitialColumnManagement', new Date().toLocaleString())
  if (localStorageAvailable()) {
    if (
      localStorage.getItem('columnManagement')
      && columnManagementLocalStorageIsValid()
    ) {
      // columnManagement is already set & valid,
      // we can return the user's saved settings
      const retrievedObject = localStorage.getItem('columnManagement');
      return JSON.parse(retrievedObject);
    }
    // we have local storage available,
    // but haven't set a valid columnManagement yet so we set it to default
    localStorage.setItem(
      'columnManagement',
      JSON.stringify(DefaultColumnManagement),
    );
    return DefaultColumnManagement;
  }
  // localstorage isn't available, just use the default value
  return DefaultColumnManagement;
};

export default DetermineInitialColumnManagement;
