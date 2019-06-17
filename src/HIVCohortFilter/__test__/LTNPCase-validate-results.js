/* eslint-disable no-console */
const fileName = process.argv[2];
const ltnpResults = require(fileName); // eslint-disable-line
const lowerLimitCD4Count = ltnpResults.lower_bound_for_CD4_count;
const lowerLimitForNumYearsPositive = ltnpResults.lower_bound_for_num_years_hiv_positive;
console.log(`Validating LTNP results with argument ${lowerLimitCD4Count}, ${lowerLimitForNumYearsPositive}`);

function sortByKey(array, key) {
  return array.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0)); // eslint-disable-line
  });
}

function confirmPatientIsLTNP(subjectObj) {
  const subjectID = subjectObj.subject_id;
  const followUps = sortByKey(subjectObj.follow_ups, 'visit_date');
  const fposdate = followUps[0].fposdate;
  const frstdthd = followUps[0].frstdthd;
  const indexOfFirstFollowUpInFposYear = followUps.findIndex(visit => visit.visit_date >= fposdate);
  if (indexOfFirstFollowUpInFposYear === -1) {
    console.log(`Error, subject ${subjectID} has no followup data after their fposdate.`);
    return;
  }
  const dt = new Date();
  const currentYear = dt.getFullYear();
  if (currentYear - fposdate < lowerLimitForNumYearsPositive) {
    console.log(`Error with subject ${subjectID}: fposdate = ${fposdate} is too recent relative to current year ${currentYear}`);
    return;
  }
  if (frstdthd - fposdate < lowerLimitForNumYearsPositive) {
    console.log(`Error with subject ${subjectID}: fposdate = ${fposdate} is too recent relative to year of death ${frstdthd}`);
    return;
  }
  if (subjectObj.num_years_hiv_positive < lowerLimitForNumYearsPositive) {
    console.log(`Error with subject ${subjectID}: num_years_hiv_positive = ${subjectObj.num_years_hiv_positive} < ${frstdthd}`);
    return;
  }

  for (let i = indexOfFirstFollowUpInFposYear; i < followUps.length; i += 1) {
    const followUp = followUps[i];
    if (followUp.leu3n !== null && followUp.leu3n <= lowerLimitCD4Count) {
      console.error(`Error with subject ${subjectID}: the followup ${followUp.submitter_id}'s leu3n of ${followUp.leu3n} is <= ${lowerLimitCD4Count}`);
      return;
    }
  }

  const indexOfFollowupWithHAART = followUps.findIndex(visit => (visit.thrpyv != null && visit.thrpyv.includes('HAART'))
      || (visit.thrpy != null && visit.thrpy.includes('HAART')));

  if (indexOfFollowupWithHAART !== -1) {
    const submitterIDForFollowUpWithHAART = followUps[indexOfFollowupWithHAART].submitter_id;
    console.log(`Error with subject ${subjectID}: followup ${submitterIDForFollowUpWithHAART} indicates subject has received HAART therapy.`);
  }
}

ltnpResults.subjects.forEach((subjectObj) => {
  confirmPatientIsLTNP(subjectObj);
});

console.log('Validation complete.');
