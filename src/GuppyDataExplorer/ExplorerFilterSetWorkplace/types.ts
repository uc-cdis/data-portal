import type { ExplorerFilter, ExplorerFilterSet } from '../types';

export type UnsavedExplorerFilterSet = Pick<ExplorerFilterSet, 'filter'>;

export type FilterSetWorkspaceState = {
  [key: string]: ExplorerFilterSet | UnsavedExplorerFilterSet;
};

type FilterSetWorkspaceActionCallback = (args: {
  id: string;
  filter: ExplorerFilter;
}) => void;

type FilterSetWorkspaceCreactAction = {
  type: 'CREATE';
  payload: {
    callback?: FilterSetWorkspaceActionCallback;
  };
};

type FilterSetWorkspaceDuplicateAction = {
  type: 'DUPLICATE';
  payload: {
    id: string;
    callback?: FilterSetWorkspaceActionCallback;
  };
};

type FilterSetWorkspaceRemoveAction = {
  type: 'REMOVE';
  payload: {
    id: string;
    callback?: FilterSetWorkspaceActionCallback;
  };
};

type FilterSetWorkspaceUpdateAction = {
  type: 'UPDATE';
  payload: {
    id: string;
    filter: ExplorerFilter;
    callback?: FilterSetWorkspaceActionCallback;
  };
};

export type FilterSetWorkspaceAction =
  | FilterSetWorkspaceCreactAction
  | FilterSetWorkspaceDuplicateAction
  | FilterSetWorkspaceRemoveAction
  | FilterSetWorkspaceUpdateAction;
