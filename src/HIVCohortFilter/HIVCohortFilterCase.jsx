/* eslint-disable react/no-unused-state */
import React from 'react';
import FileSaver from 'file-saver';
import { fetchWithCreds } from '../actions';
import {
  guppyGraphQLUrl,
  guppyDownloadUrl,
  analysisApps,
} from '../configs';

class HIVCohortFilterCase extends React.Component {
  // Base class for the 3 NDH cohort filter apps. Meant to facilitate code reuse
  static performQuery(query, variableString, useGraphQLEndpoint) {
    if (useGraphQLEndpoint) {
      const graphqlUrl = guppyGraphQLUrl;
      return fetchWithCreds({
        path: `${graphqlUrl}`,
        body: variableString ? JSON.stringify({
          query,
          variables: JSON.parse(variableString),
        }) : JSON.stringify({
          query,
        }),
        method: 'POST',
      })
        .then(
          ({ status, data }) => data, // eslint-disable-line no-unused-vars
        );
    }

    return fetchWithCreds({
      path: `${guppyDownloadUrl}`,
      body: JSON.stringify(query),
      method: 'POST',
    })
      .then(
        ({ status, data }) => data, // eslint-disable-line no-unused-vars
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
          return ((b.harmonized_visit_number > a.harmonized_visit_number) ? -1 : 0);
        });
        subjectToVisitMap[key] = subjectVisits;
      }
    });

    return subjectToVisitMap;
  }

  constructor(props) {
    super(props);
    this.state = {
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
        promiseList.push(this.getFollowupsBuckets(keyName, keyRange).then((res) => res));

        // reset batch
        batchCounts = count;
        keyRange = [];
      }
      batchCounts += count;
      keyRange.push(keyId);
    });
    promiseList.push(this.getFollowupsBuckets(keyName, keyRange).then((res) => res));

    let mergedFollowUps = [];
    const resultList = await Promise.all(promiseList);
    resultList.forEach((res) => {
      mergedFollowUps = mergedFollowUps.concat(res);
    });
    return mergedFollowUps;
  }

  getFollowupsBuckets = (key, keyRange) => {
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
    return HIVCohortFilterCase.performQuery(queryString, variableString, true).then((res) => {
      if (!res
          || !res.data
          || !res.data[this.state.visitIndexTypeName]) {
        throw new Error('Error while querying subjects with HIV');
      }
      return res.data[this.state.visitIndexTypeName];
    });
  }

  downloadControl = () => {
    // Overridden by LTNP
    const fileName = `control-cohort-vload-${this.state.suppressViralLoadFromUser.toString()
    }-months-${this.state.numConsecutiveVisitsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectControl);
    FileSaver.saveAs(blob, fileName);
  }

  updateFilters = (event) => {
    event.preventDefault();
    this.setState({ inLoadingState: true });
    this.updateSubjectClassifications();
  }

  checkReadyToCalculate = () => {
    // Overridden by LTNP and EC case
    const viralLoadFromUser = this.viralLoadInputRef.current.valueAsNumber;
    const numConsecutiveMonthsFromUser = this.numConsecutiveMonthsInputRef.current.valueAsNumber;
    this.setState({
      viralLoadFromUser: viralLoadFromUser > 0 ? viralLoadFromUser : undefined,
      numConsecutiveMonthsFromUser: numConsecutiveMonthsFromUser > 0
        ? numConsecutiveMonthsFromUser : undefined,
      isReadyToCalculate: (viralLoadFromUser > 0 && numConsecutiveMonthsFromUser > 0),
      resultAlreadyCalculated: false,
    });
  }
}

export default HIVCohortFilterCase;
