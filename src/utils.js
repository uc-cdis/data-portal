import React from 'react';
import { submissionapi_path } from './localconf';
import { Box } from './theme';
import Nav from './Nav/component';
import { AuthTimeoutPopup } from './Popup/component';

export const get_submit_path = (project) => {
  let path = project.split('-');
  let program_name = path[0];
  let project_code = path.slice(1).join('-');
  return submissionapi_path + '/' +  program_name + '/' + project_code;
};

export const json_to_string = (data) => {
  let replacer = (key, value) => {
    if (value == null) {
        return undefined;
      }
    return value;
  }
  return JSON.stringify(data, replacer, '  ');
};

export const predict_file_type = (data, file_type) => {
  let predict_type = file_type;
  let json_type = 'application/json';
  let tsv_type = 'text/tab-separated-values';

  if (data.indexOf('{') != -1 || data.indexOf('}') != -1) {
     predict_type = json_type;
  }
  if (data.indexOf('\t') != -1) {
    predict_type = tsv_type;
  }
  return predict_type;
}

export const withBoxAndNav = (Component) => {
  return ({...props}) => (
    <Box>
      <Nav />
      <Component {...props} />
    </Box>
  )
};

export const withAuthTimeout = (Component) => {
  return ({...props}) => (
    <div>
      <AuthTimeoutPopup />
      <Component {...props} />
    </div>
  )
};
