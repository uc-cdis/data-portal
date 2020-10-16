import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import Select from 'react-select';
import Spinner from '../components/Spinner';
import Button from '@gen3/ui-component/dist/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GQLHelper } from '../gqlHelper';
import { breakpoints } from '../localconf';
import './IndexOverview.css';

const consortiumList = GQLHelper.getConsortiumList();

function IndexOverview({ overviewCounts }) {
  const [consortium, setConsortium] = useState('total');
  const consortiumOptions = [
    { label: 'All PCDC', value: 'total' },
    ...consortiumList.map((option) => ({ label: option, value: option })),
  ];

  let history = useHistory();
  function ButtonToExplorer() {
    const filter =
      consortium === 'total'
        ? {}
        : { consortium: { selectedValues: [consortium] } };

    return (
      <Button
        label='Explore more'
        buttonType='primary'
        onClick={() =>
          history.push({
            pathname: '/explorer',
            state: { filter },
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
      count: overviewCounts[consortium].subject,
      faIcon: 'user',
      name: { singular: 'Subject', plural: 'Subjects' },
    },
    {
      count: overviewCounts[consortium].study,
      faIcon: 'flask',
      name: { singular: 'Study', plural: 'Studies' },
    },
    {
      count: overviewCounts[consortium].molecular_analysis,
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
            <label>Consortium</label>
            <Select
              clearable={false}
              options={consortiumOptions}
              value={consortium}
              onChange={({ value }) => setConsortium(value)}
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

export default IndexOverview;
