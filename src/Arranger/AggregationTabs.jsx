import React from 'react';
import PropTypes from 'prop-types';
import { AggsState, AggsQuery } from '@arranger/components/dist/Aggs';
import aggComponents from '@arranger/components/dist/Aggs/aggComponentsMap.js';
import FilterGroup from '../components/filters/FilterGroup/.';

/*
* The AggregationTabs component uses part of the Arranger codebase that
* creates aggregations - Arranger divides the data into fields, and allows the user
* to filter on those fields. We are using it to divide the aggregations into
* the different tabs we need on our filters.
* Tabs and the fields in each tab are specifeied in params.js, and this component
* will use that configuration to divide the aggregations into tabs.
*/

const BaseWrapper = ({ className, ...props }) => (
  <div {...props} className={`aggregations ${className}`} />
);

const AggregationTabs = ({
  filterConfig,
  onTermSelected = () => {},
  setSQON,
  sqon,
  projectId,
  graphqlField,
  className = '',
  style,
  api,
  Wrapper = BaseWrapper,
  containerRef,
  componentProps = {
    getTermAggProps: () => ({}),
    getRangeAggProps: () => ({}),
    getBooleanAggProps: () => ({}),
    getDatesAggProps: () => ({}),
  },
}) => {
  return (
    <Wrapper style={style} className={className}>
      <AggsState
        api={api}
        projectId={projectId}
        graphqlField={graphqlField}
        render={aggsState => {
          const aggs = aggsState.aggs.filter(x => x.show);
          // Dividing data into tabs
          let tabs = [];
          filterConfig.tabs.map((tab, i) => {
            const tabAggs = aggs.filter(agg => tab.fields.includes(agg.field));
            tabs.push(
              <AggsQuery
                key={i}
                api={api}
                debounceTime={300}
                projectId={projectId}
                index={graphqlField}
                sqon={sqon}
                aggs={tabAggs}
                render={({ data }) =>
                  data &&
                  aggs
                    .map(agg => ({
                      ...agg,
                      ...data[graphqlField].aggregations[agg.field],
                      ...data[graphqlField].extended.find(
                        x => x.field.replace(/\./g, '__') === agg.field,
                      ),
                      onValueChange: ({ sqon, value }) => {
                        onTermSelected(value);
                        setSQON(sqon);
                      },
                      key: agg.field,
                      sqon,
                      containerRef,
                    }))
                    .map(agg => {
                      if (aggComponents[agg.type]) {
                        return (aggComponents[agg.type]({ ...agg, ...componentProps }))
                      }
                    })
                  }
                />
              )
            })
          return (
            <FilterGroup tabs={tabs} filterConfig={filterConfig} />
          )}
        }
      />
    </Wrapper>
  );
};

AggregationTabs.propTypes = {
  filterConfig: PropTypes.object.isRequired,
}

export default AggregationTabs;
