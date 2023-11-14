const SanitizeTeamProjectString = (inputString) => {
  // allow only alphanumeric and slashes
  const regex = /[^a-zA-Z0-9/]/g;
  return inputString.replace(regex, '');
};

export default SanitizeTeamProjectString;
