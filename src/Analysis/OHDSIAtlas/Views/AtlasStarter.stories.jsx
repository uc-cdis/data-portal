import React, { useState, useReducer } from 'react';
import AtlasStarter from './AtlasStarter';
import { rest } from 'msw';
import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'Tests3/OHDSIAtlas/AtlasStarter',
  component: AtlasStarter,
};

const mockSetCurrentViewAndTeamProject = () => {
  console.log('mockSetCurrentViewAndTeamProject');
}

const mockedQueryClient = new QueryClient();

const MockTemplate = () => {
  return (
    <QueryClientProvider client={mockedQueryClient}>
      <AtlasStarter setCurrentViewAndTeamProject={mockSetCurrentViewAndTeamProject} />
    </QueryClientProvider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
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

export const MockedError = MockTemplate.bind({});
MockedError.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:arboristapi/authz/mapping',
        (req, res, ctx) => res(ctx.delay(800), ctx.status(403))
      ),
    ],
  },
};
