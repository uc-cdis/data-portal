import React from 'react';
import { ProjectTable, ProjectTR } from "./ProjectTable.jsx";
import { shallow, mount } from 'enzyme';


test('Project table renders', () => {
  const projectList = [{
    name: "frickjack",
    experimentCount: 5,
    caseCount: 20,
    aliquotCount: 30,
    fileCount:200
  }];
  const summaryCounts = {
    experimentCount: 5,
    caseCount: 20,
    aliquotCount: 30,
    fileCount:200
  };

  const table = mount( <ProjectTable projectList={projectList} summaryCounts={summaryCounts}/> );
  console.log( "ProjectTable looks like this: " + table.html() );
  expect(table.find("tbody tr").length ).toBe( 1 );
});