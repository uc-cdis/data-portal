const handleRedirectToLoginClick = (
  action: 'download' | 'export' | 'manifest' | null = null,
  props,
  history,
  location,
) => {
  const serializableState = {
    ...props.discovery,
    actionToResume: action,
    // reduce the size of the redirect url by only storing resource id
    // resource id is remapped to its resource after redirect and resources load in index component
    selectedResourceIDs: props.discovery.selectedResources.map(
      (resource) => resource[props.config.minimalFieldMapping.uid],
    ),
  };
  delete serializableState.selectedResources;
  const queryStr = `?state=${encodeURIComponent(
    JSON.stringify(serializableState),
  )}`;
  history.push('/login', { from: `${location.pathname}${queryStr}` });
};

export default handleRedirectToLoginClick;
