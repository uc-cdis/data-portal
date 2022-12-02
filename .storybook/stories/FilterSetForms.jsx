import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import FilterSetCreateForm from '@src/GuppyDataExplorer/ExplorerFilterSetForms/FilterSetCreateForm';
import FilterSetDeleteForm from '@src/GuppyDataExplorer/ExplorerFilterSetForms/FilterSetDeleteForm';
import FilterSetOpenForm from '@src/GuppyDataExplorer/ExplorerFilterSetForms/FilterSetOpenForm';
import FilterSetShareForm from '@src/GuppyDataExplorer/ExplorerFilterSetForms/FilterSetShareForm';
import FilterSetUpdateForm from '@src/GuppyDataExplorer/ExplorerFilterSetForms/FilterSetUpdateForm';
import {
  testFilterSets,
  testReduxStore,
} from '@src/GuppyDataExplorer/ExplorerFilterSetForms/testData';

const style = {
  backgroundColor: 'white',
  border: '1px solid var(--g3-color__silver)',
  borderTop: '4px solid var(--pcdc-color__primary)',
  borderRadius: '4px',
  maxWidth: '480px',
  padding: '2rem 1rem',
};

function Wrapper({ children }) {
  return (
    <Provider store={testReduxStore}>
      <div style={style}>{children}</div>
    </Provider>
  );
}

storiesOf('FilterSetForms', module)
  .add('Create form', () => (
    <Wrapper>
      <FilterSetCreateForm
        currentFilter={testFilterSets[0].filter}
        currentFilterSet={{
          name: '',
          description: '',
          filter: testFilterSets[0].filter,
        }}
        filterSets={testFilterSets}
        onAction={action('open')}
        onClose={action('close')}
        isFiltersChanged={false}
      />
    </Wrapper>
  ))
  .add('Delet form', () => (
    <Wrapper>
      <FilterSetDeleteForm
        currentFilterSet={testFilterSets[0]}
        onAction={action('delete')}
        onClose={action('close')}
      />
    </Wrapper>
  ))
  .add('Open form', () => (
    <Wrapper>
      <FilterSetOpenForm
        currentFilterSet={{ name: '', description: '', filter: {} }}
        filterSets={testFilterSets}
        onAction={action('open')}
        onClose={action('close')}
      />
    </Wrapper>
  ))
  .add('Update form', () => (
    <Wrapper>
      <FilterSetUpdateForm
        currentFilterSet={testFilterSets[0]}
        currentFilter={testFilterSets[0].filter}
        filterSets={testFilterSets}
        isFiltersChanged={false}
        onAction={action('open')}
        onClose={action('close')}
      />
    </Wrapper>
  ))
  .add('Share form', () => (
    <>
      <strong>Success</strong>
      <Wrapper>
        <FilterSetShareForm
          onAction={() => {
            action('share')();
            setTimeout(() => {});
            return new Promise((resolve) => {
              setTimeout(() => resolve('token-value'), 1000);
            });
          }}
          onClose={action('close')}
        />
      </Wrapper>
      <br />
      <strong>Error</strong>
      <Wrapper>
        <FilterSetShareForm
          onAction={() => {
            action('share')();
            setTimeout(() => {});
            return new Promise((_, reject) => {
              setTimeout(() => reject(), 1000);
            });
          }}
          onClose={action('close')}
        />
      </Wrapper>
    </>
  ));
