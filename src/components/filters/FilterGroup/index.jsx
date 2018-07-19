import React from 'react';
import PropTypes from 'prop-types';
import FilterList from '../FilterList/.';
import './FilterGroup.less';

class FilterGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.tabs[0],
    }
  }

  selectTab(tab) {
    this.setState({ selectedTab: tab });
  }

  render() {
    return (
      <div className="filter-group">
        <div className="filter-group__tabs">
        {
          this.props.tabs.map((tab, index) => (
            <div
              key={index}
              className="filter-group__tab"
              onClick={() => this.selectTab(tab)}
            >
              <p className="filter-group__tab-title">
                {tab.title}
              </p>
            </div>
          ))
        }
        </div>
        <FilterList sections={this.state.selectedTab.sections} />
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
        filterType: PropTypes.oneOf(["singleSelect", "range"]),
      })),
    })),
  })),
}

export default FilterGroup;
