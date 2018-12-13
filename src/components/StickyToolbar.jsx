import React from 'react';
import PropTypes from 'prop-types';
import './StickyToolbar.less';

class StickyToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPos: 0,
      isScrolling: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollToTop);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollToTop);
  }

  scrollToTop = () => {
    let isScrolling = true;
    if (window.pageYOffset < this.props.scrollPosition) {
      isScrolling = false;
    }

    this.setState({ isScrolling, scrollPos: window.pageYOffset });
    this.props.onScroll(isScrolling);
  }

  render() {
    return (
      <div className={'sticky-toolbar'.concat(this.state.isScrolling ? ' sticky-toolbar--scrolling' : '')}>
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
  scrollPosition: PropTypes.number,
  onScroll: PropTypes.func,
};

StickyToolbar.defaultProps = {
  title: '',
  toolbarElts: [],
  scrollPosition: 10,
  onScroll: () => {},
};

export default StickyToolbar;
