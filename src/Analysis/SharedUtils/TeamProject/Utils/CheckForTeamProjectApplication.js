const CheckForTeamProjectApplication = (analysisApps) => {
  let hasTeamProjectApplication = false;
  Object.values(analysisApps).forEach((analysisApp) => {
    if (analysisApp.needsTeamProject) {
      hasTeamProjectApplication = true;
    }
  });
  return hasTeamProjectApplication;
};

export default CheckForTeamProjectApplication;
