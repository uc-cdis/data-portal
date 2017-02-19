import { fetchWrapper } from './actions'
import { submissionapi_path } from '../localconf'

export const fetchProjects = () => {

  return fetchWrapper({
    path: submissionapi_path + 'graphql',
    body: JSON.stringify({
      'query': "query Test { project(first:100) {code, project_id}}"
    }),
    method: 'POST',
    handler: receiveProjects
  })
}

export const receiveProjects = ({status, data}) => {
  console.log(data);
  switch (status){
    case 200:
      return {
        type: 'RECEIVE_PROJECTS',
        data: data['data']['project'].map(p => p.project_id)
      }
    default:
      return {
        type: 'FETCH_ERROR',
        error: data
      }
  }


}

