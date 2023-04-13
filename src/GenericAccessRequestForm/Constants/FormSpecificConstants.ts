const StudyRegistrationAccessRequest = {
  name: 'StudyRegistration',
  title: 'Study Registration Access Request',
  description:
    'Please fill out this form to request and be approved for access to register your study with the HEAL Platform.',
  resultTitle: 'Your access request has been submitted!',
  resultSubtitle:
    'Thank you for your submission. Requests take up to 1 business day to complete. You will be notified of the status.',
  showStudyName: true,
  showGrantNumber: false,
  showDisclaimer: true,
  subjectLine: 'Study registration access request for',
};
const DataDictionarySubmissionRequest = {
  name: 'DataDictionarySubmissionRequest',
  title: 'Data Dictionary Submission Request',
  description:
    'Please fill out this form to request access to submit data dictionaries to your study on the HEAL Platform.',
  resultTitle: 'Your access request has been submitted!',
  resultSubtitle:
    'Thank you for your submission. Requests take up to 1 business day to complete. You will be notified of the status.',
  showStudyName: true,
  showGrantNumber: false,
  showDisclaimer: true,
  subjectLine: 'Data dictionary submission access request for',
};
const WorkSpaceRegister = {
  name: 'WorkSpaceRegister',
  title: 'Workspace Registration Access Request',
  description: `The HEAL workspace provides a standardized computational environment for accessing and analyzing data from HEAL studies.
    Please fill out this form to request access to the workspace and start computing!`,
  resultTitle: 'Your access request has been submitted!',
  resultSubtitle:
    'Thank you for your submission. Requests take up to 1 business day to complete. Please check back then.',
  showStudyName: false,
  showGrantNumber: true,
  showDisclaimer: false,
  subjectLine: 'Workspace Access Request for Workspace in',
};
const determineSpecificFormInfo = (path: String) => {
  if (path === '/study-reg/request-access') {
    return StudyRegistrationAccessRequest;
  }
  if (path === '/workspace/register') {
    return WorkSpaceRegister;
  }
  return DataDictionarySubmissionRequest;
};

export default determineSpecificFormInfo;
