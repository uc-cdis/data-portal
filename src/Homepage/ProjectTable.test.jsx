import React from 'react';
import { ProjectTable, ProjectTR } from './ProjectTable';
import { mount } from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


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
      <ProjectTable projectList={projectList} summaryCounts={summaryCounts} />
    </MuiThemeProvider>,
  );
  console.log(`ProjectTable looks like this: ${table.html()}`);
  // 2 == 1 data row + 1 summary totals row
  expect(table.find('tbody tr').length).toBe(2);
});
