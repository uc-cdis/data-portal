import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import './HIVCohortFilter.css';
import CohortECSvg from '../img/cohort-EC.svg';
import Spinner from '../components/Spinner';
import HIVCohortFilterCase from './HIVCohortFilterCase';

class ECCase extends HIVCohortFilterCase {
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
    this.state = Object.assign(this.state, {
      viralLoadFromUser: undefined,
      numConsecutiveMonthsFromUser: undefined,
      subjectNeither: [],
      subjectEC: [],
      subjectControl: [],
    });
    this.viralLoadInputRef = React.createRef();
    this.numConsecutiveMonthsInputRef = React.createRef();
  }

  getBucketByKeyWithHAARTVAR = (bucketKey, isHAART) => {
    // The below query differs from the PTC case in that there is no viral_load check.
    // This is because the EC and LTNP cases uses this function to find people who have
    // never received haart treatments; we need to look at *all* their followups.
    // (Read the function getBucketByKey() defined in the HIVCohortFilterCase class.)
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
    return HIVCohortFilterCase.performQuery(query).then((res) => {
      if (!res || !res.data) {
        throw new Error('Error while querying subjects with HIV');
      }
      return res.data.follow_up.aggregations[bucketKey].buckets;
    });
  }

  doTheseVisitsMatchECSlidingWindowCriteria = (visitArray) => {
    for (let i = 0; i < visitArray.length; i += 1) {
      if (visitArray[i].viral_load === null) return false; // ignore all null records
      if (visitArray[i].viral_load >= this.state.viralLoadFromUser) {
        return false;
      }
    }

    if (this.isALargeAmountOfFollowUpDataMissing(visitArray)) {
      return false;
    }

    return true;
  }

  classifyAllSubjectEC = (subjectToVisitMap) => {
    const subjectEC = [];
    const subjectControl = [];
    const subjectNeither = [];
    const slidingWindowSize = Math.ceil(this.state.numConsecutiveMonthsFromUser / 6);

    // For each patient, try to find numConsecutiveMonthsFromUser consecutive
    // visits that match the EC criteria
    Object.keys(subjectToVisitMap).forEach((subjectId) => {
      let visitArray = subjectToVisitMap[subjectId];

      const subjectWithVisits = {
        subject_id: subjectId,
        consecutive_viral_loads_below_threshold_begin_at_followup: 'N/A',
        follow_ups: visitArray,
      };

      // If a followup has no date-related attributes set, it is not helpful to this classifier
      visitArray = visitArray.filter(x => x.visit_date !== null && x.visit_number !== null);

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
          subjectWithVisits.consecutive_viral_loads_below_threshold_begin_at_followup
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

  updateSubjectClassifications = async () => {
    this.getFollowUpsWithHIV()
      .then((followUps) => {
        const subjectToVisitMap = HIVCohortFilterCase.makeSubjectToVisitMap(followUps);

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

  makeCohortJSONFile = (subjectsIn) => {
    const annotatedObj = {
      viral_load_upper_bound: this.state.viralLoadFromUser.toString(),
      maintained_for_at_least_this_many_months: this.state.numConsecutiveMonthsFromUser.toString(),
      subjects: subjectsIn,
    };

    const blob = new Blob([JSON.stringify(annotatedObj, null, 2)], { type: 'text/json' });
    return blob;
  }

  downloadEC = () => {
    const fileName = `ec-cohort-vload-${this.state.viralLoadFromUser.toString()
    }-months-${this.state.numConsecutiveMonthsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectEC);
    FileSaver.saveAs(blob, fileName);
  }

  showCount = (isEC) => {
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
        <div className='hiv-cohort-filter__sidebar'>
          <form>
            <h2 className='hiv-cohort-filter__sidebar-title'>
              EC Classifier
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
              Maintained for at least:
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
            <div className='hiv-cohort-filter__svg-wrapper' id='EC-svg-wrapper'>
              <CohortECSvg width='665px' />
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='vload-overlay-4'
              >
                &nbsp; &lt; { this.state.viralLoadFromUser || '--'} &nbsp;cp/mL
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='consecutive-months-overlay-2'
              >
                { this.state.numConsecutiveMonthsFromUser || '--' } &nbsp;months
              </div>
              <div
                className='hiv-cohort-filter__value-highlight-2 hiv-cohort-filter__overlay'
                id='ec-counts-overlay-1'
              >
                { this.showCount(true) }
              </div>
              <div
                className='hiv-cohort-filter__value-highlight-2 hiv-cohort-filter__overlay'
                id='control-counts-overlay-2'
              >
                { this.showCount(false) }
              </div>

              <div
                id='download-EC-cohort-overlay'
                className='hiv-cohort-filter__overlay'
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

              <div id='download-control-cohort-overlay-EC' className='hiv-cohort-filter__overlay'>
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

export default ECCase;
