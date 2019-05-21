import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import './HIVCohortFilter.css';
import CohortPTCSvg from '../img/cohort-PTC.svg';
import Spinner from '../components/Spinner';
import HIVCohortFilterCase from './HIVCohortFilterCase';

class PTCCase extends HIVCohortFilterCase {
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
    this.state = Object.assign(this.state, {
      viralLoadFromUser: undefined,
      numConsecutiveMonthsFromUser: undefined,
      subjectNeither: [],
      subjectPTC: [],
      subjectControl: [],
    });
    this.viralLoadInputRef = React.createRef();
    this.numConsecutiveMonthsInputRef = React.createRef();
  }

  getBucketByKeyWithHAARTVAR = (bucketKey, isHAART) => {
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
    return HIVCohortFilterCase.performQuery(query).then((res) => {
      if (!res || !res.data) {
        throw new Error('Error when query subjects with HIV');
      }
      return res.data.follow_up.aggregations[bucketKey].buckets;
    });
  }

  getBucketByKey = async (bucketKey) => {
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

  doTheseVisitsMatchSlidingWindowCriteria = (visitArray) => {
    // The length of the array input to this function should be
    // == (this.state.numConsecutiveMonthsFromUser / 6)
    const upperBound = visitArray.length;
    for (let i = 0; i < upperBound; i += 1) {
      if (visitArray[i].viral_load === null) return false; // ignore all null records
      const vloadCheck = (visitArray[i].viral_load < this.state.viralLoadFromUser);
      const therapyCheck = this.state.therapyValuesOfInterest.includes(visitArray[i].thrpyv);
      if (!vloadCheck || !therapyCheck) {
        return false;
      }
    }

    if (this.isALargeAmountOfFollowUpDataMissing(visitArray)) {
      return false;
    }

    return true;
  }

  classifyAllSubjectPTC = (subjectToVisitMap) => {
    const subjectPTC = [];
    const subjectControl = [];
    const subjectNeither = [];
    const slidingWindowSize = Math.ceil(this.state.numConsecutiveMonthsFromUser / 6);

    // For each patient, try to find numConsecutiveMonthsFromUser consecutive
    // visits that match the PTC criteria
    Object.keys(subjectToVisitMap).forEach((subjectId) => {
      let visitArray = subjectToVisitMap[subjectId];
      const subjectWithVisits = {
        subject_id: subjectId,
        consecutive_haart_treatments_begin_at_followup: 'N/A',
        follow_ups: visitArray,
      };

      // If a followup has no date-related attributes set, it is not helpful to this classifier
      visitArray = visitArray.filter(x => x.visit_date !== null && x.visit_number !== null);

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
          const therapyCheck = !this.state.therapyValuesOfInterest.includes(
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

  updateSubjectClassifications = async () => {
    /* This function retrieves subjects with HIV status == 'positive' and
    * maps their subject_id to the sorted array of their visits.
    * Then we attempt to find a sliding window match for the subject corresponding to
    * the user-inputted viral load and number of consective months
    * (we assume visits are 6 months apart).
    */
    this.getFollowUpsWithHIV()
      .then((followUps) => {
        const subjectToVisitMap = HIVCohortFilterCase.makeSubjectToVisitMap(followUps);

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

  makeCohortJSONFile = (subjectsIn) => {
    const annotatedObj = {
      viral_load_upper_bound: this.state.viralLoadFromUser.toString(),
      num_consecutive_months_on_haart: this.state.numConsecutiveMonthsFromUser.toString(),
      subjects: subjectsIn,
    };

    const blob = new Blob([JSON.stringify(annotatedObj, null, 2)], { type: 'text/json' });
    return blob;
  }

  downloadPTC = () => {
    const fileName = `ptc-cohort-vload-${this.state.viralLoadFromUser.toString()
    }-months-${this.state.numConsecutiveMonthsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectPTC);
    FileSaver.saveAs(blob, fileName);
  }

  showCount = (isPTC) => {
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
        <div className='hiv-cohort-filter__sidebar'>
          <form>
            <h2 className='hiv-cohort-filter__sidebar-title'>
              PTC Classifier
            </h2>
            <h4 className='hiv-cohort-filter__sidebar-subtitle'>
              Customized Filters
            </h4>
            <div className='hiv-cohort-filter__sidebar-input-label'>
              Viral Load
              <span
                className='hiv-cohort-filter__value-highlight'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '__' } &nbsp;cp/mL
              </span>
            </div>
            <div className='hiv-cohort-filter__sidebar-input'>
              <input
                ref={this.viralLoadInputRef}
                className='hiv-cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.viralLoadFromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='hiv-cohort-filter__sidebar-input-label'>
              Received HAART for at least:
              <br />
              <span className='hiv-cohort-filter__value-highlight'>{ this.state.numConsecutiveMonthsFromUser || '__' } months</span>
            </div>
            <div className='hiv-cohort-filter__sidebar-input'>
              <input
                ref={this.numConsecutiveMonthsInputRef}
                className='hiv-cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.numConsecutiveMonthsFromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='hiv-cohort-filter__button-group'>
              <Button
                onClick={this.updateFilters}
                enabled={!this.state.inLoadingState && this.state.isReadyToCalculate}
                isPending={this.state.inLoadingState}
                label={this.state.inLoadingState ? 'Loading...' : 'Confirm'}
              />
            </div>
          </form>
        </div>


        <div className='hiv-cohort-filter__main'>
          <div className='hiv-cohort-filter__main-wrapper'>
            <div className='hiv-cohort-filter__svg-wrapper' id='PTC-svg-wrapper'>
              <CohortPTCSvg width='665px' />
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='vload-overlay-1'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '--'} &nbsp;cp/mL
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='vload-overlay-2'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '--' } &nbsp;cp/mL
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='vload-overlay-3'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '--'} &nbsp;cp/mL
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='consecutive-months-overlay-1'
              >
                { this.state.numConsecutiveMonthsFromUser || '--' } &nbsp;months
              </div>
              <div
                className='hiv-cohort-filter__value-highlight-2 hiv-cohort-filter__overlay'
                id='ptc-counts-overlay-1'
              >
                { this.showCount(true) }
              </div>
              <div
                className='hiv-cohort-filter__value-highlight-2 hiv-cohort-filter__overlay'
                id='control-counts-overlay-1'
              >
                { this.showCount(false) }
              </div>

              <div
                id='download-PTC-cohort-overlay'
                className='hiv-cohort-filter__overlay'
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

              <div id='download-control-cohort-overlay' className='hiv-cohort-filter__overlay'>
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

export default PTCCase;
