const TeamProjectApplications = ['OHDSI Atlas', 'GWASUIApp', 'GWASResults'];

const CheckForTeamProjectApplication = (analysisApps) => {
  let hasTeamProjectApplication = false;
  TeamProjectApplications.forEach((applicationKey) => {
    if (applicationKey in analysisApps) {
      hasTeamProjectApplication = true;
    }
  });
  return hasTeamProjectApplication;
};

export default CheckForTeamProjectApplication;
