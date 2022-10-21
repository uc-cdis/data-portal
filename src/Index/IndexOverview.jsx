import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useResizeDetector } from 'react-resize-detector';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorBoundary from '../components/ErrorBoundary';
import Spinner from '../components/Spinner';
import Button from '../gen3-ui-component/components/Button';
import { FILTER_TYPE } from '../GuppyComponents/Utils/const';
import { overrideSelectTheme } from '../utils';
import { breakpoints } from '../localconf';
import './IndexOverview.css';

const defaultConsortiumOption = { label: 'All PCDC', value: 'total' };

function CountsDataView({ counts }) {
  /** @typedef {import('@fortawesome/fontawesome-svg-core').IconName} FaIconName */
  /** @type {{ count: number; faIcon: FaIconName; name: { singular: string; plural: string }}[]} */
  const data = [
    {
      count: counts.subject,
      faIcon: 'user',
      name: { singular: 'Subject', plural: 'Subjects' },
    },
    {
      count: counts.study,
      faIcon: 'flask',
      name: { singular: 'Study', plural: 'Studies' },
    },
    {
      count: counts.molecular_analysis,
      faIcon: 'microscope',
      name: {
        singular: 'Molecular analysis',
        plural: 'Molecular analyses',
      },
    },
  ];
  return (
    <>
      {data.map(({ count, faIcon, name }) => (
        <div className='index-overview__count' key={name.singular}>
          <h3>{count}</h3>
          <div>
            <FontAwesomeIcon icon={faIcon} size='lg' />
            {count > 1 ? name.plural : name.singular}
          </div>
        </div>
      ))}
    </>
  );
}

CountsDataView.propTypes = {
  counts: PropTypes.object,
};

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
  /** @type {[to: string, options?: import('react-router').NavigateOptions]} */
  const navigateParams = ['/explorer'];
  if (consortium.value !== 'total') {
    const selectedValues = [consortium.value];
    const filter = {
      __combineMode: 'AND',
      __type: FILTER_TYPE.STANDARD,
      value: { consortium: { __type: FILTER_TYPE.OPTION, selectedValues } },
    };
    navigateParams.push({ state: { filter } });
  }

  const isDataLoaded = overviewCounts !== undefined;

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
              onClick={() => navigate(...navigateParams)}
            />
          )}
        </div>
      </div>
      <div className='index-overview__body'>
        {isDataLoaded ? (
          <ErrorBoundary
            fallback={
              <div className='index-overview__count'>
                <FontAwesomeIcon icon='triangle-exclamation' />
                Error in fetching the overview counts data...
              </div>
            }
          >
            <CountsDataView counts={overviewCounts.data?.[consortium.value]} />
          </ErrorBoundary>
        ) : (
          <Spinner />
        )}
      </div>
      {screenWidth <= breakpoints.tablet && (
        <div className='index-overview__footer'>
          <Button
            label='Explore more'
            buttonType='primary'
            onClick={() => navigate(...navigateParams)}
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
