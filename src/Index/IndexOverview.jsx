import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Spinner from '../components/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GQLHelper } from '../gqlHelper';
import './IndexOverview.css';

const consortiumList = GQLHelper.getConsortiumList();

function IndexOverview({ overviewCounts }) {
  const [consortium, setConsortium] = useState('total');
  const consortiumOptions = [
    { label: 'All PCDC', value: 'total' },
    ...consortiumList.map((option) => ({ label: option, value: option })),
  ];

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  useEffect(() => {
    if (overviewCounts !== undefined) setIsDataLoaded(true);
  }, [overviewCounts]);

  const getCountDataList = () => [
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
        <div className='index-overview__select'>
          <label>Consortium</label>
          <Select
            clearable={false}
            options={consortiumOptions}
            value={consortium}
            onChange={({ value }) => setConsortium(value)}
          />
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
    </div>
  );
}

export default IndexOverview;
