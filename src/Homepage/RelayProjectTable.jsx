import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { GQLHelper } from '../gqlHelper.js';
import { getReduxStore } from '../reduxStore.js';
import environment from '../environment';
import { ProjectTable, ProjectTR } from './ProjectTable.jsx';


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
  /*
   * Overrides rowRender in ProjectTable parent class
   * @param {Object} proj 
   *
  rowRender(proj) {
    return <Relay.Renderer key={proj.name}
      Container={RelayProjectTR}
      queryConfig={new ProjectRoute({ name: proj.name })}
      environment={environment}
      render={({ done, error, props, retry, stale }) => {
        if (error) {
          return <tr><td><b>Error! {error}</b></td></tr>;
        } else if (props && props.viewer) {
          return <RelayProjectTR {...props} />;
        } else {
          return <tr><td><b>Loading - put a spinner here?</b></td></tr>;
        }
      }}
    />;   
  }
  */


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
          console.log('RelayProjectTable got props: ', props);
          const { fileCount } = GQLHelper.extractFileInfo(props);
          const proj = { ...props.project[0], caseCount: props.caseCount, aliquotCount: props.aliquotCount, fileCount };

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
        return <tr><td><b>Loading - put a spinner here?</b></td></tr>;
      }
      }
    />);
  }
}
