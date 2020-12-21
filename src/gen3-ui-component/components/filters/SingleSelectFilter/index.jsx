import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import './SingleSelectFilter.css';

class SingleSelectFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: typeof props.selected === 'undefined' ? false : props.selected,
    };
  }

  handleCheck() {
    this.setState(prevState => ({ selected: !prevState.selected }));
    this.props.onSelect(this.props.label);
  }

  render() {
    if (this.props.count === 0 && this.props.hideZero) {
      return null;
    }
    // Takes in parent component's selected or self state's selected
    const selected = (typeof this.props.selected === 'undefined') ? this.state.selected : this.props.selected;
    let inputDisabled = this.props.disabled;
    let lockIconComponent = <React.Fragment />;
    let countIconComponent = <React.Fragment />;

    const showLockedTooltip = !this.props.accessible && this.props.lockedTooltipMessage !== '';

    if (!this.props.accessible) {
      lockIconComponent = <i className='g3-icon g3-icon--md g3-icon--lock g3-icon-color__gray' />;
      if (showLockedTooltip) {
        lockIconComponent = (
          <React.Fragment>
            {
              <Tooltip
                placement='right'
                overlay={<span>{this.props.lockedTooltipMessage}</span>}
                arrowContent={<div className='rc-tooltip-arrow-inner' />}
                trigger={['hover', 'focus']}
              >
                {lockIconComponent}
              </Tooltip>
            }
          </React.Fragment>
        );
      }
    }

    if (this.props.count === this.props.hideValue) {
      // we don't disable selected filters
      inputDisabled = !selected;
      countIconComponent = this.props.tierAccessLimit ? (
        <span className='g3-badge g3-single-select-filter__count'>
          {this.props.tierAccessLimit}
          <i className='g3-icon--under g3-icon g3-icon--sm g3-icon-color__base-blue' />
        </span>
      ) : (
        <span className='g3-single-select-filter__icon-background'>
          <i className='g3-icon--under g3-icon g3-icon--sm g3-icon-color__base-blue' />
        </span>
      );
      const showDisabledTooltip = inputDisabled && this.props.disabledTooltipMessage !== '';
      if (showDisabledTooltip) {
        countIconComponent = (
          <React.Fragment>
            {
              <Tooltip
                placement='right'
                overlay={<span>{this.props.disabledTooltipMessage}</span>}
                arrowContent={<div className='rc-tooltip-arrow-inner' />}
                trigger={['hover', 'focus']}
              >
                {countIconComponent}
              </Tooltip>
            }
          </React.Fragment>
        );
      }
    } else if (this.props.accessible) {
      countIconComponent = <span className='g3-badge g3-single-select-filter__count'>{this.props.count}</span>;
    }

    return (
      <div className='g3-single-select-filter'>
        <input
          className='g3-single-select-filter__checkbox'
          type='checkbox'
          onChange={() => this.handleCheck()}
          checked={selected}
          disabled={inputDisabled}
        />
        {
          inputDisabled ? (
            <span
              className='g3-single-select-filter__label g3-single-select-filter__label--disabled'
              role='button'
              tabIndex={0}
            >
              {this.props.label}
            </span>
          ) : (
            <span
              className='g3-single-select-filter__label'
              onClick={() => this.handleCheck()}
              onKeyPress={() => this.handleCheck()}
              role='button'
              tabIndex={0}
            >
              {this.props.label}
            </span>
          )
        }
        { this.props.count !== null && countIconComponent }
        { lockIconComponent }
      </div>
    );
  }
}

SingleSelectFilter.propTypes = {
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  count: PropTypes.number,
  hideZero: PropTypes.bool,
  hideValue: PropTypes.number,
  tierAccessLimit: PropTypes.number,
  accessible: PropTypes.bool,
  disabled: PropTypes.bool,
  lockedTooltipMessage: PropTypes.string,
  disabledTooltipMessage: PropTypes.string,
};

SingleSelectFilter.defaultProps = {
  selected: undefined,
  count: 0,
  hideZero: true,
  hideValue: -1,
  tierAccessLimit: undefined,
  accessible: true,
  disabled: false,
  lockedTooltipMessage: '',
  disabledTooltipMessage: '',
};

export default SingleSelectFilter;
