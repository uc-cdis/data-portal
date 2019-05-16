const fileName = process.argv[2];
const ltnpResults = require(fileName);
const lower_limit_CD4_count = ltnpResults.lower_bound_for_CD4_count;
const lower_limit_for_num_years_positive = ltnpResults.lower_bound_for_num_years_hiv_positive;
console.log(`Validating LTNP results with argument ${lower_limit_CD4_count}, ${lower_limit_for_num_years_positive}`);

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        const x = a[key]; 
        const y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function confirmPatientIsLTNP(subjectObj) {
  const subjectID = subjectObj.subject_id;
  const followUps = sortByKey(subjectObj.follow_ups, "visit_date");
  const fposdate = followUps[0].fposdate;
  const frstdthd = followUps[0].frstdthd;
  const indexOfFirstFollowUpInFposYear = followUps.findIndex(visit => visit.visit_date >= fposdate);
  if (indexOfFirstFollowUpInFposYear == -1) {
    console.log(`Error, subject ${subjectID} has no followup data after their fposdate.`);
    return;
  }
  const dt = new Date();
  const currentYear = dt.getFullYear();
  if(currentYear - fposdate < lower_limit_for_num_years_positive) {
    console.log(`Error with subject ${subjectID}: fposdate = ${fposdate} is too recent relative to current year ${currentYear}`);
    return;
  }
  if(frstdthd - fposdate < lower_limit_for_num_years_positive) {
    console.log(`Error with subject ${subjectID}: fposdate = ${fposdate} is too recent relative to year of death ${frstdthd}`);
    return;
  }

  for (let i = indexOfFirstFollowUpInFposYear; i < followUps.length; i ++) {
    const followUp = followUps[i];
    if (followUp.leu3n !== null && followUp.leu3n <= lower_limit_CD4_count) {
      console.error(`Error with subject ${subjectID}: the followup ${followUp.submitter_id}'s leu3n of ${followUp.leu3n} is <= ${lower_limit_CD4_count}`);
      return;
    }
  }

  const indexOfFollowupWithHAART = followUps.findIndex((visit) => { 
    return (visit.thrpyv != null && visit.thrpyv.includes('HAART')) 
      || (visit.thrpy != null && visit.thrpy.includes('HAART'));
  });

  if (indexOfFollowupWithHAART !== -1) {
    const submitterIDForFollowUpWithHAART = followUps[indexOfFollowupWithHAART].submitter_id;
    console.log(`Error with subject ${subjectID}: followup ${submitterIDForFollowUpWithHAART} indicates subject has received HAART therapy.`);
    return;
  }

}

ltnpResults.subjects.forEach(subjectObj => {
  confirmPatientIsLTNP(subjectObj);
});

console.log('Validation complete.');