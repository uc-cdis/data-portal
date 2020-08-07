import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Divider, Space, Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './FooterNIAID.css';

const footerNavLinks = [
  {
    href: 'https://www.niaid.nih.gov/global/contact-us',
    text: 'CONTACT US',
  },
  {
    href: 'https://nih-niaidportal.dynamics365portals.us/en-US/publication-order-form/',
    text: 'PUBLICATIONS',
  },
  {
    href: 'https://www.niaid.nih.gov/node/5239',
    text: 'HELP',
  },
  {
    href: 'https://archive-it.org/organizations/1031',
    text: 'ARCHIVE',
  },
  {
    href: 'https://www.niaid.nih.gov/Site-Map',
    text: 'SITE MAP',
  },
  {
    href: 'https://www.niaid.nih.gov/node/6476',
    text: 'INFORMACIÓN EN ESPAÑOL',
  },
  {
    href: 'https://www.niaid.nih.gov/global/employee-information',
    text: 'EMPLOYEE INFORMATION',
  },
];

const footerSocialIconLinks = [
  {
    href: 'https://www.facebook.com/niaid.nih',
    icon: ['fab', 'facebook-square'],
  },
  {
    href: 'https://nih-niaidportal.dynamics365portals.us/en-US/publication-order-form/',
    icon: ['fab', 'twitter-square'],
  },
  {
    href: 'https://www.niaid.nih.gov/node/5239',
    icon: ['fab', 'linkedin'],
  },
  {
    href: 'https://archive-it.org/organizations/1031',
    icon: ['fab', 'youtube-square'],
  },
  {
    href: 'https://www.niaid.nih.gov/Site-Map',
    icon: ['fab', 'flickr'],
  },
  {
    href: 'https://www.niaid.nih.gov/node/6476',
    icon: ['fab', 'instagram-square'],
  },
  {
    href: 'https://www.niaid.nih.gov/global/employee-information',
    icon: ['fab', 'pinterest-square'],
  },
  {
    href: 'https://www.niaid.nih.gov/global/employee-information',
    icon: ['fas', 'envelope-square'],
  },
];

const footerWebsiteLinks = [
  {
    href: 'https://www.niaid.nih.gov/node/5225',
    text: 'Freedom of Information Act (FOIA)',
  },
  {
    href: 'https://www.niaid.nih.gov/node/5228',
    text: 'No Fear Act Data',
  },
  {
    href: 'https://www.niaid.nih.gov/node/5229',
    text: 'Privacy Policy',
  },
];

const footerGovLinks = [
  {
    href: 'National Institutes of Health',
    text: 'National Institutes of Health',
  },
  {
    href: 'http://www.hhs.gov/',
    text: 'Health and Human Services',
  },
  {
    href: 'http://www.usa.gov/',
    text: 'USA.gov',
  },
];

class FooterNIAID extends Component {
  render() {
    return (
      <footer className='footer-container'>
        <nav className='footer__nav'>
          <Space>
            {footerNavLinks.map((item, i) =>
              ((i === footerNavLinks.length - 1) ? <a key={`nav_link_${i}`} href={item.href}>{item.text}</a> :
                <div key={`nav_link_${i}`}>
                  <a href={item.href}>{item.text}</a>
                  <Divider type='vertical' />
                </div>))}
          </Space>
        </nav>
        <Divider className='footer__divider' />
        <div className='footer__bottom-area'>
          <Row gutter={8}>
            <Col className='gutter-row' span={6}>
              <div className='footer__logo'>
                {
                  this.props.logos.map((logoObj, i) => (
                    <a
                      key={`logo_${i}`}
                      target='_blank'
                      href={logoObj.href}
                      className='footer__icon'
                      rel='noopener noreferrer'
                    >
                      <img
                        className='footer__img'
                        src={logoObj.src}
                        alt={logoObj.alt}
                        style={{ height: logoObj.height ? logoObj.height : 60 }}
                      />
                    </a>
                  ))
                }
              </div>
            </Col>
            <Col className='gutter-row' span={6}>
              <div className='footer__social'>
                <a href='https://www.niaid.nih.gov/node/5232'>
                  <div className='footer__title'>Connect with NIAID</div>
                </a>
                <div className='footer__social-links'>
                  <Row>
                    {
                      footerSocialIconLinks.map((item, i) => (
                        <Col className='gutter-row' span={4} key={`icon_${i}`}>
                          <a href={item.href}>
                            <FontAwesomeIcon
                              icon={item.icon}
                              size='2x'
                            />
                          </a>
                        </Col>
                      ))
                    }
                  </Row>
                </div>
              </div>
            </Col>
            <Col className='gutter-row' span={6}>
              <Space direction='vertical'>
                <a href='https://www.niaid.nih.gov/global/website-policies-and-notices'>
                  <div className='footer__title'>Website Policies &amp; Notices</div>
                </a>
                {footerWebsiteLinks.map((item, i) => (<a key={`web_link_${i}`} href={item.href}>{item.text}</a>))}
              </Space>
            </Col>
            <Col className='gutter-row' span={6}>
              <Space direction='vertical'>
                <div className='footer__title'>Related Government Websites</div>
                {footerGovLinks.map((item, i) => (
                  <a key={`gov_link_${i}`} href={item.href}>
                    {item.text}
                    <FontAwesomeIcon
                      icon={'external-link-alt'}
                    />
                  </a>))}
              </Space>
            </Col>
          </Row>
        </div>
      </footer>
    );
  }
}

const LogoObject = PropTypes.shape({
  src: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  height: PropTypes.number,
});

FooterNIAID.propTypes = {
  logos: PropTypes.arrayOf(LogoObject).isRequired,
};

export default FooterNIAID;
