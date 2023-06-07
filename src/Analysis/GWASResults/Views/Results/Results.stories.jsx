import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import SharedContext from '../../Utils/SharedContext';
import Results from './Results';
import imageFile from '../../TestData/dummy_result1.png'; // not a Manhattan plot...but will do for now
import manhattanPheWebJsonFile from '../../TestData/Diagrams/ManhattanPlotTestDataLarge.json';
import WorkflowStatusResponse from '../../TestData/WorkflowDetailsOnlyPng';
import WorkflowStatusResponse2 from '../../TestData/WorkflowDetailsPngAndPheWebJson';


export default {
  title: 'Tests2/GWASResults/Views/Results',
  component: 'Results',
};

const selectedRowData1 = { name: 'Test Name', uid: '123456' };
const selectedRowData2 = { name: 'Test_Name2', uid: '7891011' };
const selectedRowData3 = { name: 'Test_Name3', uid: '999111' };
const selectedRowData4 = { name: 'Test_Name4', uid: '999222' };
const selectedRowData5 = { name: 'Test Name5', uid: '123456789' };
const selectedRowData6 = { name: 'Test_Name6', uid: '9991116' };

const setCurrentView = (input) => {
  alert(`setCurrentView called with ${input}`);
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = (selectedRowData) =>
  <QueryClientProvider client={mockedQueryClient}>
    <SharedContext.Provider
        value={{
          selectedRowData: selectedRowData,
          setCurrentView,
        }}
      >
        <Results />
      </SharedContext.Provider>
    </QueryClientProvider>



export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.args = selectedRowData1;
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/status/:workflowname',
        (req, res, ctx) => {
          const { argowrapperpath, workflowname } = req.params;
          console.log(argowrapperpath);
          console.log(workflowname);
          return res(
            ctx.delay(500),
            ctx.json(WorkflowStatusResponse)
          );
        }
      ),
      rest.get(
        'http://:server/user/data/download/:index_did',
        (req, res, ctx) => {
          const { index_did } = req.params;
          console.log(index_did);
          return res(
            ctx.delay(500),
            ctx.json({"url": index_did === '999-8888-7777-aaaa123456-777777' ? imageFile : imageFile+'.zip'}) // note: the .zip here is fake and although its download will be initiated in this storybook, it won't really work or download any .zip file
          );
        }
      ),
    ],
  },
};

const dummyS3BucketLocation = "https://some-bucket.s3.amazonaws.com/gwas-workflow-123/test_pheweb.json";
export const MockedSuccess2 = MockTemplate.bind({});
MockedSuccess2.args = selectedRowData5;
MockedSuccess2.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/status/:workflowname',
        (req, res, ctx) => {
          const { argowrapperpath, workflowname } = req.params;
          console.log(argowrapperpath);
          console.log(workflowname);
          return res(
            ctx.delay(500),
            ctx.json(WorkflowStatusResponse2)
          );
        }
      ),
      rest.get(
        'http://:server/user/data/download/:index_did',
        (req, res, ctx) => {
          const { index_did } = req.params;
          console.log(index_did);
          return res(
            ctx.delay(500),
            ctx.json({"url": index_did === '222-8888-7777-bbbb123456-777777' ? dummyS3BucketLocation + "?X-Amz-Algorithm=AWS4-ETC" : "manhattanPheWebJsonFile.zip"}) // note: the .json and .zip here are fake urls
          );
        }
      ),
      rest.get(
        dummyS3BucketLocation,
        (req, res, ctx) => {
          const { index_did } = req.params;
          console.log(index_did);
          return res(
            ctx.delay(500),
            ctx.json(manhattanPheWebJsonFile)
          );
        }
      ),
    ],
  },
};

export const MockedError = MockTemplate.bind({});
MockedError.args = selectedRowData2;
MockedError.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/status/:workflowname',
        (_, res, ctx) =>  res(ctx.delay(800), ctx.status(403))
      ),
    ],
  },
};

export const MockedError2WhenPng = MockTemplate.bind({});
MockedError2WhenPng.args = selectedRowData3;
MockedError2WhenPng.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/status/:workflowname',
        (req, res, ctx) => {
          const { argowrapperpath, workflowname } = req.params;
          console.log(argowrapperpath);
          console.log(workflowname);
          return res(
            ctx.delay(500),
            ctx.json(WorkflowStatusResponse)
          );
        }
      ),
      rest.get(
        'http://:server/user/data/download/:manhattan_plot_index_did',
        (req, res, ctx) => {
          const { manhattan_plot_index_did } = req.params;
          console.log(manhattan_plot_index_did);
          return res(
            ctx.delay(500),
            ctx.json({"url": imageFile +".invalid"})
          );
        }
      ),
    ],
  },
};

export const MockedError2WhenPheweb = MockTemplate.bind({});
MockedError2WhenPheweb.args = selectedRowData6;
MockedError2WhenPheweb.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/status/:workflowname',
        (req, res, ctx) => {
          const { argowrapperpath, workflowname } = req.params;
          console.log(argowrapperpath);
          console.log(workflowname);
          return res(
            ctx.delay(500),
            ctx.json(WorkflowStatusResponse2)
          );
        }
      ),
      rest.get(
        'http://:server/user/data/download/:manhattan_plot_index_did',
        (req, res, ctx) => {
          const { manhattan_plot_index_did } = req.params;
          console.log(manhattan_plot_index_did);
          return res(
            ctx.delay(500),
            ctx.json({"someerror": "error"})
          );
        }
      ),
    ],
  },
};

export const MockedError3 = MockTemplate.bind({});
MockedError3.args = selectedRowData4;
MockedError3.parameters = {
  msw: {
    handlers: [
      rest.get(
        'http://:argowrapperpath/ga4gh/wes/v2/status/:workflowname',
        (req, res, ctx) => {
          const { argowrapperpath, workflowname } = req.params;
          console.log(argowrapperpath);
          console.log(workflowname);
          return res(
            ctx.delay(500),
            ctx.json({ "some_dummy": "and-wrong-response-format",})
          );
        }
      ),
    ],
  },
};
