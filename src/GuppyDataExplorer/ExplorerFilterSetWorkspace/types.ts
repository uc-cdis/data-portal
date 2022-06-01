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

type FilterSetWorkspaceClearAction = {
  type: 'CLEAR';
  payload: undefined;
};

type FilterSetWorkspaceClearAllAction = {
  type: 'CLEAR-ALL';
  payload: {
    newId: string;
  };
};

type FilterSetWorkspaceCreactAction = {
  type: 'CREATE';
  payload: {
    newId: string;
  };
};

type FilterSetWorkspaceDuplicateAction = {
  type: 'DUPLICATE';
  payload: {
    newId: string;
  };
};

type FilterSetWorkspaceLoadAction = {
  type: 'LOAD';
  payload: {
    newId?: string;
    filterSet: ExplorerFilterSet;
  };
};

type FilterSetWorkspaceSaveAction = {
  type: 'SAVE';
  payload: {
    filterSet: ExplorerFilterSet;
  };
};

type FilterSetWorkspaceRemoveAction = {
  type: 'REMOVE';
  payload: {
    newId: string;
  };
};

type FilterSetWorkspaceUpdateAction = {
  type: 'UPDATE';
  payload: {
    filter: ExplorerFilter;
  };
};

type FilterSetWorkspaceUseAction = {
  type: 'USE';
  payload: {
    id: string;
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
