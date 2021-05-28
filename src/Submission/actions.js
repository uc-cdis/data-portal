import { predictFileType } from '../utils';

export const uploadTSV = (value, type) => (dispatch) => {
  dispatch({ type: 'REQUEST_UPLOAD', file: value, file_type: type });
};

export const updateFormSchema = (formSchema) => ({
  type: 'UPDATE_FORM_SCHEMA',
  formSchema,
});

export const updateFileContent = (value, fileType) => (dispatch) => {
  dispatch({
    type: 'UPDATE_FILE',
    file: value,
    file_type: predictFileType(value, fileType),
  });
};
