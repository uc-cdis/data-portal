import React from 'react';
import { Arranger, CurrentSQON, Aggregations } from '@arranger/components/dist/Arranger';
import { AggsState, AggsQuery } from '@arranger/components/dist/Aggs';
import { flattenAggregations } from '@arranger/middleware';
import DataExplorerTable from '../components/tables/DataExplorerTable/.';
import DataExplorerSummary from '../DataExplorer/DataExplorerSummary';
import SummaryChartGroup from '../components/charts/SummaryChartGroup';
import { components } from '../params';
import { fetchDataForArrangerTable } from '../actions';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  render() {
    const tableProperties = components.dataExplorerTableProperties;
    return (
      <Arranger
        index={''}
        graphqlField={'subject'}
        projectId={'search'}
        render={arrangerArgs => {
          console.log("arragerArgs", arrangerArgs);
          return (
            <div className='data-explorer'>
              <div className='data-explorer__filters'>
                <Aggregations {...arrangerArgs} />
              </div>
              <div className='data-explorer__results'>
                <div>
                  <AggsState
                    {...arrangerArgs}
                    render={args => {

                      const aggs = args.aggs.filter(agg => (agg.field != "study" && agg.field != "project" && agg.field != "name"))
                      console.log(aggs);
                      return (
                        <div>
                          <p>AggsState</p>
                          <AggsQuery
                            api={arrangerArgs.api}
                            debounceTime={300}
                            projectId={arrangerArgs.projectId}
                            index={arrangerArgs.graphqlField}
                            sqon={arrangerArgs.sqon}
                            aggs={aggs}
                            render={({ data }) => {
                              console.log("data", data);
                              return(
                                <div>AggsQuery</div>
                              )
                            }}
                          />
                        </div>
                      )
                    }}
                  />
                </div>
                <CurrentSQON {...arrangerArgs} />
                <DataExplorerTable {...arrangerArgs} />
              </div>
            </div>
          );
        }}
      />
    );
  }
}

export default DataExplorer;
