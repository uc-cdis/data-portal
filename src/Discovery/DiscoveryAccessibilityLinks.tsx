import React from 'react';
import Tooltip from 'rc-tooltip';

const tooltipText = 'These accessibility links assist with keyboard navigation of the site. Selecting a link will bring tab focus to the specified page content.';

const viewLinkedElement = (elementId) => {
  /*
    To ensure accessibility and 508 compliance, users should be able
    to bypass repetitive blocks of content to reach important areas of the
    page. This function brings focus to the Antd Discovery pagination.
    Our method here is verbose due to:
    https://github.com/ant-design/ant-design/issues/8305
  */
  const element = document.getElementById(elementId);
  const targetHash = `#${elementId}`;
  [...document.getElementsByTagName('a')].forEach((link) => {
    if (link.hash === targetHash) {
      // The scrollTo function requires a setTimeout in our app.
      // https://stackoverflow.com/questions/1174863/javascript-scrollto-method-does-nothing
      setTimeout(() => window.scrollTo(0, element.offsetTop), 2);
      link.click();
    }
  });
};

const DiscoveryAccessibilityLinks = () => (
  <div className='g3-accessibility-links' id='discovery-page-accessibility-links'>
    <Tooltip
      placement='left'
      overlay={tooltipText}
      overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
      arrowContent={<div className='rc-tooltip-arrow-inner' />}
      width='300px'
      trigger={['hover', 'focus']}
    >
      <span className='g3-helper-tooltip g3-ring-on-focus' role='tooltip'>
        <i className='g3-icon g3-icon--sm g3-icon--question-mark-bootstrap help-tooltip-icon' />
      </span>
    </Tooltip>

    <a
      className='g3-accessibility-nav-link g3-ring-on-focus'
      href='#discovery-summary-statistics'
      onClick={() => viewLinkedElement('discovery-summary-statistics')}
    >
      <span>Summary Statistics</span>
    </a> |

    <a
      className='g3-accessibility-nav-link g3-ring-on-focus'
      href='#discovery-tag-filters'
      onClick={() => viewLinkedElement('discovery-tag-filters')}
    >
      <span>Tags</span>
    </a> |

    <a
      className='g3-accessibility-nav-link g3-ring-on-focus'
      href='#discovery-table-of-records'
      onClick={() => viewLinkedElement('discovery-table-of-records')}
    >
      <span>Table of Records</span>
    </a> |

    <a
      className='g3-accessibility-nav-link g3-ring-on-focus'
      href='#discovery-pagination'
      onClick={
        () => {
          const discoveryPagination = document.getElementsByClassName(
            'ant-pagination-item ant-pagination-item-1 ant-pagination-item-active',
          );
          if (discoveryPagination.length > 0) {
            discoveryPagination[0].id = 'discovery-pagination';
            viewLinkedElement('discovery-pagination');
          }
        }
      }
    >
      <span>Pagination</span>
    </a>
  </div>
);

export default DiscoveryAccessibilityLinks;
