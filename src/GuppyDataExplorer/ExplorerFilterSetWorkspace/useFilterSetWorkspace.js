import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  clearWorkspaceAllFilterSets,
  clearWorkspaceFilterSet,
  createWorkspaceFilterSet,
  duplicateWorkspaceFilterSet,
  loadWorkspaceFilterSet,
  removeWorkspaceFilterSet,
  useWorkspaceFilterSet,
} from '../../redux/explorer/slice';
import { workspacesSessionStorageKey } from '../../redux/explorer/utils';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */
/** @typedef {import("../types").ExplorerFilterSet} ExplorerFilterSet */

export default function useFilterSetWorkspace() {
  const dispatch = useAppDispatch();
  const explorerId = useAppSelector((s) => s.explorer.explorerId);
  const workspaces = useAppSelector((s) => s.explorer.workspaces);

  const location = useLocation();
  useEffect(() => {
    // inject filter value passed via router
    /** @type {{ filter?: ExplorerFilter }} */
    const locationState = location.state;
    if (locationState?.filter !== undefined)
      dispatch(loadWorkspaceFilterSet({ filter: locationState.filter }));
  }, []);

  useEffect(() => {
    // sync browser store with workspace state
    const json = JSON.stringify(workspaces);
    window.sessionStorage.setItem(workspacesSessionStorageKey, json);
  }, [workspaces]);

  return useMemo(
    () => ({
      ...workspaces[explorerId],
      size: Object.keys(workspaces[explorerId].all).length,
      clear() {
        dispatch(clearWorkspaceFilterSet());
      },
      clearAll() {
        dispatch(clearWorkspaceAllFilterSets());
      },
      create() {
        dispatch(createWorkspaceFilterSet());
      },
      duplicate() {
        dispatch(duplicateWorkspaceFilterSet());
      },
      load(filterSet) {
        dispatch(loadWorkspaceFilterSet(filterSet));
      },
      remove() {
        dispatch(removeWorkspaceFilterSet());
      },
      use(id) {
        dispatch(useWorkspaceFilterSet(id));
      },
    }),
    [workspaces, explorerId]
  );
}
