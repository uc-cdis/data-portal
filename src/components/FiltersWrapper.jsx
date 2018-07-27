import React from 'react';

import { AggsState, AggsQuery } from '@arranger/components/dist/Aggs';
import aggComponents from '@arranger/components/dist/Aggs/aggComponentsMap.js';
import FilterGroup from '../components/filters/FilterGroup/.';

const BaseWrapper = ({ className, ...props }) => (
  <div {...props} className={`aggregations ${className}`} />
);

const transformTabs = (tabs) => {
  console.log('tabs', tabs);
  return tabs;
}

// TODO compare to ArrangerWrapper
const FiltersWrapper = ({
  filters,
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
          let tabs = [];
          filters.tabs.map((tab, i) => {
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
            <FilterGroup tabs={tabs} filterConfig={filters}/>
          )}
        }
      />
    </Wrapper>
  );
};

export default FiltersWrapper;
