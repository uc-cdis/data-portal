import React from 'react';
import { workspaceRegistrationConfig } from '../../localconf';

const defaultEmail = 'heal-support@datacommons.io';

const StudyRegistrationAccessRequest = {
  name: 'StudyRegistration',
  title: 'Study Registration Access Request',
  defaultEmail: 'heal-support@datacommons.io',
  description:
    'Please fill out this form to request and be approved for access to register your study with the HEAL Platform.',
  resultTitle: 'Your access request has been submitted!',
  resultSubtitle: (supportEmail:string) => (
    <div> Thank you for your submission. Requests take up to 1 business day to complete.
      {' '}You will be notified when approved.<br />
      If you do not receive notification within 1 business day
      {' '}of your request, please reach out to
      {' '}<a href={`mailto:${supportEmail || defaultEmail}`}>{supportEmail || defaultEmail}</a>.
    </div>
  ),
  showStudyName: true,
  showGrantNumber: false,
  showDisclaimer: true,
  subjectLine: 'Study registration access request for',
  successRedirectLink: '/discovery',
  successRedirectText: 'Go to Discovery Page',
  pendingRequestText: (supportEmail : string) => (
    <div> There is already a pending request for this user to access this
      {' '}study. We are processing your request. You will be notified when approved.<br />
      If you do not receive notification within 1 business day of your initial request,
      {' '}please reach out to
      {' '}<a href={`mailto:${supportEmail || defaultEmail}`}>{supportEmail || defaultEmail}</a>.
    </div>
  ),

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
  successRedirectLink: '/discovery',
  successRedirectText: 'Go to Discovery Page',
  pendingRequestText: 'There is already a pending request for this study/user combination, please wait while we are processing your request.',
};
const WorkspaceAccessRequest = {
  name: 'WorkspaceAccessRequest',
  title: 'Workspace Access Request',
  description: workspaceRegistrationConfig?.workspaceInfoMessage || 'Please fill out this form to request and be approved for access to workspace.',
  resultTitle: 'Your access request has been submitted!',
  resultSubtitle:
    'Thank you for your submission. Requests take up to 1 business day to complete. Please check back then.',
  showStudyName: false,
  showGrantNumber: true,
  showDisclaimer: false,
  subjectLine: 'Workspace Access Request for Workspace in',
  successRedirectLink: workspaceRegistrationConfig?.successRedirect.link || '/discovery',
  successRedirectText: workspaceRegistrationConfig?.successRedirect.text || 'Go to Discovery Page',
  pendingRequestText: 'There is already a pending request for workspace access for this user. Please wait while we are processing your request',
};
const determineSpecificFormInfo = (path: String) => {
  if (path === '/study-reg/request-access') {
    return StudyRegistrationAccessRequest;
  }
  if (path === '/workspace/request-access') {
    return WorkspaceAccessRequest;
  }
  return DataDictionarySubmissionRequest;
};

export default determineSpecificFormInfo;
