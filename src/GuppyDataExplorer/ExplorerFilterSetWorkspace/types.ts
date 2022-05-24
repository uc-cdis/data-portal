import type { ExplorerFilter, ExplorerFilterSet } from '../types';

export type UnsavedExplorerFilterSet = Pick<ExplorerFilterSet, 'filter' | 'id'>;

export type FilterSetWorkspaceState = {
  [key: string]: ExplorerFilterSet | UnsavedExplorerFilterSet;
};

export type FilterSetWorkspaceActionCallback = (args: {
  id: string;
  filterSet: ExplorerFilterSet | UnsavedExplorerFilterSet;
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

type FilterSetWorkspaceLoadAction = {
  type: 'LOAD';
  payload: {
    id?: string;
    filterSet: ExplorerFilterSet;
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
  | FilterSetWorkspaceLoadAction
  | FilterSetWorkspaceRemoveAction
  | FilterSetWorkspaceUpdateAction;
