import React from 'react';
import PropTypes from 'prop-types';
import { AggsState, AggsQuery } from '@arranger/components/dist/Aggs';
import aggComponents from '@arranger/components/dist/Aggs/aggComponentsMap.js';
import FilterGroup from '../components/filters/FilterGroup/.';

/*
* The AggregationTabs component divides the Arranger aggregations components into
* tabs - Arranger divides the data into fields, and allows the user
* to filter on those fields. We are using it to divide the aggregations into
* the different tabs we need on our filters.
* Tabs and the fields in each tab are specified in params.js, and this component
* will use that configuration to divide the aggregations into tabs.
*/

class AggregationTabs extends React.Component {
  render() {
    const {
      api,
      className,
      componentProps,
      containerRef,
      filterConfig,
      graphqlField,
      onTermSelected,
      projectId,
      setSQON,
      sqon,
      style,
    } = this.props;
    return (
      <div style={style} className={`aggregations ${className}`}>
        <AggsState
          api={api}
          projectId={projectId}
          graphqlField={graphqlField}
          render={(aggsState) => {
            const aggs = aggsState.aggs.filter(agg => agg.show);
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
                  projectId={projectId}
                  index={graphqlField}
                  aggs={sections}
                  sqon={sqon}
                  debounceTime={300}
                  render={({ data }) =>
                    data &&
                    aggs
                      .map(agg => ({
                        ...agg,
                        ...data[graphqlField].aggregations[agg.field],
                        ...data[graphqlField].extended.find(
                          elt => elt.field.replace(/\./g, '__') === agg.field,
                        ),
                        key: agg.field,
                        containerRef,
                        onValueChange: ({ sqon, value }) => {
                          onTermSelected(value);
                          setSQON(sqon);
                        },
                        sqon,
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
      </div>
    );
  }
}

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
  containerRef: PropTypes.string,
  componentProps: PropTypes.object,
};

AggregationTabs.defaultProps = {
  className: '',
  onTermSelected: () => {},
  sqon: null,
  style: null,
  containerRef: null,
  componentProps: {
    getTermAggProps: () => ({}),
    getRangeAggProps: () => ({}),
    getBooleanAggProps: () => ({}),
    getDatesAggProps: () => ({}),
  },
};

export default AggregationTabs;
