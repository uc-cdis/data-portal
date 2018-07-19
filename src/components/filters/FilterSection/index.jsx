import React from 'react';
import PropTypes from 'prop-types';
import SingleSelectFilter from '../SingleSelectFilter/.';
import RangeFilter from '../RangeFilter/.';
import './FilterSection.less';

class FilterSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
    }
    this.toggleSection = this.toggleSection.bind(this);
  }

  toggleSection() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    return (
      <div className="filter-section">
        <div className="filter-section__header">
          <p className="filter-section__title">{this.props.title}</p>
          <button onClick={this.toggleSection}>Icon</button>
        </div>
        {
          this.state.isExpanded ?
            this.props.options.map((option, index) => (
              option.filterType === "singleSelect" ?
                <SingleSelectFilter
                  key={index}
                  label={option.text}
                  onSelect={this.props.onSelect}
                />
              :
                <RangeFilter key={index} />
            ))
          : null
        }
      </div>
    );
  }
}

FilterSection.propTypes = {
  title: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    filterType: PropTypes.oneOf(["singleSelect", "range"]),
  })),
  onSelect: PropTypes.func,
}

export default FilterSection;
