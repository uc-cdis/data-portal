import React from 'react';
import PropTypes from 'prop-types';
import FilterList from '../FilterList/.';
import './FilterGroup.less';

class FilterGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: { index: 0, ...this.props.tabs[0] },
    };
  }

  selectTab(tab, index) {
    this.setState({ selectedTab: { index, ...tab } });
  }

  render() {
    console.log(this.props.tabs[this.state.selectedTab.index]);
    return (
      <div className="filter-group">
        <div className="filter-group__tabs">
          {
            this.props.tabs.map((tab, index) => (
              <div
                key={index}
                role="button"
                tabIndex={this.state.selectedTab.index}
                className={'filter-group__tab'.concat(this.state.selectedTab.index === index ? ' filter-group__tab--selected' : '')}
                onClick={() => this.selectTab(tab, index)}
                onKeyDown={() => this.selectTab(tab, index)}
              >
                <p className="filter-group__tab-title">
                  {this.props.filterConfig.tabs[tab.key].title}
                </p>
              </div>
            ))
          }
        </div>
        <div className="filter-group__filter-area">
          {this.props.tabs[this.state.selectedTab.index]}
        </div>
      </div>
    );
  }
}

FilterGroup.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilterGroup;
