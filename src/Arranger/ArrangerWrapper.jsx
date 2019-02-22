import React from 'react';
import PropTypes from 'prop-types';
import { Arranger } from '@arranger/components/dist/Arranger';
import { AggsState, AggsQuery } from '@arranger/components/dist/Aggs';
import arrangerApi from './utils';

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
  filterAggregationFields = (aggs) => {
    if (this.props.charts) {
      const fields = aggs.filter(agg => Object.keys(this.props.charts).includes(agg.field));
      if (fields.length > 0) {
        return fields;
      } else if (aggs.length > 0) { // else all the aggs were filtered, and things are screwed up
        console.log('Bad props.charts data - ignoring in aggregations filters'); // eslint-disable-line no-console
      }
    }
    return aggs.filter(agg => agg.field !== 'name');
  };

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
        api={arrangerApi}
        render={arrangerArgs => (
          <AggsState
            {...arrangerArgs}
            api={arrangerApi}
            render={stateArgs => (
              <AggsQuery
                api={arrangerApi}
                debounceTime={300}
                projectId={arrangerArgs.projectId}
                index={arrangerArgs.graphqlField}
                sqon={arrangerArgs.sqon}
                aggs={this.filterAggregationFields(stateArgs.aggs)}
                render={({ data }) => (
                  <React.Fragment>
                    {this.renderComponent({ ...arrangerArgs, arrangerData: data })}
                  </React.Fragment>
                )}
              />
            )
            }


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
  charts: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

ArrangerWrapper.defaultProps = {
  charts: null,
};

export default ArrangerWrapper;
