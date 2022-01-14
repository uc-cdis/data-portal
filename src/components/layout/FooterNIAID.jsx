import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Space, Row, Col, Tooltip,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './FooterNIAID.less';

const footerSocialIconLinks = [
  {
    href: 'https://www.facebook.com/niaid.nih',
    icon: ['fab', 'facebook-square'],
  },
  {
    href: 'https://twitter.com/NIAIDNews',
    icon: ['fab', 'twitter-square'],
  },
  {
    href: 'https://www.linkedin.com/company/2360731',
    icon: ['fab', 'linkedin'],
  },
  {
    href: 'https://www.youtube.com/user/niaid',
    icon: ['fab', 'youtube-square'],
  },
  {
    href: 'https://www.flickr.com/photos/niaid/',
    icon: ['fab', 'flickr'],
  },
  {
    href: 'https://www.instagram.com/niaid/',
    icon: ['fab', 'instagram-square'],
  },
  {
    href: 'https://www.pinterest.com/niaid/',
    icon: ['fab', 'pinterest-square'],
  },
  {
    href: 'https://www.niaid.nih.gov/global/email-updates',
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
    href: 'https://www.nih.gov/',
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
  {
    href: "https://hhs.responsibledisclosure.com/hc/en-us",
    text: "HHS Responsible Disclosure Form",
  },
];

class FooterNIAID extends Component {
  render() {
    return (
      <footer className='footer-container'>
        <div className='footer__bottom-area'>
          <Row gutter={[8, {
            xs: 16, sm: 16, md: 16, lg: 8,
          }]}
          >
            <Col className='gutter-row' xs={24} sm={12} md={12} lg={6} xl={6}>
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
            <Col className='gutter-row' xs={24} sm={12} md={12} lg={6} xl={6}>
              <div className='footer__social'>
                <Space direction='vertical'>
                  <a className='footer__title' href='https://www.niaid.nih.gov/node/5232'>
                    <div className='footer__title'>Connect with NIAID</div>
                  </a>
                  <div className='footer__social-links'>
                    <Row>
                      {
                        footerSocialIconLinks.map((item, i) => (
                          <Col className='gutter-row' span={4} key={`icon_${i}`}>
                            <a
                              href={item.href}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
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
                </Space>
              </div>
            </Col>
            <Col className='gutter-row' xs={24} sm={12} md={12} lg={6} xl={6}>
              <Space direction='vertical'>
                <a className='footer__title' href='https://www.niaid.nih.gov/global/website-policies-and-notices'>
                  <div className='footer__title'>Website Policies &amp; Notices</div>
                </a>
                {footerWebsiteLinks.map((item, i) => (<a key={`web_link_${i}`} href={item.href}>{item.text}</a>))}
              </Space>
            </Col>
            <Col className='gutter-row' xs={24} sm={12} md={12} lg={6} xl={6}>
              <Space direction='vertical'>
                <div className='footer__title'>Related Government Websites</div>
                {footerGovLinks.map((item, i) => (
                  <a
                    key={`gov_link_${i}`}
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Space>
                      {item.text}
                      <Tooltip title='This link is external'>
                        <FontAwesomeIcon
                          icon={'external-link-alt'}
                        />
                      </Tooltip>
                    </Space>
                  </a>
                ))}
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
