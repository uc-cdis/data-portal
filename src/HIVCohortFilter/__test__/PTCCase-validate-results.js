/* eslint-disable no-console */
const fileName = process.argv[2];
const ptcResults = require(fileName); // eslint-disable-line
const viralLoadUpperBound = ptcResults.viral_load_upper_bound;
const numConsecutiveMonthsOnHAART = ptcResults.num_consecutive_months_on_haart;
const numConsecutiveVisits = Math.floor(numConsecutiveMonthsOnHAART / 6);
console.log(`Validating PTC results with argument ${viralLoadUpperBound}, ${numConsecutiveMonthsOnHAART}`);

function checkIfConsecutiveFollowUpsLessThanViralLoadLimit(subjectID, followUps) {
  followUps.forEach((fu) => {
    if (fu.viral_load >= viralLoadUpperBound) {
      console.error(`Error with subject ${subjectID}: the follow up ${fu.submitter_id}'s viral_load = ${fu.viral_load} >= ${viralLoadUpperBound}`);
    }
    if (fu.thrpyv !== 'HAART') {
      console.error(`Error with subject ${subjectID}: the follow up ${fu.submitter_id}'s thrpyv = ${fu.thrpyv} !== HAART`);
    }
  });
}

function confirmPatientIsPTC(subjectObj) {
  const subjectID = subjectObj.subject_id;
  const startFollowUpID = subjectObj.consecutive_haart_treatments_begin_at_followup;
  const followUps = subjectObj.follow_ups;
  for (let i = 0; i < followUps.length; i += 1) {
    const followUp = followUps[i];
    if (followUp.submitter_id === startFollowUpID) {
      const window = followUps.slice(i, i + numConsecutiveVisits);
      checkIfConsecutiveFollowUpsLessThanViralLoadLimit(subjectID, window);

      // The number of months elapsed inside this window
      const windowSize = (window[window.length - 1].visit_date - window[0].visit_date) * 12;
      if (windowSize > numConsecutiveMonthsOnHAART * 2) {
        // If the windowSize is more than double, this indicates a large amount of missing data
        console.log(`Warning: subject ${subjectID}'s sliding window is of size ${windowSize} > ${numConsecutiveMonthsOnHAART} months`);
      }

      const nextFollowUp = followUps[i + numConsecutiveVisits];
      if (nextFollowUp.thrpyv === 'HAART') {
        console.error(`Error with subject ${subjectID}: next follow up ${nextFollowUp.submitter_id}'s thrpyv = HAART`);
      }
      if (nextFollowUp.viral_load >= viralLoadUpperBound) {
        console.error(`Error with subject ${subjectID}: next follow up ${nextFollowUp.submitter_id}'s viral_load = ${nextFollowUp.viral_load} >= ${viralLoadUpperBound}`);
      }
      return;
    }
  }
  console.error(`Error with subject ${subjectID}: cannot find followup with submitter_id = ${startFollowUpID}`);
}

ptcResults.subjects.forEach((subjectObj) => {
  confirmPatientIsPTC(subjectObj);
});

console.log('Validation complete.');
