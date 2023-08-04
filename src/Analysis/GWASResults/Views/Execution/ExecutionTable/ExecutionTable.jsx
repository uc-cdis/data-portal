import React, { useContext } from 'react';
import moment from 'moment';
import SharedContext from '../../../Utils/SharedContext';
import DateForTable from '../../../Components/DateForTable/DateForTable';

const subtractDates = (endDate, startDate) => {
  let timestampEnd = Date.now();
  if (endDate) {
    timestampEnd = Date.parse(endDate);
  }
  const timestampStart = Date.parse(startDate);
  const diffInMs = timestampEnd - timestampStart;
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
                  selectedRowData?.startedAt,
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
