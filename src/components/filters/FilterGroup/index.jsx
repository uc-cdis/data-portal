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
              >
                <p className="filter-group__tab-title">
                  {tab.title}
                </p>
              </div>
            ))
          }
        </div>
        <div className="filter-group__filter-area">
          <FilterList sections={this.state.selectedTab.sections} />
        </div>
      </div>
    );
  }
}

FilterGroup.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    sections: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string,
        filterType: PropTypes.oneOf(['singleSelect', 'range']),
      })),
    })),
  })).isRequired,
};

export default FilterGroup;
