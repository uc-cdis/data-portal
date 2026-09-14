import React from 'react';
import { http, HttpResponse, delay } from 'msw';
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
      http.get(endpoint, ({ params }) => HttpResponse.json(TableData)),
    ],
  },
};

export const Mocked403Response = MockTemplate.bind({});
Mocked403Response.parameters = {
  msw: {
    handlers: {
      auth: http.get(endpoint, ({ params }) => HttpResponse.json({ errorMessage: 'Error 403' }, { status: 403 })),
    },
  },
};

export const Mocked504Response = MockTemplate.bind({});
Mocked504Response.parameters = {
  msw: {
    handlers: {
      auth: http.get(endpoint, async ({ params }) => {
        await delay(3000);
        return HttpResponse.json('server timeout', { status: 504 });
      }),
    },
  },
};
