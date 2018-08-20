import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ThemeProvider } from 'styled-components';
import { StaticRouter } from 'react-router-dom';

import getReduxStore from '../reduxStore';
import theme from '../theme';
import { changePageSize, changePage } from './ReduxExplorer';
import * as testData from './__test__/data.json';
import * as testExpected from './__test__/expected.json';
import ExplorerPage from './ExplorerPage';

function renderComponent(ComponentClass, props) {
  return getReduxStore().then(
    (store) => {
      mount(
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <MuiThemeProvider>
              <StaticRouter location={{ pathname: '/files' }} context={{}}>
                <ComponentClass {...props} />
              </StaticRouter>
            </MuiThemeProvider>
          </ThemeProvider>
        </Provider>,
      );
    });
}

describe('the Explorer component', () => {
  const initializedExplorer = testExpected.explorer;
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify(testData), { status: 200 });
    return renderComponent(ExplorerPage, { viewer: testData.data.viewer });
  });

  it('Update redux store when loading', () =>
    getReduxStore().then(
      (store) => {
        expect(store.getState().explorer).toEqual(initializedExplorer);
      },
    ),
  );

  it('Update redux store when page.jsx size changed', () =>
    getReduxStore().then(
      (store) => {
        fetch.mockResponse(JSON.stringify(testData), { status: 200 });
        return store.dispatch(changePageSize(3, {
          oldPageSize: initializedExplorer.pageSize,
          pagesPerTab: initializedExplorer.pagesPerTab,
          cursors: initializedExplorer.cursors,
          queriedCursors: initializedExplorer.queriedCursors,
        })).then(
          () => {
            expect(store.getState().explorer.pageSize).toEqual(3);
          },
        );
      },
    ),
  );

  it('Update redux store when current page.jsx changed', () =>
    getReduxStore().then(
      (store) => {
        fetch.mockResponse(JSON.stringify(testData), { status: 200 });
        return store.dispatch(changePage('aligned_reads', 2,
          initializedExplorer.currentPages)).then(
          () => {
            expect(store.getState().explorer.currentPages.aligned_reads).toEqual(2);
          },
        );
      },
    ),
  );
});
