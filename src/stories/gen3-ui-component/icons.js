import React from 'react';
import { storiesOf } from '@storybook/react';
import '../src/css/icon.css';
import './icon-story.css';

const iconClassList = [
  'g3-icon g3-icon--download',
  'g3-icon g3-icon--upload',
  'g3-icon g3-icon--back',
  'g3-icon g3-icon--copy',
  'g3-icon g3-icon--key',
  'g3-icon g3-icon--cross-key',
  'g3-icon g3-icon--cross',
  'g3-icon g3-icon--delete',
  'g3-icon g3-icon--exit',
  'g3-icon g3-icon--undo',
  'g3-icon g3-icon--link',
  'g3-icon g3-icon--doctor',
  'g3-icon g3-icon--datafile',
  'g3-icon g3-icon--user',
  'g3-icon g3-icon--user-circle',
  'g3-icon g3-icon--chevron-left',
  'g3-icon g3-icon--chevron-right',
  'g3-icon g3-icon--chevron-up',
  'g3-icon g3-icon--chevron-down',
  'g3-icon g3-icon--dropdown',
  'g3-icon g3-icon--external-link',
  'g3-icon g3-icon--folder',
  'g3-icon g3-icon--forward',
  'g3-icon g3-icon--eye',
  'g3-icon g3-icon--eye-close',
  'g3-icon g3-icon--minus',
  'g3-icon g3-icon--plus',
  'g3-icon g3-icon--question-mark',
  'g3-icon g3-icon--question-mark-bootstrap',
  'g3-icon g3-icon--reset',
  'g3-icon g3-icon--search',
  'g3-icon g3-icon--star',
  'g3-icon g3-icon--bar-chart',
  'g3-icon g3-icon--book',
  'g3-icon g3-icon--clipboard',
  'g3-icon g3-icon--clinical',
  'g3-icon g3-icon--file',
  'g3-icon g3-icon--lab',
  'g3-icon g3-icon--notation',
  'g3-icon g3-icon--stacked-bar',
  'g3-icon g3-icon--undefined',
  'g3-icon g3-icon--list',
  'g3-icon g3-icon--lock',
  'g3-icon g3-icon--profile g3-icon--lg',
  'g3-icon g3-icon--query g3-icon--lg',
  'g3-icon g3-icon--workspace g3-icon--lg',
  'g3-icon g3-icon--analysis g3-icon--lg',
  'g3-icon g3-icon--dictionary g3-icon--lg',
  'g3-icon g3-icon--exploration g3-icon--lg',
  'g3-icon g3-icon--files g3-icon--lg',
  'g3-icon g3-icon--graph g3-icon--lg',
];

storiesOf('General/Icons and Images', module)
  .add('Icons', () => (
    <div className='icon-demo'>
      {
        iconClassList.map(iconClass => (
          <div className='icon-demo__card' key={iconClass}>
            <div className='icon-demo__icon-wrap'>
              <i className={`icon-demo__icon ${iconClass}`} />
            </div>
            <div>
              {iconClass.split(' ').map(iconClassName => (
                <p className='icon-demo__text' key={iconClassName}>
                  {iconClassName}
                </p>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  ));
