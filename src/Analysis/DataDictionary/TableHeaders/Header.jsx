import React, { useState } from 'react';

const Header = ({ header, key }) => {
  const [isActive, setIsActive] = useState({
    top: false,
    bottom: false,
  });
  const handleClick = () => {
    if (!isActive.top && !isActive.bottom)
      setIsActive({ top: true, bottom: false });
    else if (isActive.top && !isActive.bottom)
      setIsActive({ top: false, bottom: true });
    else setIsActive({ top: false, bottom: false });
  };

  return (
    <th key={key} onClick={handleClick}>
      <div className='table-column-sorters'>
        <span className='ant-table-column-title'>{header}</span>
        <span className='table-column-sorter-inner'>
          <span
            role='presentation'
            aria-label='caret-up'
            className={`table-column-sorter-up ${isActive.top ? 'active' : ''}`}
          >
            <svg
              viewBox='0 0 1024 1024'
              focusable='false'
              data-icon='caret-up'
              width='1em'
              height='1em'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z' />
            </svg>
          </span>
          <span
            role='presentation'
            aria-label='caret-down'
            className={`table-column-sorter-down ${
              isActive.bottom ? 'active' : ''
            }`}
          >
            <svg
              viewBox='0 0 1024 1024'
              focusable='false'
              data-icon='caret-down'
              width='1em'
              height='1em'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z' />
            </svg>
          </span>
        </span>
      </div>
    </th>
  );
};

export default Header;
