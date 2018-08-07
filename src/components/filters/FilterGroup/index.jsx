import React from 'react';
import PropTypes from 'prop-types';
import './FilterGroup.less';

class FilterGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };
  }

  selectTab(index) {
    this.setState({ selectedTabIndex: index });
  }

  render() {
    return (
      <div className='filter-group'>
        <div className='filter-group__tabs'>
          {
            this.props.tabs.map((tab, index) => (
              <div
                key={index}
                role='button'
                tabIndex={index}
                className={'filter-group__tab'.concat(this.state.selectedTabIndex === index ? ' filter-group__tab--selected' : '')}
                onClick={() => this.selectTab(index)}
                onKeyDown={() => this.selectTab(index)}
              >
                <p className='filter-group__tab-title'>
                  {this.props.filterConfig.tabs[tab.key].title}
                </p>
              </div>
            ))
          }
        </div>
        <div className='filter-group__filter-area'>
          {React.cloneElement(this.props.tabs[this.state.selectedTabIndex], { ...this.props })}
        </div>
      </div>
    );
  }
}

FilterGroup.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterConfig: PropTypes.shape({
    tabs: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      fields: PropTypes.arrayOf(PropTypes.string),
    })),
  }).isRequired,
};

export default FilterGroup;
