import PropTypes from 'prop-types';
import React, { Component } from 'react';
import parse from 'html-react-parser';
import IconicLink from './buttons/IconicLink';
import './Introduction.less';
import { useArboristUI, hideSubmissionIfIneligible } from '../configs';
import { userHasCreateOrUpdateOnAnyProject } from '../authMappingUtils';

class Introduction extends Component {
  render() {
    let buttonText = 'Submit Data';
    if (useArboristUI) {
      if (userHasCreateOrUpdateOnAnyProject(this.props.userAuthMapping)) {
        buttonText = 'Submit/Browse Data';
      } else {
        buttonText = 'Browse Data';
      }
    }

    const shouldDisplaySubmissionButton = (() => {
      if (!this.props.data.link) {
        return false;
      }
      if (useArboristUI && hideSubmissionIfIneligible) {
        if (userHasCreateOrUpdateOnAnyProject(this.props.userAuthMapping)) {
          return true;
        }
        return false;
      }
      return true;
    })();

    return (
      <div className='introduction'>
        <h1>
          <div className='h1-typo introduction__title'>
            {this.props.data.heading}
          </div>
        </h1>
        <div className='high-light introduction__text'>
          {(this.props.data.text) ? parse(this.props.data.text) : null}
          {(this.props.data.multiLineTexts)
            ? (this.props.data.multiLineTexts
              .map((text, i) => <p key={i}>{parse(text)}</p>)) : null}
        </div>
        {(shouldDisplaySubmissionButton)
          ? (
            <IconicLink
              link={this.props.data.link}
              dictIcons={this.props.dictIcons}
              className='introduction__icon'
              icon='upload'
              iconColor='#'
              caption={buttonText}
            />
          )
          : null}
      </div>
    );
  }
}

Introduction.propTypes = {
  data: PropTypes.object.isRequired,
  dictIcons: PropTypes.object.isRequired,
  userAuthMapping: PropTypes.object.isRequired,
};

export default Introduction;
