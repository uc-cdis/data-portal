import { ResultStatusType } from 'antd/lib/result';

interface User {
    username: string
}

export interface StudyRegistrationProps {
    user: User;
    userAuthMapping: any;
    supportEmail: string;
}
export interface FormSubmissionState {
    status?: ResultStatusType;
    text?: string;
}
