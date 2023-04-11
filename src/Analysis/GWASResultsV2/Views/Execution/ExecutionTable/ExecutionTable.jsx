import React, { useContext } from 'react';
import moment from 'moment';
import SharedContext from '../../../Utils/SharedContext';
import DateForTable from '../../../SharedComponents/DateForTable/DateForTable';

const subtractDates = (date1, date2) => {
  const timestamp1 = Date.parse(date1);
  const timestamp2 = Date.parse(date2);
  const diffInMs = timestamp1 - timestamp2;
  // See here for more info:
  // https://momentjscom.readthedocs.io/en/latest/moment/08-durations/03-humanize/
  return moment.duration(diffInMs).humanize();
};

const ExecutionTable = () => {
  const { selectedRowData } = useContext(SharedContext);
  return (
    <div className='execution-table-container'>
      <table className='execution-table' data-testid='execution-table'>
        <tbody>
          <tr>
            <th>User Given Name</th>
            <th>Workflow Given Name</th>
            <th>Start Time</th>
            <th>Run Duration</th>
            <th>Status</th>
          </tr>
          {selectedRowData && (
            <tr key={selectedRowData?.name}>
              <td>{selectedRowData?.wf_name}</td>
              <td>{selectedRowData?.name}</td>
              <td>
                <DateForTable utcFormattedDate={selectedRowData?.startedAt} />
              </td>
              <td>
                {subtractDates(
                  selectedRowData?.finishedAt,
                  selectedRowData?.startedAt
                )}
              </td>
              <td>{selectedRowData?.phase}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExecutionTable;
