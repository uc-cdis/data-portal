import React from 'react';
import { mount } from 'enzyme';
import { getType, PropertiesTable } from './DataDictionaryNode';


describe('the DataDictionaryNode', () => {
  it.skip('knows how to extract type info from a node property', () => {
    expect(getType({ type: 'string' })).toBe('string');
    const enumProp = { enum: ['A', 'B', 'C'] };
    expect(getType(enumProp)).toEqual(['A', 'B', 'C']);

    const oneOf = getType({
      oneOf: [
        {
          enum: ['A', 'B', 'C'],
        },
        {
          oneOf: [
            {
              enum: ['D', 'E', 'F'],
            },
            {
              enum: ['G'],
            },
          ],
        },
      ],
    });
    expect(oneOf).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  });

  it.skip('knows how to render a PropertiesTable', () => {
    const dictionary = {
      project: {
        type: 'object',
        name: 'project',
        properties: {
          A: {
            type: 'string',
            description: 'A property',
          },
          B: {
            enum: ['A', 'B', 'C'],
            description: 'B property',
          },
        },
      },
    };

    const $propTable = mount(
      <PropertiesTable node={dictionary.project} links={[]} required={[]} />,
    );
    expect($propTable.find('tbody tr')).toHaveLength(2);
  });
});
