import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { GQLHelper } from '../gqlHelper';
import { getReduxStore } from '../reduxStore';
import environment from '../environment';
import { ProjectTable, ProjectTR } from './ProjectTable';
import Spinner from '../components/Spinner';


const gqlHelper = GQLHelper.getGQLHelper();


/**
 * Little adapter to kick Relay into running a graphql query
 * per project to get all the data we need ...
 * Drops into the ProjectDashboard - which fetches
 * the original project list.
 * Not a normal relay fragment container.
 * Overrides rowRender in ProjectTable parent class to fetch row data via Relay QueryRender.
 * Assumes higher level container injects the original undetailed list of projects.
 * 
 */
export class RelayProjectTable extends ProjectTable {
  /**
   * Overrides rowRender in ProjectTable parent class to fetch row data via Relay QueryRender.
   * 
   * @param {Object} proj 
   */
  rowRender(proj) {
    return (<QueryRenderer
      key={proj.name}
      environment={environment}
      query={
        gqlHelper.projectDetailQuery
      }
      variables={{ name: proj.name }}
      render={({ done, error, props, retry, stale }) => {
        if (error) {
          return <tr><td><b>Error! {error}</b></td></tr>;
        } else if (props && props.project) {
          const { fileCount } = GQLHelper.extractFileInfo(props);
          const proj = { ...props.project[0], experimentCount: props.experimentCount, caseCount: props.caseCount, aliquotCount: props.aliquotCount, fileCount };

          // Update redux store if data is not already there
          getReduxStore().then(
            (store) => {
              const homeState = store.getState().homepage || {};
              let old = {}; // old data already in redux - only dispatch update if we have newer data
              if (homeState.projectsByName) {
                old = homeState.projectsByName[proj.name] || old;
              }

              if (old.experimentCount !== proj.experimentCount || old.caseCount !== proj.caseCount ||
                  old.aliquotCount !== proj.aliquotCount || old.fileCount !== proj.aliquotCount) {
                store.dispatch({ type: 'RECEIVE_PROJECT_DETAIL', data: proj });
              } /* else {
                  console.log( proj.name + " already in Redux store" );
                } */
            },
          ).catch(
            (err) => {
              console.log('WARNING: failed to load redux store', err);
            },
          );

          return <ProjectTR project={proj} />;
        }
        return <tr><td><Spinner /></td></tr>;
      }
      }
    />);
  }
}
