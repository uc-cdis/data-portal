import React from 'react';
import PropTypes from 'prop-types';
import './StickyToolbar.less';

class StickyToolbar extends React.Component {
  render() {
    return (
      <div className='sticky-toolbar'>
        <div className='h2-typo'>
          {this.props.title}
        </div>
        <div className='sticky-toolbar__elts'>
          {
            this.props.toolbarElts.map((elt, i) =>
              React.cloneElement(elt, { key: i }),
            )}
        </div>
      </div>
    );
  }
}

StickyToolbar.propTypes = {
  title: PropTypes.string,
  toolbarElts: PropTypes.array,
};

StickyToolbar.defaultProps = {
  title: '',
  toolbarElts: [],
};

export default StickyToolbar;
