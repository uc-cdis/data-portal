import React from 'react';
import { mount } from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { StaticRouter } from 'react-router-dom';

import { ProjectTable } from './ProjectTable';


test('Project table renders', () => {
  const projectList = [{
    name: 'frickjack',
    experimentCount: 5,
    caseCount: 20,
    aliquotCount: 30,
    fileCount: 200,
  }];
  const summaryCounts = {
    experimentCount: 5,
    caseCount: 20,
    aliquotCount: 30,
    fileCount: 200,
  };

  // Material-UI components require the Mui theme ...
  const table = mount(
    <MuiThemeProvider>
      <StaticRouter location={{ pathname: '/identity' }}>
        <ProjectTable projectList={projectList} summaryCounts={summaryCounts} />
      </StaticRouter>
    </MuiThemeProvider>,
  );
  console.log(`ProjectTable looks like this: ${table.html()}`);
  // 2 == 1 data row + 1 summary totals row
  expect(table.find('tbody tr').length).toBe(2);
});
