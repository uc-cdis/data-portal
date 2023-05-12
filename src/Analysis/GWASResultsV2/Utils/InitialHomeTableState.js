import InitialColumnManagement from './InitialColumnManagement';

const localStorageAvailable = () => {
  try {
    localStorage.setItem(1, 1);
    localStorage.removeItem(1);
    return true;
  } catch (e) {
    return false;
  }
};

const hasValidKeys = (a, b) => {
  // Checks that the keys of two objects match
  var aKeys = Object.keys(a).sort();
  var bKeys = Object.keys(b).sort();
  console.log(aKeys);
  console.log(bKeys);
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};
const hasValidValues = (a) => {
  // checks that the values of obj are all booleans
  console.log(Object.values(a).every(Boolean));
  return Object.values(a).every(Boolean);
};

const localStorageIsValid = () => {
  const retrievedObject = localStorage.getItem('columnManagement');
  return (
    hasValidKeys(JSON.parse(retrievedObject), InitialColumnManagement) &&
    hasValidValues(retrievedObject)
  );
};

const determineInitialColumnManagement = () => {
  if (localStorageAvailable()) {
    if (localStorage.getItem('columnManagement') && localStorageIsValid()) {
      // columnManagement is already set, we can return the users saved settings
      const retrievedObject = localStorage.getItem('columnManagement');
      console.log('LOL', JSON.parse(retrievedObject));
      return JSON.parse(retrievedObject);
    } else {
      // we have local storage available,
      // but haven't set columnManagement yet so we set it
      localStorage.setItem(
        'columnManagement',
        JSON.stringify(InitialColumnManagement)
      );
      return InitialColumnManagement;
    }
  } else {
    // localstorage isn't available, just use the initial value
    return InitialColumnManagement;
  }
};

const InitialHomeTableState = {
  nameSearchTerm: '',
  wfNameSearchTerm: '',
  submittedAtSelections: [],
  finishedAtSelections: [],
  jobStatusSelections: [],
  sortInfo: {},
  currentPage: 1,
  columnManagement: determineInitialColumnManagement(),
  useLocalStorage: localStorageAvailable(),
};

export default InitialHomeTableState;
