import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import { arrangerGraphqlPath } from '../localconf';
import { fetchWithCreds } from '../actions';
import './CohortFilter.css';
import CohortPTCSvg from '../img/cohort-PTC.svg';
import CohortECSvg from '../img/cohort-EC.svg';
import CohortLTNPSvg from '../img/cohort-LTNP.svg';
import Spinner from '../components/Spinner';

class CohortFilterCase extends React.Component {
  // Base class for the 3 NDH cohort filter apps. Meant to facilitate code reuse
  constructor(props) {
    super(props);
    this.updateFilters = this.updateFilters.bind(this);
    this.checkReadyToCalculate = this.checkReadyToCalculate.bind(this);
    this.downloadControl = this.downloadControl.bind(this);
    this.therapyValuesOfInterest = ['HAART'];
  }

  async getFollowUpsWithHIV() {
    const keyName = 'subject_id';
    const keyCountMap = await this.getBucketByKey(keyName);
    let batchCounts = 0;
    const promiseList = [];
    let keyRange = [];
    Object.keys(keyCountMap).forEach((keyId) => {
      const count = keyCountMap[keyId];
      if (batchCounts + count > 5000) {
        // query this batch for follow ups
        promiseList.push(this.getFollowupsBuckets(keyName, keyRange).then(res => res));

        // reset batch
        batchCounts = count;
        keyRange = [];
      }
      batchCounts += count;
      keyRange.push(keyId);
    });
    promiseList.push(this.getFollowupsBuckets(keyName, keyRange).then(res => res));

    let mergedFollowUps = [];
    const resultList = await Promise.all(promiseList);
    resultList.forEach((res) => {
      mergedFollowUps = mergedFollowUps.concat(res);
    });
    return mergedFollowUps;
  }

  getFollowupsBuckets(key, keyRange) {
    const query = `
    {
      follow_up {
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
              leu3n
              visit_number
              thrpyv
              visit_date
              fposdate
              frstdthd
              viral_load
            }
          }

        }
      }
    }`;
    return this.performQuery(query).then((res) => {
      if (!res || !res.data) {
        throw new Error('Error while querying subjects with HIV');
      }
      return res.data.follow_up.hits.edges.map(edge => edge.node);
    });
  }

  performQuery(queryString) { // eslint-disable-line
    return fetchWithCreds({
      path: `${arrangerGraphqlPath}`,
      body: JSON.stringify({
        query: queryString,
      }),
      method: 'POST',
    })
      .then(
        ({ status, data }) => data, // eslint-disable-line no-unused-vars
      );
  }

  makeSubjectToVisitMap(followUps) {  // eslint-disable-line class-methods-use-this
    // Convert to dictionary: { subject_id -> [ array of visits sorted by visit_date ] }
    const subjectToVisitMap = {};
    for (let i = 0; i < followUps.length; i += 1) {
      const subjectId = followUps[i].subject_id;
      if (subjectId in subjectToVisitMap) {
        subjectToVisitMap[subjectId].push(followUps[i]);
      } else {
        subjectToVisitMap[subjectId] = [followUps[i]];
      }
    }

    // Sort each patient's visits by visit_number
    Object.keys(subjectToVisitMap).forEach((key) => {
      const subjectVisits = subjectToVisitMap[key];
      if (subjectVisits.length > 1) {
        subjectVisits.sort((a, b) => {
          if (a.visit_number > b.visit_number) {
            return 1;
          }
          return ((b.visit_number > a.visit_number) ? -1 : 0);
        });
        subjectToVisitMap[key] = subjectVisits;
      }
    });

    return subjectToVisitMap;
  }

  updateFilters(event) {
    event.preventDefault();
    this.setState({ inLoadingState: true });
    this.updateSubjectClassifications();
  }

  checkReadyToCalculate() {
    // Overridden by LTNP case
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

  async getBucketByKey(bucketKey) {
    // Overridden by PTC case
    // Returns map of subjects who have never received HAART treatment
    const resList = await Promise.all([
      this.getBucketByKeyWithHAARTVAR(bucketKey, true),
      this.getBucketByKeyWithHAARTVAR(bucketKey, false),
    ]);

    let subjectsWithAtLeast1Haart = resList[0];
    let subjectsWithAtLeast1NonHaart = resList[1];
    let subjectsWithNoHaartTreatments = subjectsWithAtLeast1NonHaart.filter(
      x => !subjectsWithAtLeast1Haart.map(y => y['key']).includes(x['key'])
    );

    // Transform to map
    let resultMap = {};
    for (let i = 0; i < subjectsWithNoHaartTreatments.length; i += 1) {
      resultMap[subjectsWithNoHaartTreatments[i]['key']] = subjectsWithNoHaartTreatments[i]['doc_count']
    }
    return resultMap;
  }

  downloadControl() {
    // Overridden by LTNP
    const fileName = `control-cohort-vload-${this.state.viralLoadFromUser.toString()
    }-months-${this.state.numConsecutiveMonthsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectControl);
    FileSaver.saveAs(blob, fileName);
  }
}

class PTCCase extends CohortFilterCase {
  /*
  * PTC Case:
  * Below is the full algorithm description, from https://ctds-planx.atlassian.net/browse/PXP-2771
  * - The UI displays a 'decision tree' (just hardcoded svg), and makes an es query based on
  * sliding window size and viral load number.
  * - thrpy is the treatment that patient used since the last visit (follow_up)
  * - thrpyv is the treatment that patient uses at the visit (follow_up )
  * Definitions:
  * - With HAART treatment: follow_up.thrpyv = HAART
  * - viral load< X: followup.viral_load < X
  * - consecutive Y month: (last_followup.visit_number - first_followup.visit_number)*6 = Y
  * (if there are missing visit number, eg: patient has visit_number 1, 3, 4, 5.
  * Just consider the missing one still maintain the same viral load)
  * The criteria is:
  * - Patients hiv_status are positive, have consecutive follow ups for Y months with
  * HAART treatment and viral load < X
  * - The consecutive window has an immediate next follow up WITHOUT HAART treatment
  * and viral_load < X
  * User will type in the time period Y and viral load threshold X, and the app will show the
  * count for PTC case and control subjects. And have buttons to download the
  * clinical manifest for them.
  * One known limitation of the algorithm is that when visits are missing between 2 follow ups,
  * we take them as adjacent even though they are not,
  * so that visits 10 and 14 will be treated as 6 months apart, even though the time
  * may be much greater.
  */
  constructor(props) {
    super(props);
    this.state = {
      viralLoadFromUser: undefined,
      numConsecutiveMonthsFromUser: undefined,
      subjectNeither: [],
      subjectPTC: [],
      subjectControl: [],
      inLoadingState: false,
      isReadyToCalculate: false,
      resultAlreadyCalculated: false,
    };
    this.downloadPTC = this.downloadPTC.bind(this);
    this.downloadControl = this.downloadControl.bind(this);
    this.makeCohortJSONFile = this.makeCohortJSONFile.bind(this);
    this.viralLoadInputRef = React.createRef();
    this.numConsecutiveMonthsInputRef = React.createRef();
    this.showCount = this.showCount.bind(this);
  }

  getBucketByKeyWithHAARTVAR(bucketKey, isHAART) {
    // The viral_load check in the below query ensures that 
    // the subjects retrieved have *at least* one follow_up with viral_load < viralLoadFromUser
    const query = `
    {
      follow_up {
        aggregations(filters: {first: 10000, op: "and", content: [
          {op: "${isHAART ? '=' : '!='}", content: {field: "thrpyv", value: "HAART"}},
          {op: "<", content: {field: "viral_load", value: "${this.state.viralLoadFromUser}"}},
          {op: "=", content: {field: "hiv_status", value: "positive"}}]}) 
        {
          ${bucketKey} {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
    `;
    return this.performQuery(query).then((res) => {
      if (!res || !res.data) {
        throw new Error('Error when query subjects with HIV');
      }
      return res.data.follow_up.aggregations[bucketKey].buckets;
    });
  }

  async getBucketByKey(bucketKey) {
    const resList = await Promise.all([
      this.getBucketByKeyWithHAARTVAR(bucketKey, true),
      this.getBucketByKeyWithHAARTVAR(bucketKey, false),
    ]);
    const withoutHAARTMap = resList[1].reduce((acc, cur) => {
      const { key, doc_count } = cur; // eslint-disable-line camelcase
      acc[key] = doc_count; // eslint-disable-line camelcase
      return acc;
    }, {});
    const resultBucketKeys = {};
    resList[0].forEach(({ key, doc_count }) => { // eslint-disable-line camelcase
      if (withoutHAARTMap[key]) {
        resultBucketKeys[key] = doc_count + withoutHAARTMap[key]; // eslint-disable-line camelcase
      }
    });
    return resultBucketKeys;
  }

  doTheseVisitsMatchSlidingWindowCriteria(visitArray) {
    // The length of the array input to this function should be
    // == (this.state.numConsecutiveMonthsFromUser / 6)
    const upperBound = visitArray.length;
    for (let i = 0; i < upperBound; i += 1) {
      if (visitArray[i].viral_load === null) return false; // ignore all null records
      const vloadCheck = (visitArray[i].viral_load < this.state.viralLoadFromUser);
      const therapyCheck = this.therapyValuesOfInterest.includes(visitArray[i].thrpyv);
      if (!vloadCheck || !therapyCheck) {
        return false;
      }
    }

    return true;
  }

  classifyAllSubjectPTC(subjectToVisitMap) {
    const subjectPTC = [];
    const subjectControl = [];
    const subjectNeither = [];
    const slidingWindowSize = Math.ceil(this.state.numConsecutiveMonthsFromUser / 6);

    // For each patient, try to find numConsecutiveMonthsFromUser consecutive
    // visits that match the PTC criteria
    Object.keys(subjectToVisitMap).forEach((subjectId) => {
      const visitArray = subjectToVisitMap[subjectId];
      const subjectWithVisits = {
        subject_id: subjectId,
        consecutive_haart_treatments_begin_at_followup: 'N/A',
        follow_ups: visitArray,
      };
      if (visitArray.length < slidingWindowSize + 1) {
        subjectNeither.push(subjectWithVisits);
        return;
      }

      // The sliding window step. Window is of size this.state.numConsecutiveMonthsFromUser / 6
      for (let i = 0; i < visitArray.length - slidingWindowSize; i += 1) {
        const windowMatch = this.doTheseVisitsMatchSlidingWindowCriteria(
          visitArray.slice(i, i + slidingWindowSize),
        );
        if (windowMatch) {
          // Now that we know the first numConsecutiveMonthsFromUser visits in the array
          // match the criteria, we should check the following visit
          const theNextVisit = visitArray[i + slidingWindowSize];
          if (theNextVisit.viral_load === null || theNextVisit.thrpyv === null) {
            continue; // eslint-disable-line no-continue
          }
          const vloadCheck = (theNextVisit.viral_load < this.state.viralLoadFromUser);
          const therapyCheck = !this.therapyValuesOfInterest.includes(
            theNextVisit.thrpyv,
          );
          if (!therapyCheck) {
            // Look for next instance of thrpyv == HAART for this subject
            continue; // eslint-disable-line no-continue
          }
          if (vloadCheck && therapyCheck) {
            // Found PTC!
            subjectWithVisits.consecutive_haart_treatments_begin_at_followup
                      = visitArray[i].submitter_id;
            subjectPTC.push(subjectWithVisits);
          } else {
            // Found control!
            subjectControl.push(subjectWithVisits);
          }

          // Done with classification
          return;
        }
      }

      // If the window above didn't apply, the subject is neither
      subjectNeither.push(subjectWithVisits);
    });
    return {
      subjectPTC,
      subjectControl,
      subjectNeither,
    };
  }

  async updateSubjectClassifications() {
    /* This function retrieves subjects with HIV status == 'positive' and
    * maps their subject_id to the sorted array of their visits.
    * Then we attempt to find a sliding window match for the subject corresponding to
    * the user-inputted viral load and number of consective months
    * (we assume visits are 6 months apart).
    */
    this.getFollowUpsWithHIV()
      .then((followUps) => {
        let subjectToVisitMap = this.makeSubjectToVisitMap(followUps);

        const {
          subjectPTC,
          subjectControl,
          subjectNeither,
        } = this.classifyAllSubjectPTC(subjectToVisitMap);
        this.setState({
          subjectPTC,
          subjectControl,
          subjectNeither,
          inLoadingState: false,
          resultAlreadyCalculated: true,
        });
      });
  }

  makeCohortJSONFile(subjectsIn) {
    const annotatedObj = {
      viral_load_upper_bound: this.state.viralLoadFromUser.toString(),
      num_consective_months_on_haart: this.state.numConsecutiveMonthsFromUser.toString(),
      subjects: subjectsIn,
    };

    const blob = new Blob([JSON.stringify(annotatedObj, null, 2)], { type: 'text/json' });
    return blob;
  }

  downloadPTC() {
    const fileName = `ptc-cohort-vload-${this.state.viralLoadFromUser.toString()
    }-months-${this.state.numConsecutiveMonthsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectPTC);
    FileSaver.saveAs(blob, fileName);
  }

  showCount(isPTC) {
    if (this.state.inLoadingState) { return (<Spinner />); }
    if (this.state.resultAlreadyCalculated) {
      if (isPTC) { return this.state.subjectPTC.length; }
      return this.state.subjectControl.length;
    }
    return '--';
  }

  render() {
    return (
      <React.Fragment>
        <div className='cohort-filter__sidebar'>
          <form>
            <h2 className='cohort-filter__sidebar-title'>
              PTC Cohort Selection
            </h2>
            <h4 className='cohort-filter__sidebar-subtitle'>
              Customized Filters
            </h4>
            <div className='cohort-filter__sidebar-input-label'>
              Viral Load
              <span
                className='cohort-filter__value-highlight'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '__' } &nbsp;cp/mL
              </span>
            </div>
            <div className='cohort-filter__sidebar-input'>
              <input
                ref={this.viralLoadInputRef}
                className='cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.viralLoadFromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='cohort-filter__sidebar-input-label'>
              Received HAART for at least:<br />
              <span className='cohort-filter__value-highlight'>{ this.state.numConsecutiveMonthsFromUser || '__' } months</span>
            </div>
            <div className='cohort-filter__sidebar-input'>
              <input
                ref={this.numConsecutiveMonthsInputRef}
                className='cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.numConsecutiveMonthsFromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='cohort-filter__button-group'>
              <Button
                onClick={this.updateFilters}
                enabled={!this.state.inLoadingState && this.state.isReadyToCalculate}
                isPending={this.state.inLoadingState}
                label={this.state.inLoadingState ? 'Loading...' : 'Confirm'}
              />
            </div>
          </form>
        </div>


        <div className='cohort-filter__main'>
          <div className='cohort-filter__main-wrapper'>
            <div className='cohort-filter__svg-wrapper' id='PTC-svg-wrapper'>
              <CohortPTCSvg width='665px' />
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='vload-overlay-1'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '--'} &nbsp;cp/mL
              </div>
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='vload-overlay-2'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '--' } &nbsp;cp/mL</div>
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='vload-overlay-3'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '--'} &nbsp;cp/mL
              </div>
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='consecutive-months-overlay-1'
              >
                { this.state.numConsecutiveMonthsFromUser || '--' } &nbsp;months
              </div>
              <div
                className='cohort-filter__value-highlight-2 cohort-filter__overlay'
                id='ptc-counts-overlay-1'
              >
                { this.showCount(true) }
              </div>
              <div
                className='cohort-filter__value-highlight-2 cohort-filter__overlay'
                id='control-counts-overlay-1'
              >
                { this.showCount(false) }
              </div>

              <div
                id='download-PTC-cohort-overlay'
                className='cohort-filter__overlay'
              >
                {
                  <React.Fragment>
                    <Button
                      onClick={this.downloadPTC}
                      label='Download Cohort'
                      rightIcon='download'
                      id='download-PTC-button'
                      enabled={!this.state.inLoadingState
                        && this.state.resultAlreadyCalculated
                        && this.state.subjectPTC.length > 0}
                      buttonType='secondary'
                      isPending={this.state.inLoadingState}
                    />
                  </React.Fragment>
                }
              </div>

              <div id='download-control-cohort-overlay' className='cohort-filter__overlay'>
                {
                  <React.Fragment>
                    <Button
                      label='Download Cohort'
                      rightIcon='download'
                      id='download-control-button'
                      enabled={!this.state.inLoadingState
                        && this.state.resultAlreadyCalculated
                        && this.state.subjectControl.length > 0}
                      onClick={this.downloadControl}
                      buttonType='secondary'
                      isPending={this.state.inLoadingState}
                    />
                  </React.Fragment>
                }
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class ECCase extends CohortFilterCase {
  /*
  * EC Case:
  * Below is the full algorithm description from https://ctds-planx.atlassian.net/browse/PXP-2892
  * The UI displays a 'decision tree' (just hardcoded svg), and makes an es query based on
  * sliding window size and viral load number.
  * Definitions:
  * - thrpy is the treatment that patient used since the last visit ( follow_up)
  * - thrpyv is the treatment that patient uses at the visit ( follow_up )
  * Definitions:
  * - Never received HAART treatment: follow_up.thrpyv != HAART
  * - viral load< X: followup.viral_load < X
  * - Consecutive Y month: (last_followup.visit_number - first_followup.visit_number)*6 = Y
  * If there are missing visit number, eg: patient has visit_number 1, 3, 4, 5. 
  * Just consider the missing one still maintain the same viral load)
  * The EC criteria are:
  * - Patients' hiv_status are positive, have never received HAART treatment and
  * have consecutive follow ups for Y months with viral load < X
  * - User will type in the time period Y and viral load threshold X, and the app will 
  * show the count for EC case and control subjects. And have buttons to download 
  * the clinical manifest for them.
  */
  constructor(props) {
    super(props);
    this.state = {
      viralLoadFromUser: undefined,
      numConsecutiveMonthsFromUser: undefined,
      subjectNeither: [],
      subjectEC: [],
      subjectControl: [],
      inLoadingState: false,
      isReadyToCalculate: false,
      resultAlreadyCalculated: false,
    };
    this.downloadEC = this.downloadEC.bind(this);
    this.makeCohortJSONFile = this.makeCohortJSONFile.bind(this);
    this.checkReadyToCalculate = this.checkReadyToCalculate.bind(this);
    this.viralLoadInputRef = React.createRef();
    this.numConsecutiveMonthsInputRef = React.createRef();
    this.showCount = this.showCount.bind(this);
  }

  getBucketByKeyWithHAARTVAR(bucketKey, isHAART) {
    // The below query differs from the PTC case in that there is no viral_load check.
    // This is because the EC and LTNP cases uses this function to find people who have
    // never received haart treatments; we need to look at *all* their followups.
    // (Read the function getBucketByKey() defined in the CohortFilterCase class.)
    const query = `
    {
      follow_up {
        aggregations(filters: {first: 10000, op: "and", content: [
          {op: "${isHAART ? '=' : '!='}", content: {field: "thrpyv", value: "HAART"}},
          {op: "=", content: {field: "hiv_status", value: "positive"}}]}) 
        {
          ${bucketKey} {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
    `;
    return this.performQuery(query).then((res) => {
      if (!res || !res.data) {
        throw new Error('Error while querying subjects with HIV');
      }
      return res.data.follow_up.aggregations[bucketKey].buckets;
    });
  }

  doTheseVisitsMatchECSlidingWindowCriteria(visitArray) {
    for (let i = 0; i < visitArray.length; i += 1) {
      if (visitArray[i].viral_load === null) return false; // ignore all null records
      if (visitArray[i].viral_load >= this.state.viralLoadFromUser) {
        return false;
      }
    }
    return true;
  }

  classifyAllSubjectEC(subjectToVisitMap) {
    const subjectEC = [];
    const subjectControl = [];
    const subjectNeither = [];
    const slidingWindowSize = Math.ceil(this.state.numConsecutiveMonthsFromUser / 6);

    // For each patient, try to find numConsecutiveMonthsFromUser consecutive
    // visits that match the EC criteria
    Object.keys(subjectToVisitMap).forEach((subjectId) => {
      const visitArray = subjectToVisitMap[subjectId];

      const subjectWithVisits = {
        subject_id: subjectId,
        consecutive_viral_loads_below_threshold_begin_at_followup: 'N/A',
        follow_ups: visitArray,
      };

      if (visitArray.length < slidingWindowSize) {
        subjectNeither.push(subjectWithVisits);
        return;
      }
      
      // The sliding window step. Window is of size this.state.numConsecutiveMonthsFromUser / 6
      // Note that this loop differs slightly from the PTC case: 
      // we use i<= instead of i<, because we dont need to check the followup immediately
      // after the window, as we did in the PTC Case
      for (let i = 0; i <= visitArray.length - slidingWindowSize; i += 1) {
        const windowMatch = this.doTheseVisitsMatchECSlidingWindowCriteria(
          visitArray.slice(i, i + slidingWindowSize),
        );
        
        if (windowMatch) {
          // Found EC!
          subjectWithVisits['consecutive_viral_loads_below_threshold_begin_at_followup']
                      = visitArray[i].submitter_id;
          subjectEC.push(subjectWithVisits);
          return;
        }
      }

      // If the window above didn't apply anywhere in this subject's followups, 
      // the subject is control
      subjectControl.push(subjectWithVisits);
    });

    return {
      subjectEC,
      subjectControl,
      subjectNeither,
    };
  }

  async updateSubjectClassifications() {
    this.getFollowUpsWithHIV()
      .then((followUps) => {
        let subjectToVisitMap = this.makeSubjectToVisitMap(followUps);

        const {
          subjectEC,
          subjectControl,
          subjectNeither,
        } = this.classifyAllSubjectEC(subjectToVisitMap);
        this.setState({
          subjectEC,
          subjectControl,
          subjectNeither,
          inLoadingState: false,
          resultAlreadyCalculated: true,
        });
      });
  }

  makeCohortJSONFile(subjectsIn) {
    const annotatedObj = {
      viral_load_upper_bound: this.state.viralLoadFromUser.toString(),
      maintained_for_at_least_this_many_months: this.state.numConsecutiveMonthsFromUser.toString(),
      subjects: subjectsIn,
    };

    const blob = new Blob([JSON.stringify(annotatedObj, null, 2)], { type: 'text/json' });
    return blob;
  }

  downloadEC() {
    const fileName = `ec-cohort-vload-${this.state.viralLoadFromUser.toString()
    }-months-${this.state.numConsecutiveMonthsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectEC);
    FileSaver.saveAs(blob, fileName);
  }

  showCount(isEC) {
    if (this.state.inLoadingState) { return (<Spinner />); }
    if (this.state.resultAlreadyCalculated) {
      if (isEC) { return this.state.subjectEC.length; }
      return this.state.subjectControl.length;
    }
    return '--';
  }

  render() {
    return (
      <React.Fragment>
        <div className='cohort-filter__sidebar'>
          <form>
            <h2 className='cohort-filter__sidebar-title'>
              EC Cohort Selection
            </h2>
            <h4 className='cohort-filter__sidebar-subtitle'>
              Customized Filters
            </h4>
            <div className='cohort-filter__sidebar-input-label'>
              Viral Load
              <span
                className='cohort-filter__value-highlight'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '__' } &nbsp;cp/mL
              </span>
            </div>
            <div className='cohort-filter__sidebar-input'>
              <input
                ref={this.viralLoadInputRef}
                className='cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.viralLoadFromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='cohort-filter__sidebar-input-label'>
              Maintained for at least:<br />
              <span className='cohort-filter__value-highlight'>{ this.state.numConsecutiveMonthsFromUser || '__' } months</span>
            </div>
            <div className='cohort-filter__sidebar-input'>
              <input
                ref={this.numConsecutiveMonthsInputRef}
                className='cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.numConsecutiveMonthsFromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='cohort-filter__button-group'>
              <Button
                onClick={this.updateFilters}
                enabled={!this.state.inLoadingState && this.state.isReadyToCalculate}
                isPending={this.state.inLoadingState}
                label={this.state.inLoadingState ? 'Loading...' : 'Confirm'}
              />
            </div>
          </form>
        </div>


        <div className='cohort-filter__main'>
          <div className='cohort-filter__main-wrapper'>
            <div className='cohort-filter__svg-wrapper' id='EC-svg-wrapper'>
              <CohortECSvg width='665px' />
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='vload-overlay-4'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '--'} &nbsp;cp/mL
              </div>
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='consecutive-months-overlay-2'
              >
                { this.state.numConsecutiveMonthsFromUser || '--' } &nbsp;months
              </div>
              <div
                className='cohort-filter__value-highlight-2 cohort-filter__overlay'
                id='ec-counts-overlay-1'
              >
                { this.showCount(true) }
              </div>
              <div
                className='cohort-filter__value-highlight-2 cohort-filter__overlay'
                id='control-counts-overlay-2'
              >
                { this.showCount(false) }
              </div>

              <div
                id='download-EC-cohort-overlay'
                className='cohort-filter__overlay'
              >
                {
                  <React.Fragment>
                    <Button
                      onClick={this.downloadEC}
                      label='Download Cohort'
                      rightIcon='download'
                      id='download-EC-button'
                      enabled={!this.state.inLoadingState
                        && this.state.resultAlreadyCalculated
                        && this.state.subjectEC.length > 0}
                      buttonType='secondary'
                      isPending={this.state.inLoadingState}
                    />
                  </React.Fragment>
                }
              </div>

              <div id='download-control-cohort-overlay-EC' className='cohort-filter__overlay'>
                {
                  <React.Fragment>
                    <Button
                      label='Download Cohort'
                      rightIcon='download'
                      id='download-control-button-EC'
                      enabled={!this.state.inLoadingState
                        && this.state.resultAlreadyCalculated
                        && this.state.subjectControl.length > 0}
                      onClick={this.downloadControl}
                      buttonType='secondary'
                      isPending={this.state.inLoadingState}
                    />
                  </React.Fragment>
                }
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class LTNPCase extends CohortFilterCase {
  /*
  * LTNP Case:
  * Below is the full algorithm description from https://ctds-planx.atlassian.net/browse/PXP-2892
  * The UI displays a 'decision tree' (just hardcoded svg), and makes an es query based on
  * sliding window size and viral load number.
  * Definitions:
  * - Never received HAART treatment: follow_up.thrpyv != HAART
  * - X years: (get.current_year - followup.fposdate)
  * - CD4 > Y: followup.leu3n > Y
  * Definitions:
  * - Never received HAART treatment: follow_up.thrpyv != HAART
  * - viral load< X: followup.viral_load < X
  * - Consecutive Y month: (last_followup.visit_number - first_followup.visit_number)*6 = Y
  * If there are missing visit number, eg: patient has visit_number 1, 3, 4, 5. 
  * Just consider the missing one still maintain the same viral load)
  * The LTNP criteria are:
  * Patients' hiv_status are positive for X years, have never received 
  * HAART treatment and maintain  CD4 > Y for those X years.
  * User will type in the time period X and CD4 threshold Y, and the
  * app will show the count for LTNP case and control subjects and have buttons to
  * download the clinical manifest for them.
  * Known limitations:
  * - This algorithm assumes that once a subject is HIV positive, they remain HIV positive
  * - If followups are missing between fposdate and currentYear, they don't count against 
  * the subject -- that is, the CD4 count is assumed to remain under the 
  * threshold for the missing visits.
  */
  constructor(props) {
    super(props);
    this.state = {
      CD4FromUser: undefined,
      numConsecutiveYearsFromUser: undefined,
      subjectLTNP: [],
      subjectControl: [],
      inLoadingState: false,
      isReadyToCalculate: false,
      resultAlreadyCalculated: false,
    };
    this.downloadLTNP = this.downloadLTNP.bind(this);
    this.makeCohortJSONFile = this.makeCohortJSONFile.bind(this);
    this.CD4InputRef = React.createRef();
    this.numConsecutiveYearsInputRef = React.createRef();
    this.showCount = this.showCount.bind(this);
  }

  getBucketByKeyWithHAARTVAR(bucketKey, isHAART) {
    var d = new Date();
    var currentYear = d.getFullYear();
    const query = `
    {
      follow_up {
        aggregations(filters: {first: 10000, op: "and", content: [
          {op: "${isHAART ? '=' : '!='}", content: {field: "thrpyv", value: "HAART"}},
          {op: ">", content: {field: "leu3n", value: "${this.state.CD4FromUser}"}},
          {op: "<=", content: {field: "fposdate", value: "${currentYear - this.state.numConsecutiveYearsFromUser}"}},
          {op: "=", content: {field: "hiv_status", value: "positive"}}]}) 
        {
          ${bucketKey} {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
    `;
    return this.performQuery(query).then((res) => {
      if (!res || !res.data) {
        throw new Error('Error while querying subjects with HIV');
      }
      return res.data.follow_up.aggregations[bucketKey].buckets;
    });
  }

  classifyAllSubjectLTNP(subjectToVisitMap) {
    const subjectLTNP = [];
    const subjectControl = [];

    var d = new Date();
    var currentYear = d.getFullYear();

    // For each subject, extract the visits with visit_date > fposdate and check their CD4 counts
    Object.keys(subjectToVisitMap).forEach((subjectId) => {
      const visitArray = subjectToVisitMap[subjectId];      
      let numYearsHIVPositive = Math.min(
          currentYear, visitArray[0]['frstdthd']
        ) - visitArray[0]['fposdate'];
      if (numYearsHIVPositive < this.state.numConsecutiveYearsFromUser) {
        // The subject is neither control nor LTNP
        return;
      }
      const subjectWithVisits = {
        subject_id: subjectId,
        num_years_hiv_positive: numYearsHIVPositive,
        follow_ups: visitArray,
      };

      let followUpsAfterFposDate = visitArray.filter(x => (x['visit_date'] > x['fposdate']));
      let followUpsWithCD4CountsBelowThresholdAfterFposDate = followUpsAfterFposDate.filter(
        x => (x['leu3n'] <= this.state.CD4FromUser && x['leu3n'] != null)
      );

      if (followUpsWithCD4CountsBelowThresholdAfterFposDate.length === 0 
          && followUpsAfterFposDate.length > 0) {
        subjectLTNP.push(subjectWithVisits);
      } else {
        subjectControl.push(subjectWithVisits);
      }
    });
    return {
      subjectLTNP,
      subjectControl,
    };
  }

  async updateSubjectClassifications() {
    this.getFollowUpsWithHIV()
      .then((followUps) => {
        let subjectToVisitMap = this.makeSubjectToVisitMap(followUps);

        const {
          subjectLTNP,
          subjectControl,
        } = this.classifyAllSubjectLTNP(subjectToVisitMap);
        this.setState({
          subjectLTNP,
          subjectControl,
          inLoadingState: false,
          resultAlreadyCalculated: true,
        });
      });
  }

  makeCohortJSONFile(subjectsIn) {
    const annotatedObj = {
      "lower_bound_for_CD4_count": this.state.CD4FromUser.toString(),
      "lower_bound_for_num_years_hiv_positive": this.state.numConsecutiveYearsFromUser.toString(),
      "subjects": subjectsIn,
    };

    const blob = new Blob([JSON.stringify(annotatedObj, null, 2)], { type: 'text/json' });
    return blob;
  }

  downloadLTNP() {
    const fileName = `ltnp-cohort-vload-${this.state.CD4FromUser.toString()
    }-years-${this.state.numConsecutiveYearsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectLTNP);
    FileSaver.saveAs(blob, fileName);
  }

  downloadControl() {
    const fileName = `control-cohort-cd4-${this.state.CD4FromUser.toString()
    }-years-${this.state.numConsecutiveYearsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectControl);
    FileSaver.saveAs(blob, fileName);
  }

  checkReadyToCalculate() {
    const CD4FromUser = this.CD4InputRef.current.valueAsNumber;
    const numConsecutiveYearsFromUser = this.numConsecutiveYearsInputRef.current.valueAsNumber;
    this.setState({
      CD4FromUser: CD4FromUser > 0 ? CD4FromUser : undefined,
      numConsecutiveYearsFromUser: numConsecutiveYearsFromUser > 0
        ? numConsecutiveYearsFromUser : undefined,
      isReadyToCalculate: (CD4FromUser > 0 && numConsecutiveYearsFromUser > 0),
      resultAlreadyCalculated: false,
    });
  }

  showCount(isLTNP) {
    if (this.state.inLoadingState) { return (<Spinner />); }
    if (this.state.resultAlreadyCalculated) {
      if (isLTNP) { return this.state.subjectLTNP.length; }
      return this.state.subjectControl.length;
    }
    return '--';
  }

  render() {
    return (
      <React.Fragment>
        <div className='cohort-filter__sidebar'>
          <form>
            <h2 className='cohort-filter__sidebar-title'>
              LTNP Cohort Selection
            </h2>
            <h4 className='cohort-filter__sidebar-subtitle'>
              Customized Filters
            </h4>
            <div className='cohort-filter__sidebar-input-label'>
              CD4 Counts remain: 
              <span
                className='cohort-filter__value-highlight'
              >
                &nbsp; &gt; { this.state.CD4FromUser || '__' }
              </span>
            </div>
            <div className='cohort-filter__sidebar-input'>
              <input
                ref={this.CD4InputRef}
                className='cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.CD4FromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='cohort-filter__sidebar-input-label'>
              Maintained for at least:<br />
              <span className='cohort-filter__value-highlight'>{ this.state.numConsecutiveYearsFromUser || '__' } years</span>
            </div>
            <div className='cohort-filter__sidebar-input'>
              <input
                ref={this.numConsecutiveYearsInputRef}
                className='cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.numConsecutiveYearsFromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='cohort-filter__button-group'>
              <Button
                onClick={this.updateFilters}
                enabled={!this.state.inLoadingState && this.state.isReadyToCalculate}
                isPending={this.state.inLoadingState}
                label={this.state.inLoadingState ? 'Loading...' : 'Confirm'}
              />
            </div>
          </form>
        </div>


        <div className='cohort-filter__main'>
          <div className='cohort-filter__main-wrapper'>
            <div className='cohort-filter__svg-wrapper'>
              <CohortLTNPSvg width='665px' />
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='cd4-overlay-1'
              >
                &nbsp; &gt; { this.state.CD4FromUser || '--'}
              </div>
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='cd4-overlay-2'
              >
                &nbsp; &gt; { this.state.CD4FromUser || '--' }
              </div>
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='consecutive-years-overlay-1'
              >
                { this.state.numConsecutiveYearsFromUser || '--' } &nbsp;{this.state.numConsecutiveYearsFromUser === 1 ? 'year' : 'years'}
              </div>
              <div
                className='cohort-filter__value-highlight cohort-filter__overlay'
                id='consecutive-years-overlay-2'
              >
                { this.state.numConsecutiveYearsFromUser || '--' } &nbsp;{this.state.numConsecutiveYearsFromUser === 1 ? 'year' : 'years'}
              </div>
              <div
                className='cohort-filter__value-highlight-2 cohort-filter__overlay'
                id='ltnp-counts-overlay-1'
              >
                { this.showCount(true) }
              </div>
              <div
                className='cohort-filter__value-highlight-2 cohort-filter__overlay'
                id='control-counts-overlay-3'
              >
                { this.showCount(false) }
              </div>

              <div
                id='download-LTNP-cohort-overlay'
                className='cohort-filter__overlay'
              >
                {
                  <React.Fragment>
                    <Button
                      onClick={this.downloadLTNP}
                      label='Download Cohort'
                      rightIcon='download'
                      id='download-LTNP-button'
                      enabled={!this.state.inLoadingState
                        && this.state.resultAlreadyCalculated
                        && this.state.subjectLTNP.length > 0}
                      buttonType='secondary'
                      isPending={this.state.inLoadingState}
                    />
                  </React.Fragment>
                }
              </div>

              <div id='download-control-cohort-overlay-LTNP' className='cohort-filter__overlay'>
                {
                  <React.Fragment>
                    <Button
                      label='Download Cohort'
                      rightIcon='download'
                      id='download-control-button'
                      enabled={!this.state.inLoadingState
                        && this.state.resultAlreadyCalculated
                        && this.state.subjectControl.length > 0}
                      onClick={this.downloadControl}
                      buttonType='secondary'
                      isPending={this.state.inLoadingState}
                    />
                  </React.Fragment>
                }
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export { 
  PTCCase, 
  ECCase,
  LTNPCase,
}