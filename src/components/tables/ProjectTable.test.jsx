import React from 'react';
import { mount } from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { StaticRouter } from 'react-router-dom';

import ProjectTable from './ProjectTable';


test('Project tables renders', () => {
  const projectList = [{
    name: 'frickjack',
    counts: [5, 20, 30, 200],
  }];
  const summaryCounts = [5, 20, 30, 200];

  // Material-UI components require the Mui theme ...
  const table = mount(
    <MuiThemeProvider>
      <StaticRouter location={{ pathname: '/identity' }} context={{}}>
        <ProjectTable projectList={projectList} summaryCounts={summaryCounts} />
      </StaticRouter>
    </MuiThemeProvider>,
  );
  // 2 == 1 data row + 1 summary totals row
  expect(table.find('tbody tr').length).toBe(1);
  expect(table.find('thead tr').length).toBe(1);
});
