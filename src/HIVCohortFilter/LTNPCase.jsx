import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import './HIVCohortFilter.css';
import CohortLTNPSvg from '../img/cohort-LTNP.svg';
import Spinner from '../components/Spinner';
import HIVCohortFilterCase from './HIVCohortFilterCase';

class LTNPCase extends HIVCohortFilterCase {
  /*
  * LTNP Case:
  * Below is the full algorithm description from https://ctds-planx.atlassian.net/browse/PXP-2909
  * The UI displays a 'decision tree' (just hardcoded svg), and makes an es query based on
  * sliding window size and viral load number.
  * Definitions:
  * - Never received HAART treatment: follow_up.thrpyv != HAART
  * - X years: (get.current_year - followup.fposdate)
  * - CD4 > Y: followup.leu3n > Y
  * - leu3n is the number of CD4 cells (laboratory result summary node)
  * - fposdate is the year the subject is first seen as hiv_positive (hiv_history node)
  * - frstdthd is the subject's year of death
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
    this.state = Object.assign(this.state, {
      CD4FromUser: undefined,
      numConsecutiveYearsFromUser: undefined,
      subjectLTNP: [],
      subjectControl: [],
    });
    this.CD4InputRef = React.createRef();
    this.numConsecutiveYearsInputRef = React.createRef();
  }

  getBucketByKeyWithHAARTVAR = (bucketKey, isHAART) => {
    const d = new Date();
    const currentYear = d.getFullYear();
    const query = `
    {
      follow_up {
        aggregations(filters: {first: 10000, op: "and", content: [
          {op: "${isHAART ? '=' : '!='}", content: {field: "thrpyv", value: "HAART"}},
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
    return HIVCohortFilterCase.performQuery(query).then((res) => {
      if (!res || !res.data || !res.data.follow_up || !res.data.follow_up.aggregations) {
        throw new Error('Error while querying subjects with HIV');
      }
      return res.data.follow_up.aggregations[bucketKey].buckets;
    });
  }

  isALargeAmountOfFollowUpDataMissing = (visitArray, currentYear) => {
    // If the subject does not have at least 1 visit every Z years, disqualify them
    const Z = 5;
    const fposdate = visitArray[0].fposdate;
    const upperBound = Math.min(visitArray[0].frstdthd, currentYear);
    if (upperBound - fposdate <= Z - 1 && visitArray.length >= 1) {
      // If subject has been positive (Z-1) or less years, and there's 1 visit, that's ok
      return false;
    }

    for (let yearX = fposdate; yearX <= upperBound - Z; yearX += 1) {
      const yearFound = visitArray.findIndex(fu => (fu.visit_date >= yearX
        && fu.visit_date <= yearX + Z));
      if (yearFound === -1) {
        return true;
      }
    }
    return false;
  }

  classifyAllSubjectLTNP = (subjectToVisitMap) => {
    const subjectLTNP = [];
    const subjectControl = [];

    const d = new Date();
    const currentYear = d.getFullYear();

    // For each subject, extract the visits with visit_date > fposdate and check their CD4 counts
    Object.keys(subjectToVisitMap).forEach((subjectId) => {
      const visitArray = subjectToVisitMap[subjectId];
      const numYearsHIVPositive = Math.min(
        currentYear, visitArray[0].frstdthd,
      ) - visitArray[0].fposdate;
      if (numYearsHIVPositive < this.state.numConsecutiveYearsFromUser) {
        // The subject is neither control nor LTNP
        return;
      }

      if (this.isALargeAmountOfFollowUpDataMissing(visitArray, currentYear)) {
        // Disqualify the subject because they're missing lots of data
        return;
      }

      const subjectWithVisits = {
        subject_id: subjectId,
        num_years_hiv_positive: numYearsHIVPositive,
        follow_ups: visitArray,
      };

      const followUpsAfterFposDate = visitArray.filter(x => (x.visit_date >= x.fposdate));
      const followUpsWithCD4CountsBelowThresholdAfterFposDate = followUpsAfterFposDate.filter(
        x => (x.leu3n <= this.state.CD4FromUser && x.leu3n != null),
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

  updateSubjectClassifications = async () => {
    this.getFollowUpsWithHIV()
      .then((followUps) => {
        const subjectToVisitMap = HIVCohortFilterCase.makeSubjectToVisitMap(followUps);

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

  makeCohortJSONFile = (subjectsIn) => {
    const annotatedObj = {
      lower_bound_for_CD4_count: this.state.CD4FromUser.toString(),
      lower_bound_for_num_years_hiv_positive: this.state.numConsecutiveYearsFromUser.toString(),
      subjects: subjectsIn,
    };

    const blob = new Blob([JSON.stringify(annotatedObj, null, 2)], { type: 'text/json' });
    return blob;
  }

  downloadLTNP = () => {
    const fileName = `ltnp-cohort-CD4-${this.state.CD4FromUser.toString()
    }-years-${this.state.numConsecutiveYearsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectLTNP);
    FileSaver.saveAs(blob, fileName);
  }

  downloadControl = () => {
    const fileName = `control-cohort-cd4-${this.state.CD4FromUser.toString()
    }-years-${this.state.numConsecutiveYearsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectControl);
    FileSaver.saveAs(blob, fileName);
  }

  checkReadyToCalculate = () => {
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

  showCount = (isLTNP) => {
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
        <div className='hiv-cohort-filter__sidebar'>
          <form>
            <h2 className='hiv-cohort-filter__sidebar-title'>
              LTNP Classifier
            </h2>
            <h4 className='hiv-cohort-filter__sidebar-subtitle'>
              Customized Filters
            </h4>
            <div className='hiv-cohort-filter__sidebar-input-label'>
              CD4 Counts remain:
              <span
                className='hiv-cohort-filter__value-highlight'
              >
                &nbsp; &gt; { this.state.CD4FromUser || '__' }
              </span>
            </div>
            <div className='hiv-cohort-filter__sidebar-input'>
              <input
                ref={this.CD4InputRef}
                className='hiv-cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.CD4FromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='hiv-cohort-filter__sidebar-input-label'>
              Maintained for at least:
              <br />
              <span className='hiv-cohort-filter__value-highlight'>{ this.state.numConsecutiveYearsFromUser || '__' } years</span>
            </div>
            <div className='hiv-cohort-filter__sidebar-input'>
              <input
                ref={this.numConsecutiveYearsInputRef}
                className='hiv-cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.numConsecutiveYearsFromUser}
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
            <div className='hiv-cohort-filter__svg-wrapper'>
              <CohortLTNPSvg width='665px' />
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='cd4-overlay-1'
              >
                &nbsp; &gt; { this.state.CD4FromUser || '--'}
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='cd4-overlay-2'
              >
                &nbsp; &gt; { this.state.CD4FromUser || '--' }
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='consecutive-years-overlay-1'
              >
                { this.state.numConsecutiveYearsFromUser || '--' } &nbsp;{this.state.numConsecutiveYearsFromUser === 1 ? 'year' : 'years'}
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='consecutive-years-overlay-2'
              >
                { this.state.numConsecutiveYearsFromUser || '--' } &nbsp;{this.state.numConsecutiveYearsFromUser === 1 ? 'year' : 'years'}
              </div>
              <div
                className='hiv-cohort-filter__value-highlight-2 hiv-cohort-filter__overlay'
                id='ltnp-counts-overlay-1'
              >
                { this.showCount(true) }
              </div>
              <div
                className='hiv-cohort-filter__value-highlight-2 hiv-cohort-filter__overlay'
                id='control-counts-overlay-3'
              >
                { this.showCount(false) }
              </div>

              <div
                id='download-LTNP-cohort-overlay'
                className='hiv-cohort-filter__overlay'
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

              <div id='download-control-cohort-overlay-LTNP' className='hiv-cohort-filter__overlay'>
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

export default LTNPCase;
