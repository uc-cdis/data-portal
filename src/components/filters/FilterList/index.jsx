import React from 'react';
import PropTypes from 'prop-types';
import FilterSection from '../FilterSection/.';
import './FilterList.less';

class FilterList extends React.Component {
  render() {
    return (
      <div className='filter-list'>
        {
          this.props.sections.map((section, index) => (
            <FilterSection
              {...this.props}
              key={index}
              title={section.title}
              options={section.options}
            />
          ))
        }
      </div>
    );
  }
}

FilterList.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      filterType: PropTypes.oneOf(['singleSelect', 'range']),
    })),
  })).isRequired,
};

export default FilterList;
