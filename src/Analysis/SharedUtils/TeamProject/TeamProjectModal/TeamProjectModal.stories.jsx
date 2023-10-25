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
      <TeamProjectModal {...args} />
    </QueryClientProvider>
    ,
  </div>
);

export const MockedFailureNoUserAccess = Template.bind({});
MockedFailureNoUserAccess.args = {
  isModalOpen: true,
  setIsModalOpen: () => false,
  setBannerText: () => 'new banner text ' + Math.random,
};

export const MockedSuccess = Template.bind({});
MockedSuccess.args = {
  isModalOpen: true,
  setIsModalOpen: () => false,
  setBannerText: () => 'new banner text ' + Math.random,
};
/*
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get(`http://localhost/authz/mapping`, (req, res, ctx) => {
        const { argowrapperpath } = req.params;
        return res(
          ctx.delay(3000),
          ctx.json({
            "teams": [
              { "teamName": '/gwas_projects/project1' },
              { "teamName": '/gwas_projects/project2' },
            ],
          })
        );
      }),
    ],
  },
};
*/
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:arboristapi/authz/mapping',
        (req, res, ctx) => {
            return res(
              ctx.delay(1000),
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
