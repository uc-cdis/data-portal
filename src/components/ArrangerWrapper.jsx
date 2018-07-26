import React from 'react';
import PropTypes from 'prop-types';
import { Arranger } from '@arranger/components/dist/Arranger';
import { AggsState, AggsQuery } from '@arranger/components/dist/Aggs';

class ArrangerWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.renderComponent = this.renderComponent.bind(this);
  }

  renderComponent(props) {
    return React.Children.map(this.props.children, child => React.cloneElement(child, {
      ...props,
    }));
  }

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
                aggs={stateArgs.aggs.filter(agg => agg.field != 'name')}
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
};

export default ArrangerWrapper;
