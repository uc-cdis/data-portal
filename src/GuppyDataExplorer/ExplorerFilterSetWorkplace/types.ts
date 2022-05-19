import type { ExplorerFilter } from '../types';

export type FilterSetWorkspaceState = { [key: string]: ExplorerFilter };

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
