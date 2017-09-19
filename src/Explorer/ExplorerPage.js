import React from 'react';
import {QueryRenderer, graphql} from 'react-relay';
import environment from '../environment';
import {RelayExplorerComponent} from './component';

const ExplorerPageQuery = graphql`
    query ExplorerPageQuery{
        viewer {
            ...component_viewer
        }
    }
`;

class ExplorerPage extends React.Component {
  render() {
    return (
    <QueryRenderer
      environment={environment}
      query={ExplorerPageQuery}
      variables={{
        selected_projects: [],
        selected_file_types: [],
        selected_file_formats: []
      }}
      render={({error, props}) => {
        if (error) {
          return <div>{error.message}</div>
        } else if (props) {
          return <RelayExplorerComponent viewer={props.viewer}/>}
        return <div>Loading</div>
        }
      }
    />)
  }
}


export default ExplorerPage;
