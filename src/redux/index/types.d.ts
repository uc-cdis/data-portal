export type ConsortiumCountsData = {
  consortium: string;
  [count: string]: number;
};

export type OverviewCounts = {
  names: string[];
  data: {
    [key: string]: {
      [count: string]: number;
    };
  };
};

export type ProjectCounts = {
  code: string;
  counts: number[];
};

export type IndexState = {
  countNames: string[];
  overviewCounts: OverviewCounts;
  projectList: ProjectCounts[];
  updatedAt: number;
};
