import React, {Component} from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import {GQLHelper} from './gqlHelper.js';

class FileCountComponent extends Component {
  render() {
    return (
      <Count>{ this.props.data }</Count>
    );
  }
}
const gqlHelper = GQLHelper.getGQLHelper();

export const RelayFileCountComponent = createFragmentContainer(
  FileCountComponent,
  graphql`
      fragment FileCount on viewer {
          () => gqlHelper.numFilesTotalFragment
      }
  `
);
