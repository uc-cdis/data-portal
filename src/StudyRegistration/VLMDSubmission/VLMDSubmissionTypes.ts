export interface VLMDSubmissionProps {
    studyUID?: string | Number;
    studyNumber?: string;
    studyName?: string;
    studyRegistrationAuthZ?: string;
    userHasAccessToSubmit: boolean;
    disableCDESubmissionForm: boolean;
}
