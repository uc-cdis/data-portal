import React from 'react';
import * as testData from './__test__/data.json';
import * as testExpected from './__test__/expected.json';
import ExplorerPage from './ExplorerPage';
import { mount } from 'enzyme'
import { getReduxStore } from '../reduxStore';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import {changePageSize} from './actions';

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

describe('the Explorer component', () => {
  let initializedExplorer = testExpected.explorer;
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify(testData), { status: 200 });
    return renderComponent(ExplorerPage, {viewer: testData.data.viewer});
  });

  it('Update redux store when loading', () => {
    return getReduxStore().then(
      (store) => {
        expect(store.getState().explorer).toEqual(initializedExplorer);
      }
    );
  });

  // it('Update redux store when page size changed', () => {
  //   return getReduxStore().then(
  //     (store) => {
  //       let currentPages = initializedExplorer.currentPages;
  //       currentPages['submitted_aligned_reads'] = 1;
  //       store.dispatch(changePageSize(currentPages));
  //     }
  //   ).then(
  //     (store) => {
  //       expect(store.getState().explorer.currentPages['submitted_aligned_reads']).toEqual(1);
  //     }
  //   );
  // });
});
