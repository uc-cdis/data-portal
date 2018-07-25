import React from 'react';
import PropTypes from 'prop-types';
import { esToAggTypeMap } from '@arranger/mapping-utils';
import { localTheme } from '../../src/localconf';

class DataExplorerSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: [],
    }
  }

  getMappingTypeOfField = ({ mapping = {}, field = '' }) => {
    const mappingPath = field.split('__').join('.properties.');
    return esToAggTypeMap[get(mapping, mappingPath).type];
  }

  fetchAggState = () => fetch(
    'http://localhost:5050/v1/graphql',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(
        {
          query: `query aggsStateQuery {
                    subject {
                      mapping
                      aggsState {
                        state {
                          field
                          show
                          active
                        }
                      }
                    }}`
        },
      ),
    }
  ).then(res => res.json()
).then(json => {
    console.log("first call", json);
    this.setState({ temp: json.data.subject.aggsState.state }, () => {
      this.state.temp.map(x => {
        const type =
          this.getMappingTypeOfField({ field: x.field, mapping }) || x.type
        this.fetchBuckets(x, type)
      });
    });
  });

  queryFromAgg = ({ field, type }) =>
      type === 'Aggregations'
        ?
        `{
          subject {
           hits {
             edges {
               node {
                ${field} {
                  buckets {
                    doc_count
                    key_as_string
                    key
                  }
                }
              }
            }
          }
        }
      }
          `
        : `
        {
          subject {
           hits {
             edges {
               node {
          ${field} {
            stats {
              max
              min
              count
              avg
              sum
            }
            histogram(interval: 1.0) {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }
    }
  }
}
          `;

    fetchBuckets = (field, type) => {
      console.log(field, type);
      return fetch(
    'http://localhost:5050/v1/graphql',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(
        {
          query: this.queryFromAgg({ ...field, type })
        }
      ),
    }
  ).then(res => {
    console.log("second call", res);
  });
}

  render() {
    return (
      <div onClick={this.fetchAggState}>summary</div>
    );
  }
}

DataExplorerSummary.propTypes = {
  localTheme: PropTypes.object.isRequired,
};

export default DataExplorerSummary;
