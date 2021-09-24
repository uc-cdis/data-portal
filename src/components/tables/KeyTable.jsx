import React from 'react';
import PropTypes from 'prop-types';
import Table from './base/Table';
import dictIcons from '../../img/icons/index';
import IconicButton from '../buttons/IconicButton';
import './KeyTable.less';

const LIST_API_KEY_MSG = 'You have the following API key(s)';
const API_KEY_COLUMN = 'API key(s)';
const EXPIRES_COLUMN = 'Expires';
export const DELETE_BTN = 'Delete';

/**
 * @typedef {Object} KeyTableProps
 * @property {{ jti: string; exp: number; }[]} jtis
 * @property {(jti: { jti: string; exp: number; }) => void} onDelete
 */

/** @param {KeyTableProps} props */
function KeyTable({ jtis, onDelete }) {
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */
  return (
    <div className='key-table'>
      <Table
        title={LIST_API_KEY_MSG}
        header={[API_KEY_COLUMN, EXPIRES_COLUMN, '']}
        data={jtis.map((jti) => [
          jti.jti,
          new Date(jti.exp * 1000).toLocaleString(),
          <IconicButton
            onClick={() => onDelete(jti)}
            caption={DELETE_BTN}
            dictIcons={dictIcons}
            icon='delete'
            buttonClassName='button-primary-white'
          />,
        ])}
      />
    </div>
  );
}

KeyTable.propTypes = {
  jtis: PropTypes.arrayOf(
    PropTypes.shape({
      jti: PropTypes.string.isRequired,
      exp: PropTypes.number.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default KeyTable;
