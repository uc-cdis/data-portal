import React from 'react';
import PropTypes from 'prop-types';
import { humanizeString, getTypeIconSVG, getCategoryColor } from '../../utils';
import './Legend.css';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  toggleLegend = () => {
    this.setState(state => ({
      show: !state.show,
    }));
  }

  render() {
    return (
      <div className={`data-dictionary-graph-legend ${this.state.show ? '' : 'data-dictionary-graph-legend--toggled'}`}>
        {
          this.state.show ?
            (
              <React.Fragment>
                <i
                  className='data-dictionary-graph-legend__close g3-icon g3-icon--cross'
                  onClick={this.toggleLegend}
                />
                <div className='data-dictionary-graph-legend__item body'>
                  <i className='data-dictionary-graph-legend__required-icon data-dictionary-graph-legend__required-icon--required g3-icon g3-icon--minus' />
                  <span className='data-dictionary-graph-legend__text'>Required Link</span>
                </div>
                <div className='data-dictionary-graph-legend__item body'>
                  <i className='data-dictionary-graph-legend__required-icon data-dictionary-graph-legend__required-icon g3-icon g3-icon--minus' />
                  <span className='data-dictionary-graph-legend__text'>Not Required Link</span>
                </div>
                {
                  this.props.items.map((type) => {
                    const itemColor = getCategoryColor(type);
                    const IconSvg = getTypeIconSVG(type);
                    return (
                      <div
                        key={type}
                        className='data-dictionary-graph-legend__item body'
                      >
                        <span className='data-dictionary-graph-legend__circle-wrapper'>
                          {
                            IconSvg ? <IconSvg /> : (
                              <span
                                className='data-dictionary-graph-legend__circle'
                                style={{ backgroundColor: itemColor }}
                              />
                            )
                          }
                        </span>
                        <span className='data-dictionary-graph-legend__text'>{humanizeString(type)}</span>
                      </div>
                    );
                  })
                }
              </React.Fragment>
            )
            : (
              <span
                className='data-dictionary-graph-legend__info'
                onClick={this.toggleLegend}
              >
                <i className='data-dictionary-graph-legend__info-icon g3-icon g3-icon--question-mark' />
              </span>
            )
        }
      </div>
    );
  }
}

Legend.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
};

Legend.defaultProps = {
  items: [],
};

export default Legend;
