import React from 'react';
import FileSaver from 'file-saver';
import { fetchWithCreds } from '../actions';
import {
  guppyGraphQLUrl,
  arrangerGraphqlPath,
  useGuppyForExplorer,
  guppyDownloadUrl,
  analysisApps,
} from '../localconf';

class HIVCohortFilterCase extends React.Component {
  // Base class for the 3 NDH cohort filter apps. Meant to facilitate code reuse
  static performQuery(query, variableString, useGraphQLEndpoint) {
    if (useGraphQLEndpoint || !useGuppyForExplorer) {
      const graphqlUrl = useGuppyForExplorer
        ? guppyGraphQLUrl
        : arrangerGraphqlPath;
      return fetchWithCreds({
        path: `${graphqlUrl}`,
        body: variableString
          ? JSON.stringify({
              query,
              variables: JSON.parse(variableString),
            })
          : JSON.stringify({
              query,
            }),
        method: 'POST',
      }).then(
        ({ status, data }) => data // eslint-disable-line no-unused-vars
      );
    }

    return fetchWithCreds({
      path: `${guppyDownloadUrl}`,
      body: JSON.stringify(query),
      method: 'POST',
    }).then(
      ({ status, data }) => data // eslint-disable-line no-unused-vars
    );
  }

  static makeSubjectToVisitMap(followUps) {
    // Convert to dictionary:
    // { subject_id -> [ array of visits sorted by visit_harmonized_number ] }
    const subjectToVisitMap = {};
    for (let i = 0; i < followUps.length; i += 1) {
      const subjectId = followUps[i].subject_id;
      if (subjectId in subjectToVisitMap) {
        subjectToVisitMap[subjectId].push(followUps[i]);
      } else {
        subjectToVisitMap[subjectId] = [followUps[i]];
      }
    }

    // Sort each patient's visits by visit_harmonized_number
    Object.keys(subjectToVisitMap).forEach((key) => {
      const subjectVisits = subjectToVisitMap[key];
      if (subjectVisits.length > 1) {
        subjectVisits.sort((a, b) => {
          if (a.harmonized_visit_number > b.harmonized_visit_number) {
            return 1;
          }
          return b.harmonized_visit_number > a.harmonized_visit_number ? -1 : 0;
        });
        subjectToVisitMap[key] = subjectVisits;
      }
    });

    return subjectToVisitMap;
  }

  constructor(props) {
    super(props);
    this.state = {
      inLoadingState: false,
      isReadyToCalculate: false,
      resultAlreadyCalculated: false,
      therapyValuesOfInterest: ['HAART', 'Potent ART'],
      visitIndexTypeName: analysisApps.ndhHIV.visitIndexTypeName || 'follow_up',
    };
  }

  getFollowUpsWithHIV = async () => {
    const keyName = 'subject_id';
    const keyCountMap = await this.getBucketByKey(keyName);
    let batchCounts = 0;
    const promiseList = [];
    let keyRange = [];
    Object.keys(keyCountMap).forEach((keyId) => {
      const count = keyCountMap[keyId];
      if (batchCounts + count > 5000) {
        // query this batch for follow ups
        promiseList.push(
          this.getFollowupsBuckets(keyName, keyRange).then((res) => res)
        );

        // reset batch
        batchCounts = count;
        keyRange = [];
      }
      batchCounts += count;
      keyRange.push(keyId);
    });
    promiseList.push(
      this.getFollowupsBuckets(keyName, keyRange).then((res) => res)
    );

    let mergedFollowUps = [];
    const resultList = await Promise.all(promiseList);
    resultList.forEach((res) => {
      mergedFollowUps = mergedFollowUps.concat(res);
    });
    return mergedFollowUps;
  };

  getFollowupsBuckets = (key, keyRange) => {
    if (useGuppyForExplorer) {
      const queryString = `
      query ($filter: JSON) {
        ${this.state.visitIndexTypeName} (filter: $filter, accessibility: all, first: 10000) {
          subject_id
          visit_number
          thrpyv
          visit_date
          fposdate
          frstdthd
          leu3n
          submitter_id
          viral_load
        }
        _aggregation {
          ${this.state.visitIndexTypeName} (filter: $filter, accessibility: all) {
            _totalCount
          }
        }
      }
    `;
      const variableString = `
      {
        "filter": {
          "AND": [
            {
              "in": {
                "${key}": ["${keyRange.join('","')}"]
              }
            },
            {
              "=": {
                "hiv_status": "positive"
              }
            }
          ]
        }
      }`;
      return HIVCohortFilterCase.performQuery(
        queryString,
        variableString,
        true
      ).then((res) => {
        if (!res || !res.data || !res.data[this.state.visitIndexTypeName]) {
          throw new Error('Error while querying subjects with HIV');
        }
        return res.data[this.state.visitIndexTypeName];
      });
    }

    // below are for arranger
    const query = `
    {
      ${this.state.visitIndexTypeName} {
        hits(filters: { op: "and",
          content: [
            { op: "=",
              content: { field: "hiv_status", value: "positive" }
            },
            {
              op: "in",
              content: { field: "${key}", value: ["${keyRange.join('","')}"] }
            }
          ]
        }, first:10000) {
          total
          edges {
            node {
              subject_id
              visit_number
              thrpyv
              visit_date
              fposdate
              frstdthd
              leu3n
              submitter_id
              viral_load
            }
          }
        }
      }
    }`;
    return HIVCohortFilterCase.performQuery(query, null, true).then((res) => {
      if (!res || !res.data) {
        throw new Error('Error while querying subjects with HIV');
      }
      return res.data[this.state.visitIndexTypeName].hits.edges.map(
        (edge) => edge.node
      );
    });
  };

  isALargeAmountOfFollowUpDataMissing(visitArray) {
    // Note: This function is overridden by the LTNP case
    // If a large amount of data is missing, disqualify the subject
    const monthSizeFromVisitDate =
      (visitArray[visitArray.length - 1].visit_date -
        visitArray[0].visit_date) *
      12;
    // Visits are estimated to be 6 months apart, but this is not always the case
    const monthSizeFromVisitNumber =
      (visitArray[visitArray.length - 1].visit_number -
        visitArray[0].visit_number) *
      6;
    const maxWindowSize = this.state.numConsecutiveMonthsFromUser * 2;
    if (
      Math.min(monthSizeFromVisitDate, monthSizeFromVisitNumber) >=
      maxWindowSize
    ) {
      // If the window_size is more than double, this indicates a large amount of missing data
      return true;
    }
    return false;
  }

  checkReadyToCalculate = () => {
    // Overridden by LTNP and EC case
    const viralLoadFromUser = this.viralLoadInputRef.current.valueAsNumber;
    const numConsecutiveMonthsFromUser = this.numConsecutiveMonthsInputRef
      .current.valueAsNumber;
    this.setState({
      viralLoadFromUser: viralLoadFromUser > 0 ? viralLoadFromUser : undefined,
      numConsecutiveMonthsFromUser:
        numConsecutiveMonthsFromUser > 0
          ? numConsecutiveMonthsFromUser
          : undefined,
      isReadyToCalculate:
        viralLoadFromUser > 0 && numConsecutiveMonthsFromUser > 0,
      resultAlreadyCalculated: false,
    });
  };

  downloadControl = () => {
    // Overridden by LTNP
    const fileName = `control-cohort-vload-${this.state.suppressViralLoadFromUser.toString()}-months-${this.state.numConsecutiveVisitsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectControl);
    FileSaver.saveAs(blob, fileName);
  };

  updateFilters = (event) => {
    event.preventDefault();
    this.setState({ inLoadingState: true });
    this.updateSubjectClassifications();
  };
}

export default HIVCohortFilterCase;
