import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useResizeDetector } from 'react-resize-detector';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../components/Spinner';
import Button from '../gen3-ui-component/components/Button';
import { overrideSelectTheme } from '../utils';
import { breakpoints } from '../localconf';
import './IndexOverview.css';

const defaultConsortiumOption = { label: 'All PCDC', value: 'total' };

/** @param {{ overviewCounts: import('./types').OverviewCounts }} props */
function IndexOverview({ overviewCounts }) {
  const { width: screenWidth } = useResizeDetector({
    handleHeight: false,
    targetRef: useRef(document.body),
  });

  const [consortium, setConsortium] = useState(defaultConsortiumOption);
  const consortiumOptions = [
    defaultConsortiumOption,
    ...(overviewCounts?.names ?? []).map((option) => ({
      label: option,
      value: option,
    })),
  ];

  const navigate = useNavigate();
  const explorerLocation =
    consortium.value === 'total'
      ? { pathname: '/explorer' }
      : {
          pathname: '/explorer',
          search: `filter={"consortium":{"selectedValues":["${consortium.value}"]}}`,
          state: { keepSearch: true },
        };

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  useEffect(() => {
    if (overviewCounts !== undefined) setIsDataLoaded(true);
  }, [overviewCounts]);

  /** @typedef {import('@fortawesome/fontawesome-svg-core').IconName} FaIconName */
  /** @returns {{ count: number; faIcon: FaIconName; name: { singular: string; plural: string }}[]} */
  const getCountDataList = () => [
    {
      count: overviewCounts.data[consortium.value].subject,
      faIcon: 'user',
      name: { singular: 'Subject', plural: 'Subjects' },
    },
    {
      count: overviewCounts.data[consortium.value].study,
      faIcon: 'flask',
      name: { singular: 'Study', plural: 'Studies' },
    },
    {
      count: overviewCounts.data[consortium.value].molecular_analysis,
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
          {screenWidth > breakpoints.tablet && (
            <Button
              label='Explore more'
              buttonType='primary'
              onClick={() => navigate(explorerLocation)}
            />
          )}
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
      {screenWidth <= breakpoints.tablet && (
        <div className='index-overview__footer'>
          <Button
            label='Explore more'
            buttonType='primary'
            onClick={() => navigate(explorerLocation)}
          />
        </div>
      )}
    </div>
  );
}

IndexOverview.propTypes = {
  overviewCounts: PropTypes.exact({
    names: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)),
  }),
};

export default IndexOverview;
