import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './TierAccessSelector.css';

/**
 * Tier access selector has 3 options: 'Data with Access', 'Data without Access', and 'All Data'
 * By default "All Data" is selected
 */
class TierAccessSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'all-data',
      toggled: false,
    };
  }

  handleSelectorChange = (e) => {
    this.props.onSelectorChange(e.target.value);
    this.setState({ selected: e.target.value });
  };

  handleToggle = () => {
    this.setState(prevState => ({ toggled: !prevState.toggled }));
  }

  render() {
    return (
      <div className='tier-access-selector'>
        <div
          className='tier-access-selector__dropdown'
          onClick={this.handleToggle}
          role='button'
          tabIndex={0}
        >
          <h4>
            <span className='tier-access-selector__title'>Data Access</span>
            <i className={`tier-access-selector__dropdown-icon g3-icon g3-icon--chevron-${this.state.toggled ? 'down' : 'up'}`} />
          </h4>
        </div>
        {
          !this.state.toggled && (
            <div>
              <div className='tier-access-selector__items'>
                <div className='tier-access-selector__item'>
                  <input
                    onChange={this.handleSelectorChange}
                    name='access-level'
                    id='with-access'
                    value='with-access'
                    className='tier-access-selector__radio-input'
                    type='radio'
                    checked={this.state.selected === 'with-access'}
                  />
                  <i className='tier-access-selector__customized-radio-input' />
                  <label htmlFor='with-access' className='tier-access-selector__label'>Data with Access</label>
                </div>
                <div className='tier-access-selector__item'>
                  <input
                    onChange={this.handleSelectorChange}
                    name='access-level'
                    id='without-access'
                    value='without-access'
                    className='tier-access-selector__radio-input'
                    type='radio'
                    checked={this.state.selected === 'without-access'}
                  />
                  <i className='tier-access-selector__customized-radio-input' />
                  <label htmlFor='without-access' className='tier-access-selector__label'>Data without Access</label>
                </div>
                <div className='tier-access-selector__item'>
                  <input
                    onChange={this.handleSelectorChange}
                    name='access-level'
                    id='all-data'
                    value='all-data'
                    className='tier-access-selector__radio-input'
                    type='radio'
                    checked={this.state.selected === 'all-data'}
                  />
                  <i className='tier-access-selector__customized-radio-input' />
                  <label htmlFor='all-data' className='tier-access-selector__label'>All Data</label>
                </div>
              </div>
              {
                this.state.selected !== 'with-access' && (
                  <div className='tier-access-selector__button-wrapper'>
                    <Button
                      label='Get Access'
                      className='tier-access-selector__button'
                      buttonType='default'
                      onClick={
                        () => { window.open(this.props.getAccessButtonLink); }
                      }
                    />
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    );
  }
}

TierAccessSelector.propTypes = {
  // callback function everytime selector changes
  // paramter will be one of: 'with-access', 'without-access', or 'all-data'
  onSelectorChange: PropTypes.func,
  getAccessButtonLink: PropTypes.string,
};

TierAccessSelector.defaultProps = {
  onSelectorChange: () => {},
  getAccessButtonLink: 'https://gen3.org/',
};

export default TierAccessSelector;
