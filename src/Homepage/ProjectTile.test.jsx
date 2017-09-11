import React from 'react';
import { ProjectTile } from "./ProjectTile";
import { shallow } from 'enzyme';


test('Project tile renders', () => {
    const project = {
      name: "frickjack",
      experimentCount: 5,
      caseCount: 20,
      aliquotCount: 30
    };

    const tile = shallow( <ProjectTile /> );
    expect(tile.find("div").length > 0 ).toBe( true );
    //console.log( "ProjectTile looks like this: " + tile.html() );
  });