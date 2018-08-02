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

BaseWrapper.propTypes = {
  className: PropTypes.string,
};

BaseWrapper.defaultProps = {
  className: '',
};

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
}) => (
  <Wrapper style={style} className={className}>
    <AggsState
      api={api}
      projectId={projectId}
      graphqlField={graphqlField}
      render={(aggsState) => {
        const aggs = aggsState.aggs.filter(x => x.show);
        // Dividing data into tabs
        const tabs = [];
        filterConfig.tabs.forEach((tab, i) => {
          const sections = [];
          tab.fields.forEach((field) => {
            const section = aggs.find(agg => agg.field === field);
            if (section) {
              sections.push(section);
            }
          });
          tabs.push(
            /* eslint-disable */
            <AggsQuery
              key={i}
              api={api}
              debounceTime={300}
              projectId={projectId}
              index={graphqlField}
              sqon={sqon}
              aggs={sections}
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
                  .map((agg) => {
                    if (aggComponents[agg.type]) {
                      return (aggComponents[agg.type]({ ...agg, ...componentProps }));
                    }
                    return null;
                  })
              }
            />,
            /* eslint-enable */
          );
        });
        return (
          <FilterGroup tabs={tabs} filterConfig={filterConfig} />
        );
      }
      }
    />
  </Wrapper>
);

AggregationTabs.propTypes = {
  className: PropTypes.string,
  onTermSelected: PropTypes.func,
  setSQON: PropTypes.func.isRequired,
  filterConfig: PropTypes.object.isRequired,
  sqon: PropTypes.object,
  projectId: PropTypes.string.isRequired,
  graphqlField: PropTypes.string.isRequired,
  api: PropTypes.func.isRequired,
  style: PropTypes.object,
  Wrapper: PropTypes.func,
  containerRef: PropTypes.string,
  componentProps: PropTypes.object,
};

AggregationTabs.defaultProps = {
  className: '',
  onTermSelected: () => {},
  sqon: null,
  style: null,
  Wrapper: BaseWrapper,
  containerRef: null,
  componentProps: null,
};

export default AggregationTabs;
