import type { ExplorerFilter } from '../types';

export type QueryState = { [key: string]: ExplorerFilter };

export type QueryStateActionCallback = (args: {
  id: string;
  filter: ExplorerFilter;
}) => void;

type QueryStateCreactAction = {
  type: 'CREATE';
  payload: {
    callback?: QueryStateActionCallback;
  };
};

type QueryStateDuplicateAction = {
  type: 'DUPLICATE';
  payload: {
    id: string;
    callback?: QueryStateActionCallback;
  };
};

type QueryStateRemoveAction = {
  type: 'REMOVE';
  payload: {
    id: string;
    callback?: QueryStateActionCallback;
  };
};

type QueryStateUpdateAction = {
  type: 'UPDATE';
  payload: {
    id: string;
    filter: ExplorerFilter;
    callback?: QueryStateActionCallback;
  };
};

export type QueryStateAction =
  | QueryStateCreactAction
  | QueryStateDuplicateAction
  | QueryStateRemoveAction
  | QueryStateUpdateAction;
