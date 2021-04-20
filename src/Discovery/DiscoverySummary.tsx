import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import sum from 'lodash/sum';

interface AggregationConfig {
    name: string
    field: string
    type: 'sum' | 'count'
}

const renderAggregation = (aggregation: AggregationConfig, studies: any[] | null): string => {
  if (!studies) {
    return '';
  }
  const { field, type } = aggregation;
  const fields = studies.map(s => s[field]);

  switch (type) {
  case 'sum':
    return sum(fields).toLocaleString();
  case 'count':
    return uniq(fields).length.toLocaleString();
  default:
    throw new Error(`Misconfiguration error: Unrecognized aggregation type ${type}. Check the 'aggregations' block of the Discovery page config.`);
  }
};

class DiscoverySummary extends React.Component {
  render() {
    return (
      <div className='discovery-header__stats-container'>
        {
          this.props.config.aggregations.map((aggregation, i) => (
            <React.Fragment key={aggregation.name} >
              { i !== 0 && <div className='discovery-header__stat-border' /> }
              <div className='discovery-header__stat' >
                <div className='discovery-header__stat-number'>
                  {renderAggregation(aggregation, this.props.visibleResources)}
                </div>
                <div className='discovery-header__stat-label'>
                  {aggregation.name}
                </div>
              </div>
            </React.Fragment>
          ))
        }
      </div>
    );
  }
}

DiscoverySummary.propTypes = {
  visibleResources: PropTypes.array,
  config: PropTypes.object,
};

DiscoverySummary.defaultProps = {
  visibleResources: [],
  config: {},
};

export default DiscoverySummary;
