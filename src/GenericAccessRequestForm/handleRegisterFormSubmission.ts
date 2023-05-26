import { doesUserHaveRequestPending } from '../StudyRegistration/utils';
import {
  kayakoConfig, hostname, workspaceRegistrationConfig, requestorPath,
} from '../localconf';
import { fetchWithCreds } from '../actions';
import { createKayakoTicket } from '../utils';

const KAYAKO_MAX_SUBJECT_LENGTH = 255;

const handleRegisterFormSubmission = async (
  specificFormInfo,
  formValues,
  studyUID,
  setFormSubmissionButtonDisabled,
  setFormSubmissionStatus,
  props,
  studyRegistrationAuthZ,
  studyNumber,
  studyName,
  setReqAccessRequestPending,
) => {
  const determineSubjectLine = () => {
    if (specificFormInfo.name === 'WorkspaceAccessRequest') {
      return `${specificFormInfo.subjectLine} ${hostname}`;
    }
    return `${specificFormInfo.subjectLine} ${studyNumber} ${studyName}`;
  };

  // first, check if there is already a pending request in requestor
  let userHaveRequestPending : boolean;
  let policyID : string;
  try {
    if (specificFormInfo.name === 'WorkspaceAccessRequest') {
      policyID = workspaceRegistrationConfig?.workspacePolicyId ? workspaceRegistrationConfig.workspacePolicyId : 'workspace';
      userHaveRequestPending = await doesUserHaveRequestPending(null, policyID);
    } else {
      userHaveRequestPending = await doesUserHaveRequestPending(studyUID);
    }
    if (userHaveRequestPending) {
      // there is already a request for this user on this study, display a message
      // and disable the button
      setFormSubmissionButtonDisabled(true);
      setFormSubmissionStatus({
        status: 'info',
        text: specificFormInfo.pendingRequestText,
      });
      return;
    }
  } catch (err) {
    throw new Error(`Unable to check existing requests: ${err}`);
  }

  // create a request in requestor
  // eslint-disable-next-line camelcase
  let body: { policy_id?: string; username?: any; resource_id?: any; resource_paths?: any[]; role_ids?: string[]; };
  if (specificFormInfo.name === 'WorkspaceAccessRequest') {
    body = {
      policy_id: policyID,
    };
  } else {
    body = {
      username: props.user.username,
      resource_id: studyUID,
      resource_paths: [studyRegistrationAuthZ, '/mds_gateway', '/cedar'],
      role_ids: ['study_registrant', 'mds_user', 'cedar_user'],
    };
  }

  // deepcode ignore Ssrf: studyUID is pulled in from setState into request body,
  // not as URL
  fetchWithCreds({
    path: `${requestorPath}request`,
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(({ data, status }) => {
      if (status === 201) {
        if (data && data.request_id) {
          // request created, now create a kayako ticket
          const fullName = `${formValues['First Name']} ${formValues['Last Name']}`;
          const email = formValues['E-mail Address'];
          let subject = determineSubjectLine();
          if (subject.length > KAYAKO_MAX_SUBJECT_LENGTH) {
            subject = `${subject.substring(
              0,
              KAYAKO_MAX_SUBJECT_LENGTH - 3,
            )}...`;
          }
          let contents = `Request ID: ${data.request_id}\n
              Grant Number: ${studyNumber}\n
              Study Name: ${studyName}\n
              Environment: ${hostname}`;
          if (specificFormInfo.name === 'WorkspaceAccessRequest') {
            contents = `Request ID: ${data.request_id}\nEnvironment: ${hostname}`;
          }

          Object.entries(formValues)
            .filter(([key]) => !key.includes('_doNotInclude'))
            .forEach((entry) => {
              const [key, value] = entry;
              contents = contents.concat(`\n${key}: ${value}`);
            });
          createKayakoTicket(
            subject,
            fullName,
            email,
            contents,
            kayakoConfig?.kayakoDepartmentId,
          ).then(
            () => setFormSubmissionStatus({ status: 'success' }),
            (err) => setFormSubmissionStatus({
              status: 'error',
              text: err.message,
            }),
          );
        } else {
          // eslint-disable-next-line no-console
          console.error(`Requestor returns 201 but no request_id in payload
             body`); // shouldn't get here
        }
      } else {
        // something has gone wrong
        setFormSubmissionStatus({
          status: 'error',
          text: `Failed to create a
           request with error code: ${status}. Please try again later. If the
           error persists, please contact us for help.`,
        });
      }
      setReqAccessRequestPending(false);
    })
    .catch(() => setFormSubmissionStatus({
      status: 'error',
      text: `Failed to create a request.
        Please try again later. If
        the error persists, please contact us for help.`,
    }),
    );
};
export default handleRegisterFormSubmission;
