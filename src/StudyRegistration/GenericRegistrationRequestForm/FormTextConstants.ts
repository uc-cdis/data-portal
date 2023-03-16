const StudyRegistrationAccessRequestCopy = {
    title: "Study Registration Access Request",
    description: "Please fill out this form to request and be approved for access to register your study with the HEAL Platform."
  }
  const DataDictionarySubmissionRequest = {
    title: "Data Dictionary Submission Request",
    description: "Please fill out this form to request access to submit data dictionaries to your study on the HEAL Platform."
  }
  export const determineFormText = (path) => {
    if (path.includes('/study-reg/request-access')) {
      return StudyRegistrationAccessRequestCopy;
    }
    return DataDictionarySubmissionRequest;
  }
