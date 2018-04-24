import React from 'react';
import { QueryRenderer } from 'react-relay';
import { GQLHelper } from '../../gqlHelper';
import getReduxStore from '../../reduxStore';
import environment from '../../environment';
import ProjectTable from '../components/ProjectTable';
import ProjectTR from '../components/ProjectRow';
import Spinner from '../../components/Spinner';
import dictIcons from '../../img/icons/index';

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
  rowRender(proj, i) {
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
          let counts = Object.keys(props).filter(
            key => key.indexOf('count') === 0).map(key => key).sort()
            .map(
              key => props[key],
            );
          if (counts.length < 4) {
            counts = [...counts, fileCount];
          }
          const charts = Object.keys(props).filter(
            key => key.indexOf('chart') === 0)
            .map(key => key).sort()
            .map(
              key => props[key],
            );
          const projInfo = {
            ...props.project[0],
            counts,
            charts,
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
              const changed = projInfo.counts.find(
                (it, index) => index > old.counts.length - 1
                  || old.counts[index] !== it,
              );
              if (changed) { store.dispatch({ type: 'RECEIVE_PROJECT_DETAIL', data: projInfo }); }
            },
          ).catch(
            (err) => {
              /* eslint no-console: ["error", { allow: ["error"] }] */
              console.error('WARNING: failed to load redux store', err);
            },
          );
          return <ProjectTR key={projInfo.name} project={projInfo}
                            index={i} dictIcons={dictIcons}/>;
        }
        return <tr><td><Spinner /></td></tr>;
      }
      }
    />);
  }
}

export default RelayProjectTable;
