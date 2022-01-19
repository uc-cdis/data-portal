import type { SubmissionSearchState } from '../Submission/types';

export type QueryNode = {
  submitter_id: string;
  [x: string]: any;
};

export type QueryNodeState = {
  delete_error: any;
  stored_node_info: string;
  query_node: QueryNode;
} & SubmissionSearchState;
