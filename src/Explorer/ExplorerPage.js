import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../environment';
import { RelayExplorerComponent } from './component';
import { GQLHelper } from '../gqlHelper';
import Spinner from '../components/Spinner';

const gqlHelper = GQLHelper.getGQLHelper();


class ExplorerPage extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={gqlHelper.explorerPageQuery}
        variables={{
          selected_projects: [],
          selected_file_types: [],
          selected_file_formats: [],
        }}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          } else if (props) {
            return <RelayExplorerComponent viewer={props.viewer} />;
          }
          return <Spinner />;
        }
        }
      />);
  }
}


export default ExplorerPage;
