const fileName = process.argv[2];
const ecResults = require(fileName);
const viral_load_upper_bound = ecResults.viral_load_upper_bound;
const maintained_for_at_least_this_many_months = ecResults.maintained_for_at_least_this_many_months;
const numOfVisitForMonth = Math.floor(maintained_for_at_least_this_many_months / 6);
console.log(`Validating EC results with argument ${viral_load_upper_bound}, ${maintained_for_at_least_this_many_months}`);

function checkIfConsecutiveFollowUpsLessThanViralLoadLimit(subjectID, followUps) {
  followUps.forEach(fu => {
    if (fu.viral_load >= viral_load_upper_bound) {
      console.error(`Error with subject ${subjectID}: the followup ${fu.submitter_id}'s viral_load = ${fu.viral_load} >= ${viral_load_upper_bound}`);
    }
    if(fu.viral_load == null) {
      console.error(`Error with subject ${subjectID}: the followup ${fu.submitter_id}'s viral_load was null inside of the sliding window`);
    }
  })
}

function confirmPatientIsEC(subjectObj) {
  const subjectID = subjectObj.subject_id;
  const startFollowUpID = subjectObj.consecutive_viral_loads_below_threshold_begin_at_followup;
  const followUps = subjectObj.follow_ups;
  for (let i = 0; i < followUps.length; i ++) {
    const followUp = followUps[i];
    if (followUp.submitter_id === startFollowUpID) {
      let window = followUps.slice(i, i + numOfVisitForMonth);
      checkIfConsecutiveFollowUpsLessThanViralLoadLimit(subjectID, followUps.slice(i, i + numOfVisitForMonth));
      // The number of months elapsed inside this window
      let window_size = (window[window.length - 1].visit_date - window[0].visit_date) * 12;
      if(window_size > maintained_for_at_least_this_many_months * 2) {
        // If the window_size is more than double, this indicates a large amount of missing data
        console.log(`Warning: subject ${subjectID}'s sliding window is of size ${window_size} > ${maintained_for_at_least_this_many_months} months`);
      }
    }
    if (followUp.thrpyv === 'HAART' ) {
      console.error(`Error with subject ${subjectID}: the followup ${fu.submitter_id}'s thrpyv = ${fu.thrpyv}`);
    }
    if (followUp.thrpy === 'HAART' ) {
      console.error(`Error with subject ${subjectID}: the followup ${fu.submitter_id}'s thrpy = ${fu.thrpy}`);
    }
  }
}

ecResults.subjects.forEach(subjectObj => {
  confirmPatientIsEC(subjectObj);
});

console.log('Validation complete.');