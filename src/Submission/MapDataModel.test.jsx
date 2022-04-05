import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MapDataModel, {
  getParentNodes,
  isValidSubmission,
} from './MapDataModel';
import * as testData from './__test__/data.json';
import reducers from '../reducers';

const testReduxStore = createStore(reducers, {});

const projects = {
  test: { name: 'test', counts: [], charts: [], code: 'test' },
};
const dictionary = {
  aligned_reads_index: {
    links: [
      {
        backref: 'node1',
        name: 'core_metadata_collections',
        target_type: 'core_metadata_collection',
      },
    ],
    properties: {
      core_metadata_collection: { anyOf: {} },
      data_format: { enum: ['BAI'] },
      data_type: { enum: ['Aligned Reads Index'] },
      create_datetime: { anyOf: {} },
    },
    required: ['data_type', 'data_format'],
    title: 'Aligned Reads Index',
    systemProperties: ['id', 'project_id', 'created_datetime'],
  },
};

test('renders', () => {
  const { container } = render(
    <Provider store={testReduxStore}>
      <MemoryRouter>
        <MapDataModel
          filesToMap={testData.records}
          projects={projects}
          dictionary={dictionary}
          nodeTypes={['aligned_reads_index']}
          getProjectsList={() => {}}
          submitFiles={() => {}}
        />
      </MemoryRouter>
    </Provider>
  );
  expect(container.firstElementChild).toHaveClass('map-data-model');
});

test('updates parent node id', () => {
  // TODO: need to access <InputWithIcon> > <Select>
});

test('updates project id', () => {
  // TODO: need to access <InputWithIcon> > <Select>
});

test('sets required properties', () => {
  // TODO: need to access setState
});

test('selects a required field', () => {
  // TODO: need to access setState
});

test('returns if the submission is valid', () => {
  expect(
    isValidSubmission({
      projectId: 'test',
      nodeType: 'aligned_reads_index',
      parentNodeType: 'core_metadata_collection',
      parentNodeId: '1',
      requiredFields: {
        data_format: 'BAI',
        data_type: 'Aligned Reads Index',
      },
    })
  ).toEqual(true);

  expect(
    isValidSubmission({
      projectId: 'test',
      nodeType: 'aligned_reads_index',
      parentNodeType: 'core_metadata_collection',
      parentNodeId: '1',
      requiredFields: {
        data_format: 'BAI',
        data_type: null,
      },
    })
  ).toEqual(false);

  expect(
    isValidSubmission({
      projectId: 'test',
      nodeType: null,
      parentNodeType: 'core_metadata_collection',
      parentNodeId: '1',
      requiredFields: {
        data_format: 'BAI',
        data_type: 'Aligned Reads Index',
      },
    })
  ).toEqual(false);
});

test('gets parents of a node recursivly', () => {
  const level1Node = {
    links: [
      { name: 'level1Parent', target_type: 'level1Parents' },
      { name: 'level1Parent2', target_type: 'level1Parents2' },
    ],
  };
  const level1NodeExpected = {
    level1Parents: { name: 'level1Parent', target_type: 'level1Parents' },
    level1Parents2: { name: 'level1Parent2', target_type: 'level1Parents2' },
  };
  expect(getParentNodes(level1Node.links, {})).toEqual(level1NodeExpected);

  const level2Node = {
    links: [
      {
        subgroup: [
          { name: 'level2Parent', target_type: 'level2Parents' },
          { name: 'level2Parent2', target_type: 'level2Parents2' },
        ],
      },
    ],
  };
  const level2NodeExpected = {
    level2Parents: { name: 'level2Parent', target_type: 'level2Parents' },
    level2Parents2: { name: 'level2Parent2', target_type: 'level2Parents2' },
  };
  expect(getParentNodes(level2Node.links, {})).toEqual(level2NodeExpected);

  const level3Node = {
    links: [
      {
        subgroup: [
          {
            subgroup: [
              {
                subgroup: [
                  { name: 'level3Parent', target_type: 'level3Parents' },
                  { name: 'level3Parent2', target_type: 'level3Parents2' },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  const level3NodeExpected = {
    level3Parents: { name: 'level3Parent', target_type: 'level3Parents' },
    level3Parents2: { name: 'level3Parent2', target_type: 'level3Parents2' },
  };
  expect(getParentNodes(level3Node.links, {})).toEqual(level3NodeExpected);
});
