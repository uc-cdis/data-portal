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

const TimestampToDateTime = (timestamp) => {
  const t = new Date(timestamp * 1000);
  return t.toLocaleString();
};

const keyType = PropTypes.shape({
  jti: PropTypes.string.isRequired,
  exp: PropTypes.number.isRequired,
});

class KeyTable extends React.Component {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["rowRender"] }] */
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */

  getData = jtis => jtis.map(jti => [
    jti.jti,
    TimestampToDateTime(jti.exp),
    <IconicButton
      onClick={() => this.props.onDelete(jti)}
      caption={DELETE_BTN}
      dictIcons={dictIcons}
      icon='delete'
      buttonClassName='button-primary-white'
    />,
  ]);

  render() {
    return (
      <div className='key-table'>
        <Table
          title={LIST_API_KEY_MSG}
          header={[API_KEY_COLUMN, EXPIRES_COLUMN, '']}
          data={this.getData(this.props.jtis)}
        />
      </div>
    );
  }
}

KeyTable.propTypes = {
  jtis: PropTypes.arrayOf(keyType),
  onDelete: PropTypes.func.isRequired,
};

KeyTable.defaultProps = {
  jtis: [],
};

export default KeyTable;
