import React from 'react';
import PropTypes from 'prop-types';
import SingleSelectFilter from '../SingleSelectFilter/.';
import RangeFilter from '../RangeFilter/.';
import FontAwesome from 'react-fontawesome';
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
          <FontAwesome
            name={this.state.isExpanded ? "chevron-down" : "chevron-up"}
            onClick={this.toggleSection}
          />
        </div>
        <div className="filter-section__options">
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
                  <RangeFilter
                    key={index}
                    label={option.text}
                    min={option.min}
                    max={option.max}
                    onDrag={this.props.onDrag}
                  />
              ))
            : null
          }
        </div>
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
  onDrag: PropTypes.func,
}

export default FilterSection;
