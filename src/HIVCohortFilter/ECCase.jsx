/* eslint-disable camelcase */
import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import './HIVCohortFilter.css';
import CohortECSvg from '../img/cohort-EC.svg';
import Spinner from '../components/Spinner';
import HIVCohortFilterCase from './HIVCohortFilterCase';
import { config } from '../params';

const hivAppProjects = config.hivAppProjects || ['HIV-CHARLIE'];
class ECCase extends HIVCohortFilterCase {
  /*
  * EC Case:
  * Below is the full algorithm description from https://ctds-planx.atlassian.net/browse/PXP-2892
  * The UI displays a 'decision tree' (just hardcoded svg), and makes an es query based on
  * sliding window size and viral load number.
  * Definitions:
  * - thrpy is the treatment that patient used since the last visit
  * - thrpyv is the treatment that patient uses at the visit
  * Definitions:
  * - Never received HAART treatment: visit.thrpyv != HAART
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
      suppressViralLoadFromUser: undefined,
      spikeViralLoadFromUser: undefined,
      numConsecutiveVisitsFromUser: undefined,
      subjectNeither: [],
      subjectEC: [],
      subjectControl: [],
    });
    this.suppressViralLoadInputRef = React.createRef();
    this.spikeViralLoadInputRef = React.createRef();
    this.numConsecutiveVisitsInputRef = React.createRef();
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

  // Identify EC period for each subject. In each EC period, 1 spike viral load period is allowed.
  // Missing viral load measurement period should be less than 2 years.
  // Extract subject_id and first hiv positive visit.
  visitsMatchECWindowCriteria = (visitArray) => {
    let nSuper = 0;
    let nSpike = 0;
    let nEC = 0;
    let lastTimePoint = 0;
    let ecVisits = [];
    const ecPeriod = {};
    let nNonsuper = 0;
    const fhv = visitArray[0].submitter_id;
    const { subject_id } = visitArray[0];
    for (let i = 0; i < visitArray.length; i += 1) {
      if (visitArray[i].viral_load != null
        && visitArray[i].viral_load < this.state.suppressViralLoadFromUser) {
        ecVisits.push(visitArray[i]);
        nSuper += 1;
        nNonsuper = 0;
        lastTimePoint = visitArray[i].visit_date;
        if (i === visitArray.length - 1 && nSuper >= this.state.numConsecutiveVisitsFromUser) {
          nEC += 1;
          const ecPeriodKey = `ec_period_${nEC}`;
          const numberVisits = ecVisits.length - nNonsuper;
          ecPeriod[ecPeriodKey] = ecVisits.splice(0, numberVisits);
        }
      } else if (visitArray[i].viral_load < this.state.spikeViralLoadFromUser && nSuper > 0) {
        nSpike += 1;
        if (nSpike > 1) {
          if (nSuper >= this.state.numConsecutiveVisitsFromUser) {
            nEC += 1;
            const ecPeriodKey = `ec_period_${nEC}`;
            const numberVisits = ecVisits.length - nNonsuper;
            ecPeriod[ecPeriodKey] = ecVisits.splice(0, numberVisits);
          }
          nSpike = 0;
          nSuper = 0;
          ecVisits = [];
          lastTimePoint = 0;
        } else {
          lastTimePoint = visitArray[i].visit_date;
          ecVisits.push(visitArray[i]);
          nNonsuper += 1;
        }
      } else if (visitArray[i].viral_load === null && nSuper > 0) {
        if (visitArray[i].visit_date > lastTimePoint + 1) {
          if (nSuper >= this.state.numConsecutiveVisitsFromUser) {
            nEC += 1;
            const ecPeriodKey = `ec_perid_${nEC}`;
            const numberVisits = ecVisits.length - nNonsuper;
            ecPeriod[ecPeriodKey] = ecVisits.splice(0, numberVisits);
          }
          nSuper = 0;
          nSpike = 0;
          ecVisits = [];
          lastTimePoint = 0;
        } else {
          ecVisits.push(visitArray[i]);
          nNonsuper += 1;
        }
      }
    }
    const updateContent = {
      subject_id,
      first_hiv_positive_visit: fhv,
      ecPeriod,
    };
    return updateContent;
  }

  classifyAllSubjectEC = (filtFollowups) => {
    const subjectEC = [];
    const subjectControl = [];

    // For each patient, try to find numConsecutiveVisitsFromUser consecutive
    // visits that match the EC criteria
    filtFollowups.forEach((item) => {
      const updateContent = this.visitsMatchECWindowCriteria(item);
      const { ecPeriod } = updateContent;
      if (Object.keys(ecPeriod).length === 0) {
        subjectControl.push(item);
      } else {
        subjectEC.push(updateContent);
      }
    });
    return {
      subjectEC,
      subjectControl,
    };
  }

  updateSubjectClassifications = async () => {
    this.getBucketByKey()
      .then((filtFollowups) => {
        const {
          subjectEC,
          subjectControl,
        } = this.classifyAllSubjectEC(filtFollowups);
        this.setState({
          subjectEC,
          subjectControl,
          inLoadingState: false,
          resultAlreadyCalculated: true,
        });
      });
  }

  makeCohortJSONFile = (subjectsIn) => {
    const annotatedObj = {
      viral_load_sup_upper_bound: this.state.suppressViralLoadFromUser.toString(),
      viral_load_spike_upper_bound: this.state.spikeViralLoadFromUser.toString(),
      maintained_for_at_least_this_many_visits: this.state.numConsecutiveVisitsFromUser.toString(),
      subjects: subjectsIn,
    };

    const blob = new Blob([JSON.stringify(annotatedObj, null, 2)], { type: 'text/json' });
    return blob;
  }

  downloadEC = () => {
    const fileName = `ec-cohort-suppressvload-${this.state.suppressViralLoadFromUser.toString()
    }-spikevload-${this.state.spikeViralLoadFromUser.toString()
    }-visits-${this.state.numConsecutiveVisitsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectEC);
    FileSaver.saveAs(blob, fileName);
  }

  checkReadyToCalculate = () => {
    const suppressViralLoadFromUser = this.suppressViralLoadInputRef.current.valueAsNumber;
    const spikeViralLoadFromUser = this.spikeViralLoadInputRef.current.valueAsNumber;
    const numConsecutiveVisitsFromUser = this.numConsecutiveVisitsInputRef.current.valueAsNumber;
    this.setState({
      suppressViralLoadFromUser: suppressViralLoadFromUser > 0
        ? suppressViralLoadFromUser : undefined,
      spikeViralLoadFromUser: spikeViralLoadFromUser > 0
        ? spikeViralLoadFromUser : undefined,
      numConsecutiveVisitsFromUser: numConsecutiveVisitsFromUser > 0
        ? numConsecutiveVisitsFromUser : undefined,
      isReadyToCalculate: (suppressViralLoadFromUser > 0
        && spikeViralLoadFromUser > 0
        && numConsecutiveVisitsFromUser > 0),
      resultAlreadyCalculated: false,
    });
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
        <div className='hiv-cohort-filter__ec-sidebar'>
          <form>
            <h2 className='hiv-cohort-filter__sidebar-title'>
              EC Classifier
            </h2>
            <h4 className='hiv-cohort-filter__sidebar-subtitle'>
              Customized Filters
            </h4>
            <div className='hiv-cohort-filter__sidebar-input-label'>
              Suppress Viral Load
              <span
                className='hiv-cohort-filter__value-highlight'
              >
                &nbsp; &lt; { this.state.suppressViralLoadFromUser || '__' } &nbsp;cp/mL
              </span>
            </div>
            <div className='hiv-cohort-filter__sidebar-input'>
              <input
                ref={this.suppressViralLoadInputRef}
                className='hiv-cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.suppressViralLoadFromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='hiv-cohort-filter__sidebar-input-label'>
              Spike Viral Load
              <span
                className='hiv-cohort-filter__value-highlight'
              >
                &nbsp; &lt; { this.state.spikeViralLoadFromUser || '__' } &nbsp;cp/mL
              </span>
            </div>
            <div className='hiv-cohort-filter__sidebar-input'>
              <input
                ref={this.spikeViralLoadInputRef}
                className='hiv-cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.spikeViralLoadFromUser}
                placeholder='enter integer'
              />
              <br />
            </div>
            <div className='hiv-cohort-filter__sidebar-input-label'>
              Maintained for at least:
              <br />
              <span className='hiv-cohort-filter__value-highlight'>{ this.state.numConsecutiveVisitsFromUser || '__' } &nbsp;{this.state.numConsecutiveVisitsFromUser === 1 ? 'visit' : 'visits'}</span>
            </div>
            <div className='hiv-cohort-filter__sidebar-input'>
              <input
                ref={this.numConsecutiveVisitsInputRef}
                className='hiv-cohort-filter__text-input'
                type='number'
                onChange={this.checkReadyToCalculate}
                defaultValue={this.state.numConsecutiveVisitsFromUser}
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
                &nbsp; &lt; { this.state.suppressViralLoadFromUser || '__'} &nbsp;cp/mL
              </div>
              <div
                className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay'
                id='consecutive-months-overlay-2'
              >
                { this.state.numConsecutiveVisitsFromUser || '__' } &nbsp;{this.state.numConsecutiveVisitsFromUser === 1 ? 'visit' : 'visits'}
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
