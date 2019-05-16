const fileName = process.argv[2];
const ptcResults = require(fileName);
const limit = ptcResults.viral_load_upper_bound;
const month = ptcResults.num_consective_months_on_haart;
const numOfVisitForMonth = Math.floor(month / 6);
console.log(`Validating PTC results with argument ${limit}, ${month}`);

function checkIfConsecutiveFollowUpsLessThanViralLoadLimit(subjectID, followUps) {
  followUps.forEach(fu => {
    if (fu.viral_load >= limit) {
      console.error(`error with subject ${subjectID}: the follow up ${fu.submitter_id}'s viral_load = ${fu.viral_load} >= ${limit}`);
      process.exit(1);
    }
    if (fu.thrpyv !== 'HAART') {
      console.error(`error with subject ${subjectID}: the follow up ${fu.submitter_id}'s thrpyv = ${fu.thrpyv} !== ${thrpyv}`);
      process.exit(1);
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
      checkIfConsecutiveFollowUpsLessThanViralLoadLimit(subjectID, followUps.slice(i, i + numOfVisitForMonth));
      const nextFollowUp = followUps[i + numOfVisitForMonth];
      if (nextFollowUp.thrpyv === 'HAART') {
        console.error(`error with subject ${subjectID}: next follow up ${nextFollowUp.submitter_id}'s thrpyv = HAART`);
        process.exit(1);
      }
      if (nextFollowUp.viral_load >= limit) {
        console.error(`error with subject ${subjectID}: next follow up ${nextFollowUp.submitter_id}'s viral_load = ${nextFollowUp.viral_load} >= ${limit}`);
        process.exit(1);
      }
      return; // done validating this patient
    }
  }
  console.error(`cannot find submitter_id = ${startFollowUpID}`);
  process.exit(1);
}

ptcResults.subjects.forEach(subjectObj => {
  confirmPatientIsPTC(subjectObj);
});

console.log('Validation complete.');