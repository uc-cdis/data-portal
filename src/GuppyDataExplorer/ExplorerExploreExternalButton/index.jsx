import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SimplePopup from '../../components/SimplePopup';
import SimpleInputField from '../../components/SimpleInputField';
import Button from '../../gen3-ui-component/components/Button';
import { overrideSelectTheme } from '../../utils';
import { fetchWithCreds } from '../../actions';
import { getGQLFilter } from '../../GuppyComponents/Utils/queries';
import { stringifyFilters } from '../ExplorerFilterSet/utils';
import '../typedef';
import './ExplorerExploreExternalButton.css';

/**
 * @param {Object} props
 * @param {FilterState} props.filter
 */
function ExplorerExploreExternalButton({ filter }) {
  const emptyOption = {
    label: 'Select data commons',
    value: '',
  };
  const externalCommonsOptions = [
    {
      label: 'Genomic Data Commons',
      value: 'gdc',
    },
  ];

  const [selected, setSelected] = useState(emptyOption);
  const [show, setShow] = useState(false);

  function openPopup() {
    setShow(true);
  }
  function closePopup() {
    setShow(false);
  }
  async function handleFind() {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: `/analysis/tools/external/${selected.value}`,
        method: 'POST',
        body: JSON.stringify({ filter: getGQLFilter(filter) }),
      });
      if (status !== 200) throw response.statusText;

      window.open(data.link, '_blank');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      closePopup();
    }
  }

  return (
    <>
      <Button
        label={<div>Explore in...</div>}
        rightIcon='external-link'
        buttonType='secondary'
        onClick={openPopup}
      />
      {show && (
        <SimplePopup>
          <div className='explorer-explore-external__form'>
            <h4>Explore in An External Data Commons</h4>
            <form onSubmit={(e) => e.preventDefault()}>
              <SimpleInputField
                label='Data Commons'
                input={
                  <Select
                    inputId='explore-external-data-commons'
                    options={[emptyOption, ...externalCommonsOptions]}
                    value={selected}
                    autoFocus
                    clearable={false}
                    theme={overrideSelectTheme}
                    onChange={setSelected}
                  />
                }
              />
              <SimpleInputField
                label='Filters'
                input={
                  <textarea
                    id='explore-external-filters'
                    disabled
                    placeholder='No filters'
                    value={stringifyFilters(filter)}
                  />
                }
              />
            </form>
            <div>
              <Button
                className='explorer-explore-external__button'
                buttonType='default'
                label='Back to page'
                onClick={closePopup}
              />
              <Button
                label='Open in new tab'
                enabled={selected.value !== ''}
                onClick={handleFind}
              />
            </div>
          </div>
        </SimplePopup>
      )}
    </>
  );
}

ExplorerExploreExternalButton.propTypes = {
  filter: PropTypes.object.isRequired,
};

export default ExplorerExploreExternalButton;
