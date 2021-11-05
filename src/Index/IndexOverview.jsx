import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../components/Spinner';
import Button from '../gen3-ui-component/components/Button';
import { overrideSelectTheme } from '../utils';
import { consortiumList } from '../params';
import { breakpoints } from '../localconf';
import './IndexOverview.css';

const defaultConsortiumOption = { label: 'All PCDC', value: 'total' };

/** @typedef {{ [key: string]: string[] | { [key: string]: number } }} OverviewCounts  */
/** @param {{ overviewCounts: OverviewCounts }} props */
function IndexOverview({ overviewCounts }) {
  const [consortium, setConsortium] = useState(defaultConsortiumOption);
  const consortiumOptions = [
    defaultConsortiumOption,
    ...consortiumList.map((option) => ({ label: option, value: option })),
  ];

  const history = useHistory();
  function ButtonToExplorer() {
    const search =
      consortium.value === 'total'
        ? undefined
        : `filter=${JSON.stringify({
            consortium: { selectedValues: [consortium.value] },
          })}`;

    const enabled =
      overviewCounts !== undefined &&
      overviewCounts[consortium.value].subject !== 0;

    return (
      <Button
        label='Explore more'
        buttonType='primary'
        enabled={enabled}
        onClick={() =>
          history.push({
            pathname: '/explorer',
            search,
            state: { keepSearch: true },
          })
        }
      />
    );
  }

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  useEffect(() => {
    if (overviewCounts !== undefined) setIsDataLoaded(true);
  }, [overviewCounts]);

  const getCountDataList = () => [
    {
      count: overviewCounts[consortium.value].subject,
      faIcon: 'user',
      name: { singular: 'Subject', plural: 'Subjects' },
    },
    {
      count: overviewCounts[consortium.value].study,
      faIcon: 'flask',
      name: { singular: 'Study', plural: 'Studies' },
    },
    {
      count: overviewCounts[consortium.value].molecular_analysis,
      faIcon: 'microscope',
      name: {
        singular: 'Molecular analysis',
        plural: 'Molecular analyses',
      },
    },
  ];

  return (
    <div className='index-overview'>
      <div className='index-overview__title'>
        <h2>Overview</h2>
        <div className='index-overview__actions'>
          <div className='index-overview__select'>
            <label htmlFor='index-overview-select-input'>Consortium</label>
            <Select
              id='index-overview-select'
              inputId='index-overview-select-input'
              options={consortiumOptions}
              value={consortium}
              onChange={setConsortium}
              theme={overrideSelectTheme}
            />
          </div>
          <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
            <ButtonToExplorer />
          </MediaQuery>
        </div>
      </div>
      <div className='index-overview__body'>
        {isDataLoaded ? (
          getCountDataList().map(({ count, faIcon, name }) => (
            <div className='index-overview__count' key={name.singular}>
              <h3>{count}</h3>
              <div>
                <FontAwesomeIcon icon={faIcon} size='lg' />
                {count > 1 ? name.plural : name.singular}
              </div>
            </div>
          ))
        ) : (
          <Spinner />
        )}
      </div>
      <MediaQuery query={`(max-width: ${breakpoints.tablet}px)`}>
        <div className='index-overview__footer'>
          <ButtonToExplorer />
        </div>
      </MediaQuery>
    </div>
  );
}

IndexOverview.propTypes = {
  overviewCounts: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.objectOf(PropTypes.number),
    ])
  ),
};

export default IndexOverview;
