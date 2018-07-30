import React from 'react';
import PropTypes from 'prop-types';
import { Arranger } from '@arranger/components/dist/Arranger';
import { AggsState, AggsQuery } from '@arranger/components/dist/Aggs';

/*
* The ArrangerWrapper component can be used to get props and data from Arranger
* into our custom components. It will pass props and data to all the children
* that it is wrapped around, so for example:
*     <ArrangerWrapper>
*          <div>Hello world!</div>
*     </ArrangerWrapper>
* The <div> would now have all the Arranger props as well as access to the queried data.
* Most Arranger components need all of these props. They include:
* api - a function created by Arranger to fetch data.
* arrangerData - a custom prop added so our components can use the Arranger data.
* fetchData - a function created by Arranger for the data table (if present).
* graphqlField - the field Arranger should query.
* index - the index Arranger should query.
* projectId - the projectId used in the graphQL API call.
* selectedTableRows - the selected rows in the data table (if present).
* setSQON - a function from Arranger used to update SQON when filters are selected.
* setSelectedTableRows - a function from Arranger to updated selected data table rows (if present).
* socket - a function from Arranger in which they use web sockets.
* sqon - the current SQON being used to query.
*/

class ArrangerWrapper extends React.Component {
  renderComponent = props => (
    React.Children.map(this.props.children, child =>
      React.cloneElement(child, { ...props },
      ),
    )
  );

  render() {
    return (
      <Arranger
        index={this.props.index}
        graphqlField={this.props.graphqlField}
        projectId={this.props.projectId}
        render={arrangerArgs => (
          <AggsState
            {...arrangerArgs}
            render={stateArgs => (
              <AggsQuery
                api={arrangerArgs.api}
                debounceTime={300}
                projectId={arrangerArgs.projectId}
                index={arrangerArgs.graphqlField}
                sqon={arrangerArgs.sqon}
                aggs={stateArgs.aggs.filter(agg => agg.field !== 'name')}
                render={({ data }) => (
                  <React.Fragment>
                    {this.renderComponent({ ...arrangerArgs, arrangerData: data })}
                  </React.Fragment>
                )}
              />
            )}
          />
        )}
      />
    );
  }
}

ArrangerWrapper.propTypes = {
  index: PropTypes.string.isRequired,
  graphqlField: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default ArrangerWrapper;
