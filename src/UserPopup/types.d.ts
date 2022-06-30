export type UserDocument = {
  formatted: string;
  id: number;
  name: string;
  raw: string;
  required: boolean;
  type: string;
  version: number;
};

export type UserRegistrationInput = {
  firstName: string;
  lastName: string;
  institution: string;
  reviewStatus?: {
    [id: number]: boolean;
  };
};
