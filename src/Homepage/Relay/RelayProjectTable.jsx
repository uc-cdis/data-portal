import React from 'react';
import { QueryRenderer } from 'react-relay';
import { GQLHelper } from '../../gqlHelper';
import getReduxStore from '../../reduxStore';
import environment from '../../environment';
import ProjectTable from '../Redux/ProjectTable';
import ProjectTR from '../Redux/ProjectRow';
import Spinner from '../../components/Spinner';

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
class RelayProjectTable extends ProjectTable {
  /* "class-methods-use-this": [<enabled>, { "exceptMethods": [<...rowRender>] }] */
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
      render={({ error, props }) => {
        if (error) {
          return <tr><td><b>Error! {error}</b></td></tr>;
        } else if (props && props.project) {
          // Pull project data out of Relayjs graphql results passed to render via 'props'
          const { fileCount } = GQLHelper.extractFileInfo(props);
          const projInfo = {
            ...props.project[0],
            countOne: props.countOne,
            countTwo: props.countTwo,
            countThree: props.countThree,
            countFour: props.countFour,
            fileCount,
          };

          // Update redux store if data is not already there
          getReduxStore().then(
            (store) => {
              const homeState = store.getState().homepage || {};
              // old data already in redux - only dispatch update
              // if we have newer data
              let old = {};
              if (homeState.projectsByName) {
                old = homeState.projectsByName[projInfo.name] || old;
              }

              if (old.countOne !== projInfo.countOne
                  || old.countTwo !== projInfo.countTwo
                  || old.countThree !== projInfo.countThree
                  || old.countFour !== projInfo.countFour
                  || old.fileCount !== projInfo.fileCount
              ) {
                store.dispatch({ type: 'RECEIVE_PROJECT_DETAIL', data: projInfo });
              }
            },
          ).catch(
            (err) => {
              /* eslint no-console: ["error", { allow: ["error"] }] */
              console.error('WARNING: failed to load redux store', err);
            },
          );

          return <ProjectTR project={projInfo} />;
        }
        return <tr><td><Spinner /></td></tr>;
      }
      }
    />);
  }
}

export default RelayProjectTable;
