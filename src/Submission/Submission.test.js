import React from 'react';
import { mount } from 'enzyme'
import { getReduxStore } from '../reduxStore';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import ProjectSubmission from './ProjectSubmission';

function renderComponent(ComponentClass, props) {
  return getReduxStore().then(
    (store) => {
      mount(
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <MuiThemeProvider>
              <ComponentClass {...props}/>
            </MuiThemeProvider>
          </ThemeProvider>
        </Provider>
      );
    });
}

describe('the Submission component', () => {
  let initializedExplorer = testExpected.explorer;
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify(testData), { status: 200 });
    return renderComponent(ProjectSubmission, {viewer: testData.data.viewer});
  });

  it('Update redux store when loading', () => {
    return getReduxStore().then(
      (store) => {
        expect(store.getState().explorer).toEqual(initializedExplorer);
      }
    );
  });

  it('Update redux store when page size changed', () => {
    return getReduxStore().then(
      (store) => {
        fetch.mockResponse(JSON.stringify(testData), { status: 200 });
        return store.dispatch(changePageSize(3, {
          oldPageSize: initializedExplorer.pageSize,
          pagesPerTab: initializedExplorer.pagesPerTab,
          cursors: initializedExplorer.cursors,
          queriedCursors: initializedExplorer.queriedCursors
        })).then(
          () => {
            expect(store.getState().explorer.pageSize).toEqual(3)
          }
        );
      }
    );
  });

  it('Update redux store when current page changed', () => {
    return getReduxStore().then(
      (store) => {
        fetch.mockResponse(JSON.stringify(testData), { status: 200 });
        return store.dispatch(changePage('aligned_reads', 2,
          initializedExplorer.currentPages)).then(
          () => {
            expect(store.getState().explorer.currentPages['aligned_reads']).toEqual(2)
          }
        );
      }
    );
  });
});
