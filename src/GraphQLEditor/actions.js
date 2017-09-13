import { graphql_schema_url } from '../localconf';
import { fetchWrapper } from '../actions';


export const fetchSchema = () => {
  return (dispatch) => {
    return dispatch(fetchWrapper({
      path: graphql_schema_url,
      handler: receiveSchema
    }));
  };
};

export const receiveSchema = ({status, data}) => {
  switch (status) {
  case 200:
    return {
      type: 'RECEIVE_SCHEMA_LOGIN',
      schema: data
    };
  }
};
