import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './StickyToolbar.less';

/**
 * @typedef {Object} StickyToolbarProps
 * @property {(isScrolling: boolean) => void} [onScroll]
 * @property {number} [scrollPosition]
 * @property {string} [title]
 * @property {JSX.Element[]} [toolbarElts]
 */

/** @param {StickyToolbarProps} props */
function StickyToolbar({
  onScroll,
  scrollPosition = 10,
  title = '',
  toolbarElts = [],
}) {
  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    function scrollToTop() {
      const scrolling = window.pageYOffset >= scrollPosition;
      setIsScrolling(scrolling);
      onScroll?.(scrolling);
    }
    window.addEventListener('scroll', scrollToTop);
    return () => {
      window.removeEventListener('scroll', scrollToTop);
    };
  }, []);

  return (
    <div
      className={'sticky-toolbar'.concat(
        isScrolling ? ' sticky-toolbar--scrolling' : ''
      )}
    >
      <div className='h2-typo'>{title}</div>
      <div className='sticky-toolbar__elts'>
        {toolbarElts.map((elt, i) => React.cloneElement(elt, { key: i }))}
      </div>
    </div>
  );
}

StickyToolbar.propTypes = {
  onScroll: PropTypes.func,
  scrollPosition: PropTypes.number,
  title: PropTypes.string,
  toolbarElts: PropTypes.array,
};

export default StickyToolbar;
