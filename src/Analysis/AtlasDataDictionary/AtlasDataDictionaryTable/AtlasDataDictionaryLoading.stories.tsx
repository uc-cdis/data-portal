import React from 'react';
import { rest } from 'msw';
import AtlasDataDictionaryLoading from './AtlasDataDictionaryLoading';
import TableData from './TestData/TableData';
import { cohortMiddlewarePath } from '../../../localconf';
import '../AtlasDataDictionary.css';

const endpoint = `${cohortMiddlewarePath}/data-dictionary/Retrieve`;
export default {
  title: 'Tests2/AtlasDataDictionary/Components/AtlasDataDictionaryLoading',
  component: 'AtlasDataDictionaryLoading',
};

const MockTemplate = () => (
  <div className='atlas-data-dictionary-container'>
    <AtlasDataDictionaryLoading />
  </div>
);

export const MockedLoading = MockTemplate.bind({});

export const MockedValidData = MockTemplate.bind({});
MockedValidData.parameters = {
  msw: {
    handlers: [
      rest.get(endpoint, (req, res, ctx) => res(
        ctx.json(TableData),
      )),
    ],
  },
};

export const Mocked403Response = MockTemplate.bind({});
Mocked403Response.parameters = {
  msw: {
    handlers: {
      auth: rest.get(endpoint, (req, res, ctx) => res(ctx.status(403),
        ctx.json({ errorMessage: 'Error 403' }))),
    },
  },
};

export const Mocked504Response = MockTemplate.bind({});
Mocked504Response.parameters = {
  msw: {
    handlers: {
      auth: rest.get(endpoint, (req, res, ctx) => res(ctx.delay(3000), ctx.status(504), ctx.json('server timeout'))),
    },
  },
};
