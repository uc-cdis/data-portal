import React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { StaticRouter } from 'react-router-dom';
import MapDataModel from './MapDataModel';
import * as testData from './__test__/data.json';
import * as relayer from '../Index/relayer';

jest.mock(relayer, () => jest.fn());

describe('MapDataModel', () => {
  const history = createMemoryHistory('/submission/map');
  const projects = { test: { name: 'test', counts: [], charts: [], code: 'test' } };
  const dictionary = {
    aligned_reads_index: {
      links: [{ backref: 'node1', name: 'core_metadata_collections', target_type: 'core_metadata_collection' }],
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

  const component = mount(
    <StaticRouter location={{ pathname: '/submission/map' }} context={{}}>
      <MapDataModel
        filesToMap={testData.records}
        projects={projects}
        dictionary={dictionary}
        nodeTypes={['aligned_reads_index']}
        history={history}
      />
    </StaticRouter>,
  );

  const instance = component.find(MapDataModel).instance();
  const fetchSpy = jest.spyOn(instance, 'fetchAllSubmitterIds');

  it('renders', () => {
    expect(component.find(MapDataModel).length).toBe(1);
  });

  it('updates the project id', () => {
    instance.selectParentNodeId({ value: '1', label: '1' });
    expect(instance.state.parentNodeId).toEqual('1');
    expect(instance.state.projectId).toBe(null);
    instance.selectProjectId({ value: 'test', label: 'test' });
    expect(instance.state.projectId).toEqual('test');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(instance.state.parentNodeId).toEqual(null);
  });

  it('sets the initial state for required properties', () => {
    instance.setState({ nodeType: 'aligned_reads_index' });
    expect(instance.state.requiredFields).toEqual({});
    instance.setRequiredProperties();
    expect(instance.state.requiredFields).toEqual({
      data_format: null,
      data_type: null,
    });
  });

  it('selects the node type and resets other state fields if necessary', () => {
    instance.setState({ nodeType: null, requiredFields: {}, parentNodeId: '1' });
    expect(instance.state.nodeType).toEqual(null);
    expect(instance.state.requiredFields).toEqual({});
    expect(instance.state.parentNodeId).toEqual('1');
    instance.selectNodeType({ value: 'aligned_reads_index', label: 'aligned_reads_index' });
    expect(instance.state.nodeType).toEqual('aligned_reads_index');
    expect(instance.state.requiredFields).toEqual({
      data_format: null,
      data_type: null,
    });
    expect(instance.state.parentNodeId).toEqual(null);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('selects the parent node type', () => {
    instance.setState({ parentNodeType: null, parentNodeId: '1' });
    expect(instance.state.parentNodeType).toEqual(null);
    expect(instance.state.parentNodeId).toEqual('1');
    instance.selectParentNodeType({ value: 'core_metadata_collection', label: 'core_metadata_collection' });
    expect(instance.state.parentNodeType).toEqual('core_metadata_collection');
    expect(instance.state.parentNodeId).toEqual(null);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('selects the parent node id', () => {
    instance.setState({ parentNodeId: null });
    expect(instance.state.parentNodeId).toBe(null);
    instance.selectParentNodeId({ value: '1', label: '1' });
    expect(instance.state.parentNodeId).toEqual('1');
  });

  it('selects a required field', () => {
    instance.selectNodeType({ value: 'aligned_reads_index', label: 'aligned_reads_index' });
    expect(instance.state.nodeType).toEqual('aligned_reads_index');
    expect(instance.state.requiredFields).toEqual({
      data_format: null,
      data_type: null,
    });

    instance.selectRequiredField({ value: 'BAI', label: 'BAI' }, 'data_format');
    expect(instance.state.requiredFields).toEqual({
      data_format: 'BAI',
      data_type: null,
    });

    instance.selectRequiredField(null, 'data_format');
    expect(instance.state.requiredFields).toEqual({
      data_format: null,
      data_type: null,
    });
  });

  it('returns if the submission is valid', () => {
    instance.setState({
      projectId: 'test',
      nodeType: 'aligned_reads_index',
      parentNodeType: 'core_metadata_collection',
      parentNodeId: '1',
      requiredFields: {
        data_format: 'BAI',
        data_type: 'Aligned Reads Index',
      },
    });

    expect(instance.isValidSubmission()).toEqual(true);

    instance.setState({
      projectId: 'test',
      nodeType: 'aligned_reads_index',
      parentNodeType: 'core_metadata_collection',
      parentNodeId: '1',
      requiredFields: {
        data_format: 'BAI',
        data_type: null,
      },
    });

    expect(instance.isValidSubmission()).toEqual(false);

    instance.setState({
      projectId: 'test',
      nodeType: null,
      parentNodeType: 'core_metadata_collection',
      parentNodeId: '1',
      requiredFields: {
        data_format: 'BAI',
        data_type: 'Aligned Reads Index',
      },
    });

    expect(instance.isValidSubmission()).toEqual(false);
  });
});
