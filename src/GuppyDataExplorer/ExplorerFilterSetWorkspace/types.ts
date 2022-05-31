import type { ExplorerFilter, ExplorerFilterSet } from '../types';

export type UnsavedExplorerFilterSet = Pick<
  ExplorerFilterSet,
  'filter' | 'id'
> & {
  name?: never;
  description?: never;
};

export type FilterSetWorkspaceState = {
  active: {
    filterSet: ExplorerFilterSet | UnsavedExplorerFilterSet;
    id: string;
  };
  all: {
    [id: string]: ExplorerFilterSet | UnsavedExplorerFilterSet;
  };
  size: number;
};

export type FilterSetWorkspaceActionCallback = (args: {
  id: string;
  filterSet: ExplorerFilterSet | UnsavedExplorerFilterSet;
}) => void;

type FilterSetWorkspaceClearAction = {
  type: 'CLEAR';
  payload: {
    callback?: FilterSetWorkspaceActionCallback;
  };
};

type FilterSetWorkspaceClearAllAction = {
  type: 'CLEAR-ALL';
  payload: {
    id: string;
    callback?: FilterSetWorkspaceActionCallback;
  };
};

type FilterSetWorkspaceCreactAction = {
  type: 'CREATE';
  payload: {
    id: string;
    callback?: FilterSetWorkspaceActionCallback;
  };
};

type FilterSetWorkspaceDuplicateAction = {
  type: 'DUPLICATE';
  payload: {
    newId: string;
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

type FilterSetWorkspaceSaveAction = {
  type: 'SAVE';
  payload: {
    filterSet: ExplorerFilterSet;
    callback?: FilterSetWorkspaceActionCallback;
  };
};

type FilterSetWorkspaceRemoveAction = {
  type: 'REMOVE';
  payload: {
    newId: string;
    callback?: FilterSetWorkspaceActionCallback;
  };
};

type FilterSetWorkspaceUpdateAction = {
  type: 'UPDATE';
  payload: {
    filter: ExplorerFilter;
    callback?: FilterSetWorkspaceActionCallback;
  };
};

type FilterSetWorkspaceUseAction = {
  type: 'USE';
  payload: {
    id: string;
    callback?: FilterSetWorkspaceActionCallback;
  };
};

export type FilterSetWorkspaceAction =
  | FilterSetWorkspaceClearAction
  | FilterSetWorkspaceClearAllAction
  | FilterSetWorkspaceCreactAction
  | FilterSetWorkspaceDuplicateAction
  | FilterSetWorkspaceLoadAction
  | FilterSetWorkspaceSaveAction
  | FilterSetWorkspaceRemoveAction
  | FilterSetWorkspaceUpdateAction
  | FilterSetWorkspaceUseAction;
