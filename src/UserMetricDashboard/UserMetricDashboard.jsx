import React, {useState} from 'react';
import { fetchWithCreds } from '../actions';
import { auditAPIPath } from '../localconf';

export const getAuditData = async (url) => {
  const urlPath = `${auditAPIPath}log/${url}`;
  const { data } = await fetchWithCreds({ path: urlPath, method: 'GET' });
  return data;
};

const UserMetricDashboard = () => {
  const [totalLogins, setTotalLogins] = useState(-1);
  const [uchicagoLogins, setUchicagoLogins] = useState(-1);
  const [vaLogins, setVaLogins] = useState(-1);
  const [totalDownloads, setTotalDownloads] = useState(-1);

  const epochTimeThirtyDaysAgo = Math.round((Date.now() - (180 * 24 * 60 * 60 * 1000))/1000)

  getAuditData('login?start=' + epochTimeThirtyDaysAgo + '&count').then((count) => {console.log('setting total login', count); setTotalLogins(count.data);});
  getAuditData('login?start=' + epochTimeThirtyDaysAgo + '&count&fence_idp=shibboleth').then((count) => {console.log('setting total login', count); setUchicagoLogins(count.data);});;
  getAuditData('login?start=' + epochTimeThirtyDaysAgo + '&count&idp=cognito').then((count) => {console.log('setting total login', count); setVaLogins(count.data);});;
  getAuditData('presigned_url?start=' + epochTimeThirtyDaysAgo + '&count').then((count) => {console.log('setting total login', count); setTotalDownloads(count.data);});;

  return (
    <div className='dashboard'>
      <h1>Metrics</h1>
      <h3>Total Login: {totalLogins}</h3>
      <h3>Uchicago Login: {uchicagoLogins}</h3>
      <h3>VA Login: {vaLogins}</h3>
      <h3>Downloads: {totalDownloads}</h3>
    </div>
  );

}

UserMetricDashboard.propTypes = {
};

UserMetricDashboard.defaultProps = {
};

export default UserMetricDashboard;
