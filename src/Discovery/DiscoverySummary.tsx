import React from 'react';
import uniq from 'lodash/uniq';
import sum from 'lodash/sum';
import jsonpath from 'jsonpath';
import { DiscoveryConfig } from './DiscoveryConfig';

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
  let fields = jsonpath.query(studies, `$..${field}`);
  // Replace any undefined fields with value 0
  fields = fields.map((item) => (typeof item === 'undefined' ? 0 : item));
  switch (type) {
  case 'sum': {
    // parse any string representation of an integer
    // if it's not a number, return 0 so as not to break the sum
    fields = fields.map((item) => {
      if (typeof item === 'number') {
        return item;
      }
      if (typeof item === 'string') {
        return parseInt(item, 10) || 0;
      }
      return 0;
    });
    return sum(fields).toLocaleString();
  }
  case 'count':
    return uniq(fields).length.toLocaleString();
  default:
    throw new Error(`Misconfiguration error: Unrecognized aggregation type ${type}. Check the 'aggregations' block of the Discovery page config.`);
  }
};

interface Props {
  visibleResources: any[] | null;
  config: DiscoveryConfig;
}

const DiscoverySummary = (props: Props) => (
  <div className='discovery-header__stats-container' id='discovery-summary-statistics'>
    {
      props.config.aggregations.map((aggregation, i) => (
        <React.Fragment key={aggregation.name}>
          { i !== 0 && <div className='discovery-header__stat-border' /> }
          <div className='discovery-header__stats-wrapper' data-aggregation-type={aggregation.name.replace(/\s/g, '')}>
            <div className='discovery-header__stat'>
              <div className='discovery-header__stat-number'>
                {renderAggregation(aggregation, props.visibleResources)}
              </div>
              <div className='discovery-header__stat-label'>
                {aggregation.name}
              </div>
            </div>
          </div>
        </React.Fragment>
      ))
    }
  </div>
);

export default DiscoverySummary;
