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
  projectsByName: { [x: string]: { name: string; counts: number[] } };
  summaryCounts: { [x: number]: number };
  transactions: Object[];
  error: any;
};

type SubmissionSearchState = {
  search_form: any;
  search_result: { data: any };
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

export type SubmissionFile = {
  created_date: string;
  did: string;
  file_name: string;
  hashes: Object;
  size: number;
};

type SubmissionUnmappedFileState = {
  filesToMap: SubmissionFile[];
  unmappedFileCount: number;
  unmappedFiles: SubmissionFile[];
  unmappedFileSize: number;
};

export type SubmissionState = {
  dictionary: { [x: string]: any };
  file_nodes: string[];
  formSchema: Object;
  nodeTypes: string[];
} & SubmissionCountState &
  SubmissionFileState &
  SubmissionRelayState &
  SubmissionSearchState &
  SubmissionSubmissionState &
  SubmissionUnmappedFileState;
