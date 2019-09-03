import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import './HIVCohortFilter.css';
import CohortECSvg from '../img/cohort-EC.svg';
import Spinner from '../components/Spinner';
import HIVCohortFilterCase from './HIVCohortFilterCase';
import { useGuppyForExplorer } from '../configs';

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

  /*query Guppy and returns map of subjects with critical date for hiv positive subjects*/
  getSubjectWithTime = () => {
    if (useGuppyForExplorer) {
      const queryObject = {
        type: "subject",
        fields: [
          "subject_id",
          "fposdate",
          "frstaidd",
          "lnegdate",
          "frsthaad",
          "lastnohd",
          "frstartd",
          "lastnoad"
        ],
        filter:{
          AND:[
          {"=":{
            hiv_status:"positive"
            }
          },
          {"=":{
            project_id:"ndh-CHARLIE"
            }
          }]}
        };
      return HIVCohortFilterCase.performQuery(queryObject, null, false).then((data) => {
        /* eslint-disable no-underscore-dangle */
        if (!data
          || data.length == 0) {
          throw new Error('Error when query subjects with HIV');
        }

        const subjectList = [];
        var convy,haarty,arty;
        data.forEach((item) => {
          if (item.frstaidd <9000 && item.lnegdate>1978){
            convy = (item.frstaidd + item.lnegdate)/2
          }else{
            convy= item.fposdate
          }
          if (item.frsthaad<9000){
            haarty=(item.lastnohd + item.frsthaad)/2
          }
          if (item.frstartd<9000){
            arty=(item.lastnoad + item.frstartd)/2
          }
          subjectList.push({
            subject_id: item.subject_id,
            convy:convy,
            haarty:haarty,
            arty:arty
            })
        });
        return subjectList;
        // eslint-enable no-underscore-dangle
      });
    }
  }

// query guppy to get all the follow up for charlie project that has hiv-positive.
  getFollowupsBuckets = () => {
    if (useGuppyForExplorer) {
      const queryObject = {
        type: "follow_up",
        fields:[
          "subject_id",
          "harmonized_visit_number",
          "visit_date",
          "leu3n",
          "viral_load",
          "submitter_id"
        ],
        filter:{
          AND:[
          {"=":{
            hiv_status:"positive"
            }
          },
          {"=":{
            project_id:"ndh-CHARLIE"
            }
          }]}
        };
      return HIVCohortFilterCase.performQuery(queryObject, null, false).then((data) => {
        if (!data
          || data.length == 0) {
          throw new Error('Error while querying subjects with HIV');
        }
        return HIVCohortFilterCase.makeSubjectToVisitMap(data)
      });
    }
  }

// filter visits that does not qualify hiv positive, harrt negative and art negative
  filterFollowup =(subjectList,followupList) =>{
    var subject;
    const filtFollowup = {};
    subjectList.forEach((item) =>{
      subject = item.subject_id
      filtFollowup[subject] = []
      for (let i =0; i < followupList[subject].length; i++){
        if (followupList[subject][i].visit_date <= item.convy){
          continue ;
        }else if(followupList[subject][i].visit_date < item.haarty && followupList[subject][i].visit_date < item.arty){
          filtFollowup[subject].push(followupList[subject][i])
        }else{
          break;
        }
      }
    })
    const filtFollowups = Object.values(filtFollowup).filter(x =>(x.length!=0))
    return filtFollowups
  }

  async getBucketByKey() {
    const subjectList = await Promise.all([
      this.getSubjectWithTime()
    ]);
    const followupList = await Promise.all([
      this.getFollowupsBuckets()
    ]);
    return this.filterFollowup(subjectList[0],followupList[0])
  }

  visitsMatchECWindowCriteria = (visitArray) => {
    var nsuper = 0, nspike = 0, nEC = 0, lasttimepoint = 0, ec_visits = [], ec_period = {}, n_nonsuper = 0;
    for (let i = 0; i < visitArray.length; i += 1) {
      if (visitArray[i].viral_load <  this.state.supLoadFromUser){
        ec_visits.push(visitArray[i])
        nsuper += 1
        lasttimepoint = visitArray[i].visit_date
        n_nonsuper = 0
      }else if (visitArray[i].viral_load < this.state.spikeLoadFromUser){
        nspike += 1
        if (nspike > 1){
          if (nsuper >=this.state.supVisitFromUser){
            nEC += 1
            ec_period_key = "ec_perid_" + str(nEC)
            var number_visits = ec_visits.length - n_nonsuper
            ec_period[ec_period_key] = ec_visits.splice(0,number_visits)
          }
          nspike = 0
          nsuper = 0
          ec_visits = []
          lasttimepoint = 0
        }else{
          lasttimepoint = visitArray[i].visit_date
          ec_visits.push(visitArray[i])
          n_nonsuper += 1
        }
      }else if (visitArray[i].viral_load === null){
        if (visitArray[i].visit_date > lasttimepoint + 1){
          if (nsuper >=this.state.supVisitFromUser){
            nEC += 1
            ec_period_key = "ec_perid_" + str(nEC)
            var number_visits = ec_visits.length - n_nonsuper
            ec_period[ec_period_key] = ec_visits.splice(0,number_visits)
          }
          nsuper = 0
          nspike = 0
          ec_visits = []
          lasttimepoint = 0
        }else{
          ec_visits.push(visitArray[i])
          n_nonsuper += 1
        }
      }
    }
    return ec_period;
  }

  classifyAllSubjectEC = (filtFollowups) => {
    const subjectEC = [];
    const subjectControl = [];

    // For each patient, try to find numConsecutiveMonthsFromUser consecutive
    // visits that match the EC criteria
    filtFollowups.forEach((item) => {
      ec_period = this.visitsMatchECWindowCriteria(item)
      if (ec_period){
        subjectEC.push(ec_period);
      }else{
        subjectControl.push(item)
      }
    })
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
      viral_load_sup_upper_bound: this.state.supLoadFromUser.toString(),
      viral_load_spike_upper_bound: this.state.spikeLoadFromUser.toString(),
      maintained_for_at_least_this_many_visits: this.state.supVisitFromUser.toString(),
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
