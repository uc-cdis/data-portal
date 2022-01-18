type SubmissionCountState = {
  counts_search: { [x: string]: number };
  links_search: { [x: string]: number };
};

type SubmissionFileState = {
  file: string;
  file_type: string;
};

type SubmissionRelayState = {
  countNames: string[];
  lastestDetailsUpdating: number;
  lastestListUpdating: number;
  projectsByName: Object;
  summaryCounts: { [x: number]: number };
  transactions: Object[];
  error: any;
};

type SubmissionSearchState = {
  search_form: any;
  search_result: { data: Object };
  search_status: string;
};

type SubmissionSubmissionState = {
  submit_counter: number;
  submit_entity_counts: { [x: string]: number };
  submit_result: any;
  submit_result_string: string;
  submit_status: number;
  submit_total: number;
};

type SubmissionUnmappedFileState = {
  filesToMap: Object[];
  unmappedFileCount: number;
  unmappedFiles: Object[];
  unmappedFileSize: number;
};

export type SubmissionState = {
  dictionary: Object;
  file_nodes: string[];
  formSchema: Object;
  nodeTypes: string[];
} & SubmissionCountState &
  SubmissionFileState &
  SubmissionRelayState &
  SubmissionSearchState &
  SubmissionSubmissionState &
  SubmissionUnmappedFileState;
