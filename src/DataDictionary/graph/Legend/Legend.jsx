import { useState } from 'react';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter } from '../../../utils';
import {
  getCategoryIconSVG,
  getCategoryColor,
} from '../../NodeCategories/helper';
import './Legend.css';

/**
 * @param {Object} props
 * @param {string[]} [props.items]
 */
function Legend({ items }) {
  const [show, setShow] = useState(true);
  function toggleLegend() {
    setShow((s) => !s);
  }
  return (
    <div
      className={`data-dictionary-graph-legend ${
        show ? '' : 'data-dictionary-graph-legend--toggled'
      }`}
    >
      {show ? (
        <>
          <span
            className='data-dictionary-graph-legend__close'
            onClick={toggleLegend}
            onKeyPress={(e) => {
              if (e.charCode === 13 || e.charCode === 32) {
                e.preventDefault();
                toggleLegend();
              }
            }}
            role='button'
            tabIndex={0}
            aria-label='Close legend'
          >
            <i className='data-dictionary-graph-legend__close-icon g3-icon g3-icon--cross' />
          </span>
          <div className='data-dictionary-graph-legend__item body'>
            <i className='data-dictionary-graph-legend__required-icon data-dictionary-graph-legend__required-icon--required g3-icon g3-icon--minus' />
            <span className='data-dictionary-graph-legend__text'>
              Required Link
            </span>
          </div>
          <div className='data-dictionary-graph-legend__item body'>
            <i className='data-dictionary-graph-legend__required-icon data-dictionary-graph-legend__required-icon g3-icon g3-icon--minus' />
            <span className='data-dictionary-graph-legend__text'>
              Optional Link
            </span>
          </div>
          {(items ?? []).map((category) => {
            const itemColor = getCategoryColor(category);
            const IconSvg = getCategoryIconSVG(category);
            return (
              <div
                key={category}
                className='data-dictionary-graph-legend__item body'
              >
                <span className='data-dictionary-graph-legend__circle-wrapper'>
                  {IconSvg ? (
                    <IconSvg />
                  ) : (
                    <span
                      className='data-dictionary-graph-legend__circle'
                      style={{ backgroundColor: itemColor }}
                    />
                  )}
                </span>
                <span className='data-dictionary-graph-legend__text'>
                  {capitalizeFirstLetter(category)}
                </span>
              </div>
            );
          })}
        </>
      ) : (
        <span
          className='data-dictionary-graph-legend__info'
          onClick={toggleLegend}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              toggleLegend();
            }
          }}
          role='button'
          tabIndex={0}
          aria-label='Open legend'
        >
          <i className='data-dictionary-graph-legend__info-icon g3-icon g3-icon--question-mark' />
        </span>
      )}
    </div>
  );
}

Legend.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
};

export default Legend;
