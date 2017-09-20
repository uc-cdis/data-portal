import { graphqlSchemaUrl } from '../localconf';
import { fetchWrapper } from '../actions';


export const fetchSchema = () => {
  return (dispatch) => {
    return dispatch(fetchWrapper({
      path: graphqlSchemaUrl,
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
