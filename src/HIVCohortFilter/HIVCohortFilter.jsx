import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import { arrangerGraphqlPath } from '../localconf';
import { fetchWithCreds } from '../actions';
import './HIVCohortFilter.css';
import HaartTreeSvg from '../img/haart-tree.svg';
import Spinner from '../components/Spinner';

/*
* Below is the full algorithm description, from https://ctds-planx.atlassian.net/browse/PXP-2771
* - The UI displays a 'decision tree' (just hardcoded svg), and makes an es query based on
* sliding window size and viral load number.
* - thrpy is the treatment that patient used since the last visit (follow_up)
* - thrpyv is the treatment that patient uses at the visit (follow_up )
* Definitions:
* - With HAART treatment: follow_up.thrpyv = HAART or HAART (HU/ddI defined)
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
* Another known limitation: only the first 9999 elastic search records are queries,
* due to ES's 10k record query limit.
*/

class HIVCohortFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryResults: ['...'],
      viralLoadFromUser: 4000,
      numConsecutiveMonthsFromUser: 18,
      subjectNeither: [],
      subjectPTC: [],
      subjectControl: [],
      inLoadingState: true,
    };
    this.setViralLoadFromUser = this.setViralLoadFromUser.bind(this);
    this.setNumConsecutiveMonthsFromUser = this.setNumConsecutiveMonthsFromUser.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.downloadPTC = this.downloadPTC.bind(this);
    this.downloadControl = this.downloadControl.bind(this);
    this.makeCohortJSONFile = this.makeCohortJSONFile.bind(this);
    this.therapyValuesOfInterest = ['HAART', 'HAART (HU/ddI defined)'];
    this.updateSubjectClassifications();
  }

  getSubjectsWithHIV() {
    const query = `
            {
              follow_up {
                hits(filters: { op: "and",
                  content: [
                    { op: "=",
                      content: { field: "hiv_status", value: "positive" }
                    }
                  ]
                }, first:9999) {
                  edges {
                    node {
                      subject_id
                      submitter_id
                      auth_resource_path
                      viral_load
                      thrpy
                      thrpyv
                      age_at_visit
                      bmi
                      days_to_follow_up
                      pregnancy_status
                      hiv_status
                      drug_used
                      visit_date
                      visit_number
                      visit_type
                      visit_name
                      weight
                      weight_percentage
                      follow_up_id
                      tint
                    }
                  }
                }
              }
            }
        `;

    return this.performQuery(query);
  }

  setViralLoadFromUser(e) {
    const viralLoadFromUser = e.target.value;
    if (typeof viralLoadFromUser !== 'undefined'
            && viralLoadFromUser !== '' && !isNaN(parseFloat(viralLoadFromUser))) {
      this.setState({ viralLoadFromUser: parseFloat(viralLoadFromUser) });
    }
  }

  setNumConsecutiveMonthsFromUser(e) {
    const numConsecutiveMonthsFromUser = e.target.value;
    if (typeof numConsecutiveMonthsFromUser !== 'undefined'
            && numConsecutiveMonthsFromUser !== ''
            && !isNaN(parseFloat(numConsecutiveMonthsFromUser))) {
      this.setState({ numConsecutiveMonthsFromUser: parseFloat(numConsecutiveMonthsFromUser) });
    }
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

  updateFilters(event) {
    event.preventDefault();
    this.setState({ inLoadingState: true });
    this.updateSubjectClassifications();
  }

  doTheseVisitsMatchSlidingWindowCriteria(visitArray) {
    // The length of the array input to this function should be
    // == (this.state.numConsecutiveMonthsFromUser / 6)
    const upperBound = visitArray.length;
    for (let i = 0; i < upperBound; i += 1) {
      const vloadCheck = visitArray[i].viral_load < this.state.viralLoadFromUser;
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

      // The sliding window step. window is of size this.state.numConsecutiveMonthsFromUser
      for (let i = 0; i < visitArray.length - slidingWindowSize; i += 1) {
        const windowMatch = this.doTheseVisitsMatchSlidingWindowCriteria(
          visitArray.slice(i, i + slidingWindowSize),
        );
        if (windowMatch) {
          // Now that we know the first numConsecutiveMonthsFromUser visits in the array
          // match the criteria, we should check the following visit
          const theNextVisit = visitArray[i + slidingWindowSize];
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
            subjectPTC.push(subjectWithVisits);
          } else {
            // Found control!
            subjectControl.push(subjectWithVisits);
          }
          subjectWithVisits.consecutive_haart_treatments_begin_at_followup
                      = visitArray[i].submitter_id;

          // Done with classification
          return;
        }
      }

      // If the window above didn't apply, the subject is neither
      subjectNeither.push(subjectId);
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
    this.getSubjectsWithHIV()
      .then((result) => {
        const followUps = result.data.follow_up.hits.edges.map(x => x.node);

        // Convert to dictionary: { subject_id -> [ array of visits ] }
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

  downloadControl() {
    const fileName = `control-cohort-vload-${this.state.viralLoadFromUser.toString()
    }-months-${this.state.numConsecutiveMonthsFromUser.toString()}.json`;

    const blob = this.makeCohortJSONFile(this.state.subjectControl);
    FileSaver.saveAs(blob, fileName);
  }

  render() {
    return (
      <div className='hiv-cohort-filter'>
        <div className='hiv-cohort-filter__sidebar'>
          <form>
            <h2 className='hiv-cohort-filter__sidebar-title'>
                            PTC Cohort Selection
            </h2>
            <h4 className='hiv-cohort-filter__sidebar-subtitle'>
                            Customized Filters
            </h4>
            <div className='hiv-cohort-filter__sidebar-input-label'>
                            Viral Load <span className='hiv-cohort-filter__value-highlight'> &lt; { this.state.viralLoadFromUser }</span>
            </div>
            <div className='hiv-cohort-filter__sidebar-input'>
              <input className='text-input' type='text' onBlur={this.setViralLoadFromUser} defaultValue={this.state.viralLoadFromUser} /> <br />
            </div>
            <div className='hiv-cohort-filter__sidebar-input-label'>
                            Received HAART for at least:<br /> <span className='hiv-cohort-filter__value-highlight'>{ this.state.numConsecutiveMonthsFromUser } months</span>
            </div>
            <div className='hiv-cohort-filter__sidebar-input'>
              <input className='text-input' type='text' onBlur={this.setNumConsecutiveMonthsFromUser} defaultValue={this.state.numConsecutiveMonthsFromUser} /> <br />
            </div>
            <div className='hiv-cohort-filter__button-group'>
              <Button
                onClick={this.updateFilters}
                enabled={!this.state.inLoadingState}
                isPending={this.state.inLoadingState}
                label={this.state.inLoadingState ? 'Loading...' : 'Confirm'}
              />
            </div>
          </form>
        </div>


        <div className='hiv-cohort-filter__main'>
          <div className='hiv-cohort-filter__main-wrapper'>
            <div className='hiv-cohort-filter__svg-wrapper'>
              <HaartTreeSvg width='665px' />
              <div className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay' id='vload-overlay-1'>&lt; { this.state.viralLoadFromUser }</div>
              <div className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay' id='vload-overlay-2'>&lt; { this.state.viralLoadFromUser }</div>
              <div className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay' id='vload-overlay-3'>&lt; { this.state.viralLoadFromUser }</div>
              <div className='hiv-cohort-filter__value-highlight hiv-cohort-filter__overlay' id='consecutive-months-overlay-1'>{ this.state.numConsecutiveMonthsFromUser } months</div>

              <div className='hiv-cohort-filter__value-highlight-2 hiv-cohort-filter__overlay' id='ptc-counts-overlay-1'>{ this.state.inLoadingState ? <Spinner /> : this.state.subjectPTC.length }</div>
              <div className='hiv-cohort-filter__value-highlight-2 hiv-cohort-filter__overlay' id='control-counts-overlay-1'>{ this.state.inLoadingState ? <Spinner /> : this.state.subjectControl.length }</div>

              <div id='download-PTC-cohort-overlay' className='hiv-cohort-filter__overlay'>
                {
                  <React.Fragment>
                    <Button
                      onClick={this.downloadPTC}
                      label='Download Cohort'
                      className='btn-primary-blue'
                      rightIcon='download'
                      id='download-PTC-button'
                      enabled={this.state.subjectPTC.length !== 0 && !this.state.inLoadingState}
                      buttonType='primary'
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
                      className='btn-primary-blue'
                      rightIcon='download'
                      id='download-control-button'
                      enabled={this.state.subjectControl.length !== 0 && !this.state.inLoadingState}
                      onClick={this.downloadControl}
                      isPending={this.state.inLoadingState}
                    />
                  </React.Fragment>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HIVCohortFilter;
