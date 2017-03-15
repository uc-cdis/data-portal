import { submissionapi_path } from '../localconf';

export const get_submit_path = (project) => {
  let path =project.split('-');
  let program_name = path[0];
  let project_code = path.slice(1).join('-');
  return submissionapi_path + '/' +  program_name + '/' + project_code;
}

export const json_to_string = (data) => {
  let replacer = (key, value) => {
    if (value == null) {
        return undefined;
      }
    return value;
  }
  return JSON.stringify(data, replacer, '  ');
}
