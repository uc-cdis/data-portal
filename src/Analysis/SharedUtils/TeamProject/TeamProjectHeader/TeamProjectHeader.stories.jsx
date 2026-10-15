import React from 'react';
import TeamProjectHeader from './TeamProjectHeader';
import { QueryClient, QueryClientProvider } from 'react-query';
import { http, HttpResponse, delay } from 'msw';

export default {
  title: 'TESTS1/SharedUtils/TeamProjectHeader',
  component: TeamProjectHeader,
};

const Template = (args) => (
  <div className='GWASApp'>
    <QueryClientProvider client={new QueryClient()} contextSharing>
      <TeamProjectHeader {...args} />
    </QueryClientProvider>
    ,
  </div>
);

const successParameters = {
  msw: {
    handlers: [
      http.get('http://:arboristapi/authz/mapping', async ({ params }) => {
        await delay(3000);
        return HttpResponse.json({
          '/gwas_projects/project11': [
            {
              service: 'atlas-argo-wrapper-and-cohort-middleware',
              method: 'access',
            },
          ],
          '/gwas_projects/project22': [
            {
              service: 'atlas-argo-wrapper-and-cohort-middleware',
              method: 'access',
            },
          ],
          '/somethingelse': [
            {
              service: 'requestor',
              method: 'create',
            },
          ],
        });
      }),
    ],
  },
};

export const MockedSuccessIsEditable = Template.bind({});
MockedSuccessIsEditable.args = {
  isEditable: true,
};
MockedSuccessIsEditable.parameters = successParameters;

export const MockedSuccessIsNotEditable = Template.bind({});
MockedSuccessIsNotEditable.args = {
  isEditable: false,
};
MockedSuccessIsNotEditable.parameters = successParameters;

export const MockedError403 = Template.bind({});
MockedError403.args = {
  isEditable: true,
};
MockedError403.parameters = {
  msw: {
    handlers: [
      http.get('http://:arboristapi/authz/mapping', async ({ params }) => {
        await delay(800);
        return new HttpResponse(null, { status: 403 });
      }),
    ],
  },
};
