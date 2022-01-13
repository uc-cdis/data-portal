import PropTypes from 'prop-types';

const countProps = {
  counts_search: PropTypes.objectOf(PropTypes.number),
  links_search: PropTypes.objectOf(PropTypes.number),
};

const fileProps = {
  file: PropTypes.string,
  file_type: PropTypes.string,
};

const relayProps = {
  countNames: PropTypes.arrayOf(PropTypes.string),
  lastestDetailsUpdating: PropTypes.number,
  lastestListUpdating: PropTypes.number,
  projectsByName: PropTypes.object,
  summaryCounts: PropTypes.objectOf(PropTypes.number),
  transactions: PropTypes.arrayOf(PropTypes.object),
  error: PropTypes.any,
};

const searchProps = {
  search_form: PropTypes.any,
  search_result: PropTypes.objectOf(PropTypes.object),
  search_status: PropTypes.string,
};

const submissionProps = {
  submit_counter: PropTypes.number,
  submit_entity_counts: PropTypes.objectOf(PropTypes.number),
  submit_result: PropTypes.any,
  submit_result_string: PropTypes.string,
  submit_status: PropTypes.number,
  submit_total: PropTypes.number,
};

const unmappedFileProps = {
  filesToMap: PropTypes.arrayOf(PropTypes.object),
  unmappedFileCount: PropTypes.number,
  unmappedFiles: PropTypes.arrayOf(PropTypes.object),
  unmappedFileSize: PropTypes.number,
};

// eslint-disable-next-line import/prefer-default-export
export const SubmissionStateType = PropTypes.exact({
  dictionary: PropTypes.object,
  file_nodes: PropTypes.arrayOf(PropTypes.string),
  formSchema: PropTypes.object,
  nodeTypes: PropTypes.arrayOf(PropTypes.string),
  ...countProps,
  ...fileProps,
  ...relayProps,
  ...searchProps,
  ...submissionProps,
  ...unmappedFileProps,
});
