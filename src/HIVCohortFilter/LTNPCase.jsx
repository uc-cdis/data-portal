/* eslint-disable camelcase */
import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import './HIVCohortFilter.css';
import CohortLTNPSvg from '../img/cohort-LTNP.svg';
import Spinner from '../components/Spinner';
import HIVCohortFilterCase from './HIVCohortFilterCase';
import { config } from '../params';

const hivAppProjects = config.hivAppProjects || ['HIV-CHARLIE'];

class LTNPCase extends HIVCohortFilterCase {
  /*
  * LTNP Case:
  * Below is the full algorithm description from https://ctds-planx.atlassian.net/browse/PXP-2909
  * The UI displays a 'decision tree' (just hardcoded svg), and makes an es query based on
  * sliding window size and viral load number.
  * Definitions:
  * - Never received HAART treatment: visit.thrpyv != HAART
  * - X years: (get.current_year - followup.fposdate)
  * - CD4 > Y: followup.leu3n > Y
  * - leu3n is the number of CD4 cells (laboratory result summary node)
  * - fposdate is the year the subject is first seen as hiv_positive (hiv_history node)
  * - frstdthd is the subject's year of death
  * Definitions:
  * - Never received HAART treatment: visit.thrpyv != HAART
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

  /* query Guppy and returns map of subjects with critical date for hiv positive subjects */
  getSubjectWithTime = () => {
    const queryObject = {
      type: 'subject',
      fields: [
        'subject_id',
        'fposdate',
        'frstaidd',
        'lnegdate',
        'frsthaad',
        'lastnohd',
        'frstartd',
        'lastnoad',
      ],
      filter: {
        AND: [
          {
            '=': {
              hiv_status: 'positive',
            },
          },
          {
            in: {
              project_id: hivAppProjects,
            },
          }],
      },
    };
    return HIVCohortFilterCase.performQuery(queryObject, null, false).then((data) => {
      if (!data
          || data.length === 0) {
        throw new Error('Error when query subjects with HIV');
      }

      const subjectList = [];
      let convy;
      let haarty;
      let arty;
      data.forEach((item) => {
        if (item.frstaidd < 9000 && item.lnegdate > 1978) {
          convy = (item.frstaidd + item.lnegdate) / 2;
        } else {
          convy = item.fposdate;
        }
        if (item.frsthaad < 9000) {
          haarty = (item.lastnohd + item.frsthaad) / 2;
        } else {
          haarty = null;
        }
        if (item.frstartd < 9000) {
          arty = (item.lastnoad + item.frstartd) / 2;
        } else {
          arty = null;
        }
        subjectList.push({
          subject_id: item.subject_id,
          convy,
          haarty,
          arty,
        });
      });
      return subjectList;
    });
  }

  // query guppy to get all the follow up for charlie project that has hiv-positive.
  getFollowupsBuckets = () => {
    const queryObject = {
      type: this.state.visitIndexTypeName,
      fields: [
        'subject_id',
        'harmonized_visit_number',
        'visit_date',
        'leu3n',
        'viral_load',
        'submitter_id',
      ],
      filter: {
        AND: [
          {
            '=': {
              hiv_status: 'positive',
            },
          },
          {
            in: {
              project_id: hivAppProjects,
            },
          }],
      },
    };
    return HIVCohortFilterCase.performQuery(queryObject, null, false).then((data) => {
      if (!data
          || data.length === 0) {
        throw new Error('Error while querying subjects with HIV');
      }
      return HIVCohortFilterCase.makeSubjectToVisitMap(data);
    });
  }

  // filter visits that does not qualify hiv positive, harrt negative and art negative
  filterFollowup =(subjectList, followupList) => {
    let subject;
    const filtFollowup = {};
    subjectList.forEach((item) => {
      subject = item.subject_id;
      filtFollowup[subject] = [];
      for (let i = 0; i < followupList[subject].length; i += 1) {
        if (followupList[subject][i].visit_date <= item.convy
          || followupList[subject][i].visit_date == null) {
          // eslint-disable-next-line no-continue
          continue;
        } else if ((item.haarty === null && item.arty === null)
        || (item.haarty === null && followupList[subject][i].visit_date < item.arty)
        || (item.arty === null && followupList[subject][i].visit_date < item.haarty)
        || (followupList[subject][i].visit_date < item.arty
          && followupList[subject][i].visit_date < item.haarty)) {
          filtFollowup[subject].push(followupList[subject][i]);
        } else {
          break;
        }
      }
    });
    const filtFollowups = Object.values(filtFollowup).filter((x) => (x.length !== 0));
    return filtFollowups;
  }

  async getBucketByKey() {
    const subjectList = await Promise.all([
      this.getSubjectWithTime(),
    ]);
    const followupList = await Promise.all([
      this.getFollowupsBuckets(),
    ]);
    return this.filterFollowup(subjectList[0], followupList[0]);
  }

  // classify LTNP. Does not allow leu3n==null at the beginning or between eligible visits
  classifyAllSubjectLTNP = (filtFollowups) => {
    const subjectLTNP = [];
    const subjectControl = [];

    // For each subject, extract first year of hiv positive (fhv) and check their
    // CD4 counts to extract first visit that the case qualifies LTNP
    filtFollowups.forEach((item) => {
      const fhv = item[0].submitter_id;
      const { subject_id } = item[0];
      const duration = item.slice(-1)[0].visit_date - item[0].visit_date;
      if (duration < this.state.numConsecutiveYearsFromUser) {
        // The subject is neither control nor LTNP
        return;
      }
      let leu3nhy = 0;
      let ltnp_fv = '';
      const ltnp_v = [];
      let ltnp_fy = '';
      const firstyh = item[0].visit_date;
      let ltnp_visit = false;
      for (let i = 0; i < item.length; i += 1) {
        if (item[i].leu3n > 500) {
          leu3nhy = item[i].visit_date;
          if (!ltnp_visit && (leu3nhy - firstyh) > 5) {
            ltnp_visit = true;
            ltnp_v.push(item[i].submitter_id);
            ltnp_fv = item[i].submitter_id;
            ltnp_fy = item[i].visit_date;
          } else if (ltnp_visit && (leu3nhy - firstyh) > 5) {
            ltnp_v.push(item[i].submitter_id);
          }
        } else {
          // eslint-disable-next-line no-param-reassign
          item = item.splice(0, i);
          break;
        }
      }
      const leu3nhdu = leu3nhy - firstyh;
      const update_content = {
        subject_id,
        first_hiv_positive_visit: fhv,
        first_visit_qualify_ltnp: ltnp_fv,
        first_year_qualify_ltnp: ltnp_fy,
        all_visit_qualify_ltnp: ltnp_v,
        follow_ups: item,
      };

      if (leu3nhdu > this.state.numConsecutiveYearsFromUser) {
        subjectLTNP.push(update_content);
      } else {
        subjectControl.push(update_content);
      }
    });
    return {
      subjectLTNP,
      subjectControl,
    };
  }

  updateSubjectClassifications = async () => {
    this.getBucketByKey()
      .then((filtFollowups) => {
        const {
          subjectLTNP,
          subjectControl,
        } = this.classifyAllSubjectLTNP(filtFollowups);
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
              <span className='hiv-cohort-filter__value-highlight'>{ this.state.numConsecutiveYearsFromUser || '__' } &nbsp;{this.state.numConsecutiveYearsFromUser === 1 ? 'year' : 'years'}</span>
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
                &nbsp; &gt; { this.state.CD4FromUser || '__'}
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='cd4-overlay-2'
              >
                &nbsp; &gt; { this.state.CD4FromUser || '__' }
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='consecutive-years-overlay-1'
              >
                { this.state.numConsecutiveYearsFromUser || '__' } &nbsp;{this.state.numConsecutiveYearsFromUser === 1 ? 'year' : 'years'}
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='consecutive-years-overlay-2'
              >
                { this.state.numConsecutiveYearsFromUser || '__' } &nbsp;{this.state.numConsecutiveYearsFromUser === 1 ? 'year' : 'years'}
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='consecutive-years-overlay-3'
              >
                { this.state.numConsecutiveYearsFromUser || '__' } &nbsp;{this.state.numConsecutiveYearsFromUser === 1 ? 'year' : 'years'}
              </div>
              <div
                className='hiv-cohort-filter__value hiv-cohort-filter__overlay'
                id='consecutive-years-small-overlay-1'
              >
                { this.state.numConsecutiveYearsFromUser || '__' }
              </div>
              <div
                className='hiv-cohort-filter__value hiv-cohort-filter__overlay'
                id='consecutive-years-small-overlay-2'
              >
                { this.state.numConsecutiveYearsFromUser || '__' }
              </div>
              <div
                className='hiv-cohort-filter__value hiv-cohort-filter__overlay'
                id='consecutive-years-small-overlay-3'
              >
                { this.state.numConsecutiveYearsFromUser || '__' }
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
