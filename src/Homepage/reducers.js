export const homepage = (state={}, action) => {
  switch (action.type) {
  case 'RECEIVE_PROJECT_LIST': {
    const projectsByName = Object.assign( {}, state.projectsByName || {} );
    action.data.forEach( (proj) => {
      const old = projectsByName[proj.name] || {};
      projectsByName[proj.name] = Object.assign( old, proj );
    });
    return {...state, projectsByName };
  }
  case 'RECEIVE_PROJECT_DETAIL': {
    const projectsByName = Object.assign( {}, state.projectsByName || {} );
    projectsByName[ action.data.name ] = action.data;
    return {...state, projectsByName };
  }
  default:
    return state;
  }
};

