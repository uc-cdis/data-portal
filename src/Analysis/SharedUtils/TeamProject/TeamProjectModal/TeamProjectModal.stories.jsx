import React from 'react';
import TeamProjectModal from './TeamProjectModal';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';

export default {
  title: 'TESTS1/SharedUtils/TeamProjectModal',
  component: TeamProjectModal,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const Template = (args) => (
  <div className='GWASApp'>
    <QueryClientProvider client={mockedQueryClient}  contextSharing>
      <TeamProjectModal  isModalOpen={true} setIsModalOpen={() => false} setBannerText={() => false}/>
    </QueryClientProvider>
    ,
  </div>
);

export const MockedError403 = Template.bind({});
MockedError403.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:arboristapi/authz/mapping',
        (req, res, ctx) => res(ctx.delay(800), ctx.status(403))
      ),
    ],
  },
};


export const MockedSuccess = Template.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:arboristapi/authz/mapping',
        (req, res, ctx) => {
            return res(
              ctx.delay(3000),
              ctx.json({
                "/gwas_projects/project11": [
                  {
                      "service": "atlas-argo-wrapper-and-cohort-middleware",
                      "method": "access"
                  }
              ],
              "/gwas_projects/project22": [
                  {
                      "service": "atlas-argo-wrapper-and-cohort-middleware",
                      "method": "access"
                  }
              ],
              "/somethingelse": [
                  {
                      "service": "requestor",
                      "method": "create"
                  }
              ],
              })
            );
          }
      ),
    ],
  },
};
