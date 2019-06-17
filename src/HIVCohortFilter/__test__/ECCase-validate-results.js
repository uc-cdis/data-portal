/* eslint-disable no-console */
const fileName = process.argv[2];
const ecResults = require(fileName); // eslint-disable-line
const viralLoadUpperBound = ecResults.viral_load_upper_bound;
const maintainedForAtLeastThisManyMonths = ecResults.maintained_for_at_least_this_many_months;
const numOfVisitForMonth = Math.floor(maintainedForAtLeastThisManyMonths / 6);
console.log(`Validating EC results with argument ${viralLoadUpperBound}, ${maintainedForAtLeastThisManyMonths}`);

function checkIfConsecutiveFollowUpsLessThanViralLoadLimit(subjectID, followUps) {
  followUps.forEach((fu) => {
    if (fu.viral_load >= viralLoadUpperBound) {
      console.error(`Error with subject ${subjectID}: the followup ${fu.submitter_id}'s viral_load = ${fu.viral_load} >= ${viralLoadUpperBound}`);
    }
    if (fu.viral_load == null) {
      console.error(`Error with subject ${subjectID}: the followup ${fu.submitter_id}'s viral_load was null inside of the sliding window`);
    }
  });
}

function confirmPatientIsEC(subjectObj) {
  const subjectID = subjectObj.subject_id;
  const startFollowUpID = subjectObj.consecutive_viral_loads_below_threshold_begin_at_followup;
  const followUps = subjectObj.follow_ups;
  for (let i = 0; i < followUps.length; i += 1) {
    const followUp = followUps[i];
    if (followUp.submitter_id === startFollowUpID) {
      const window = followUps.slice(i, i + numOfVisitForMonth);
      checkIfConsecutiveFollowUpsLessThanViralLoadLimit(
        subjectID, followUps.slice(i, i + numOfVisitForMonth),
      );
      // The number of months elapsed inside this window
      const windowSize = (window[window.length - 1].visit_date - window[0].visit_date) * 12;
      if (windowSize > maintainedForAtLeastThisManyMonths * 2) {
        // If the windowSize is more than double, this indicates a large amount of missing data
        console.log(`Warning: subject ${subjectID}'s sliding window is of size ${windowSize} > ${maintainedForAtLeastThisManyMonths} months`);
      }
    }
    if (followUp.thrpyv === 'HAART') {
      console.error(`Error with subject ${subjectID}: the followup ${followUp.submitter_id}'s thrpyv = ${followUp.thrpyv}`);
    }
    if (followUp.thrpy === 'HAART') {
      console.error(`Error with subject ${subjectID}: the followup ${followUp.submitter_id}'s thrpy = ${followUp.thrpy}`);
    }
  }
}

ecResults.subjects.forEach((subjectObj) => {
  confirmPatientIsEC(subjectObj);
});

console.log('Validation complete.');
