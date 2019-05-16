const fileName = process.argv[2];
const ptcResults = require(fileName);
const viral_load_upper_bound = ptcResults.viral_load_upper_bound;
const num_consective_months_on_haart = ptcResults.num_consective_months_on_haart;
const numConsecutiveVisits = Math.floor(num_consective_months_on_haart / 6);
console.log(`Validating PTC results with argument ${viral_load_upper_bound}, ${num_consective_months_on_haart}`);

function checkIfConsecutiveFollowUpsLessThanViralLoadLimit(subjectID, followUps) {
  followUps.forEach(fu => {
    if (fu.viral_load >= viral_load_upper_bound) {
      console.error(`Error with subject ${subjectID}: the follow up ${fu.submitter_id}'s viral_load = ${fu.viral_load} >= ${viral_load_upper_bound}`);
    }
    if (fu.thrpyv !== 'HAART') {
      console.error(`Error with subject ${subjectID}: the follow up ${fu.submitter_id}'s thrpyv = ${fu.thrpyv} !== ${thrpyv}`);
    }
  })
}

function confirmPatientIsPTC(subjectObj) {
  const subjectID = subjectObj.subject_id;
  const startFollowUpID = subjectObj.consecutive_haart_treatments_begin_at_followup;
  const followUps = subjectObj.follow_ups;
  for (let i = 0; i < followUps.length; i ++) {
    const followUp = followUps[i];
    if (followUp.submitter_id === startFollowUpID) {
      let window = followUps.slice(i, i + numConsecutiveVisits);
      checkIfConsecutiveFollowUpsLessThanViralLoadLimit(subjectID, window);

      // The number of months elapsed inside this window
      let window_size = (window[window.length - 1].visit_date - window[0].visit_date) * 12;
      if(window_size > num_consective_months_on_haart * 2) {
        // If the window_size is more than double, this indicates a large amount of missing data
        console.log(`Warning: subject ${subjectID}'s sliding window is of size ${window_size} > ${num_consective_months_on_haart} months`);
      }

      const nextFollowUp = followUps[i + numConsecutiveVisits];
      if (nextFollowUp.thrpyv === 'HAART') {
        console.error(`Error with subject ${subjectID}: next follow up ${nextFollowUp.submitter_id}'s thrpyv = HAART`);
      }
      if (nextFollowUp.viral_load >= viral_load_upper_bound) {
        console.error(`Error with subject ${subjectID}: next follow up ${nextFollowUp.submitter_id}'s viral_load = ${nextFollowUp.viral_load} >= ${viral_load_upper_bound}`);
      }
      return;
    }
  }
  console.error(`Error with subject ${subjectID}: cannot find followup with submitter_id = ${startFollowUpID}`);
}

ptcResults.subjects.forEach(subjectObj => {
  confirmPatientIsPTC(subjectObj);
});

console.log('Validation complete.');