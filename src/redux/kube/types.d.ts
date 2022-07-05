export type KubeState = {
  job: {
    status: string;
    uid: string;
  };
  jobStatusInterval: number;
  resultURL: string;
};
