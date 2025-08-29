import React, {useState} from 'react';
import { fetchWithCreds } from '../actions';
import { auditAPIPath } from '../localconf';
import './UserMetricDashboard.css';
import { Spin } from 'antd';

export const getAuditData = async (url, setCompleteStatus = null) => {
  const urlPath = `${auditAPIPath}log/${url}`;
  const { data } = await fetchWithCreds({ path: urlPath, method: 'GET' });
  if(setCompleteStatus) {
    setCompleteStatus(true)
  }
  return data;
};

const UserMetricDashboard = () => {
  const [totalLogins, setTotalLogins] = useState(-1);
  const [uchicagoLogins, setUchicagoLogins] = useState(-1);
  const [vaLogins, setVaLogins] = useState(-1);
  const [totalDownloads, setTotalDownloads] = useState(-1);
  const [queryCompleted, setQueryCompleted] = useState(false);

  const epochTimeThirtyDaysAgo = Math.round((Date.now() - (180 * 24 * 60 * 60 * 1000))/1000)

  getAuditData('login?start=' + epochTimeThirtyDaysAgo + '&count').then((count) => {setTotalLogins(count.data);});
  getAuditData('login?start=' + epochTimeThirtyDaysAgo + '&count&fence_idp=shibboleth').then((count) => {setUchicagoLogins(count.data);});;
  getAuditData('login?start=' + epochTimeThirtyDaysAgo + '&count&idp=cognito').then((count) => {setVaLogins(count.data);});;
  getAuditData('presigned_url?start=' + epochTimeThirtyDaysAgo + '&count', setQueryCompleted).then((count) => {setTotalDownloads(count.data);});;

  if(queryCompleted == false) {
    return <Spin />
  }
  else {
    return (
      <div className='dashboard'>
        <div className='heading'><h1>Metric Dashboard</h1></div>
          <table>
            <tbody>
              <tr>
                <th scope="col">Metrics (Last 30 Days)</th>
                <th scope="col">Statistics</th>
              </tr>
              <tr>
                <th scope="row">Total Login</th>
                <td>{totalLogins}</td>
              </tr>
              <tr>
                <th scope="row">Uchicago Login</th>
                <td>{uchicagoLogins}</td>
              </tr>
              <tr>
                <th scope="row">VA Login</th>
                <td>{vaLogins}</td>
              </tr>
              <tr>
                <th scope="row">Downloads:</th>
                <td>{totalDownloads}</td>
              </tr>
            </tbody>
          </table>
      </div>
    );
  }

}

UserMetricDashboard.propTypes = {
};

UserMetricDashboard.defaultProps = {
};

export default UserMetricDashboard;
