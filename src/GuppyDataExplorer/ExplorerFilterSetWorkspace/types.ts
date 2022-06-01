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
};

export type FilterSetWorkspaceClearAction = {
  type: 'CLEAR';
};

export type FilterSetWorkspaceClearAllAction = {
  type: 'CLEAR-ALL';
  payload: {
    newId: string;
  };
};

export type FilterSetWorkspaceCreateAction = {
  type: 'CREATE';
  payload: {
    newId: string;
  };
};

export type FilterSetWorkspaceDuplicateAction = {
  type: 'DUPLICATE';
  payload: {
    newId: string;
  };
};

export type FilterSetWorkspaceLoadAction = {
  type: 'LOAD';
  payload: {
    newId?: string;
    filterSet: ExplorerFilterSet;
  };
};

export type FilterSetWorkspaceRemoveAction = {
  type: 'REMOVE';
  payload: {
    newId: string;
  };
};

export type FilterSetWorkspaceSaveAction = {
  type: 'SAVE';
  payload: {
    filterSet: ExplorerFilterSet;
  };
};

export type FilterSetWorkspaceUpdateAction = {
  type: 'UPDATE';
  payload: {
    filter: ExplorerFilter;
  };
};

export type FilterSetWorkspaceUseAction = {
  type: 'USE';
  payload: {
    id: string;
  };
};

export type FilterSetWorkspaceAction =
  | FilterSetWorkspaceClearAction
  | FilterSetWorkspaceClearAllAction
  | FilterSetWorkspaceCreateAction
  | FilterSetWorkspaceDuplicateAction
  | FilterSetWorkspaceLoadAction
  | FilterSetWorkspaceRemoveAction
  | FilterSetWorkspaceSaveAction
  | FilterSetWorkspaceUpdateAction
  | FilterSetWorkspaceUseAction;
