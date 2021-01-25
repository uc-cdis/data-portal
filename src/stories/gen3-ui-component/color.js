import React from 'react';
import { storiesOf } from '@storybook/react';
import './color-story.css';

const coreSystemColors = [
  [
    { name: 'primary', color: 'pcdc-color__primary' },
    { name: 'primary-light', color: 'pcdc-color__primary-light' },
    { name: 'primary-dark', color: 'pcdc-color__primary-dark' },
  ],
  [
    { name: 'secondary', color: 'pcdc-color__secondary' },
    { name: 'secondary-light', color: 'pcdc-color__secondary-light' },
  ],
  [
    { name: 'bg-coal', color: 'g3-color__bg-coal' },
    { name: 'bg-cloud', color: 'g3-color__bg-cloud' },
  ],
];

const supportSystemColors = [
  [
    { name: 'gray', color: 'g3-color__gray' },
    { name: 'lightgray', color: 'g3-color__lightgray' },
  ],
  [
    { name: 'smoke', color: 'g3-color__smoke' },
    { name: 'silver', color: 'g3-color__silver' },
  ],
];

const extendSystemColors = [
  [
    { name: 'black', color: 'g3-color__black' },
    { name: 'white', color: 'g3-color__white' },
  ],
];

const visColors = [
  { name: 'base-blue', color: 'g3-color__base-blue' },
  { name: 'lime', color: 'g3-color__lime' },
  { name: 'iris', color: 'g3-color__iris' },
  { name: 'rose', color: 'g3-color__rose' },
  { name: 'bee', color: 'g3-color__bee' },
  { name: 'base-blue-light', color: 'g3-color__base-blue-light' },
  { name: 'pink', color: 'g3-color__pink' },
  { name: 'highlight-orange', color: 'g3-color__highlight-orange' },
  { name: 'mint', color: 'g3-color__mint' },
];

const colorBlockWidth = '150px';

const systemColorBlockStyle = {
  width: colorBlockWidth,
  height: '50px',
};

const visColorBlockStyle = {
  width: '50px',
  height: '50px',
};

const colorItemStyle = {
  width: colorBlockWidth,
};

const colorPairStyle = {
  display: 'flex',
  flexDirection: 'row',
  margin: '10px 20px',
};

const colorSessionStyle = {
  display: 'flex',
  borderBottom: 'solid gray 1px',
};

const visColorItemStyle = {
  width: '100px',
};

const visColorTextStyle = {
  paddingTop: '10px',
  paddingLeft: '3px',
};

storiesOf('General/Colors', module)
  .add('System Colors', () => (
    <div>
      <div>
        <h4>Core System Colors</h4>
        <div style={colorSessionStyle}>
          {coreSystemColors.map((group, index) => (
            <div key={index} style={colorPairStyle}>
              {group.map((entry) => (
                <div key={entry.name} style={colorItemStyle}>
                  <div style={systemColorBlockStyle} className={entry.color} />
                  <span className='body'>{entry.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4>Support System Colors</h4>
        <div style={colorSessionStyle}>
          {supportSystemColors.map((group, index) => (
            <div key={index} style={colorPairStyle}>
              {group.map((entry) => (
                <div key={entry.name} style={colorItemStyle}>
                  <div style={systemColorBlockStyle} className={entry.color} />
                  <span className='body'>{entry.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4>Extended Colors</h4>
        <div style={colorSessionStyle}>
          {extendSystemColors.map((group, index) => (
            <div key={index} style={colorPairStyle}>
              {group.map((entry) => (
                <div key={entry.name} style={colorItemStyle}>
                  <div style={systemColorBlockStyle} className={entry.color} />
                  <span className='body'>{entry.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ))
  .add('Data Visualization Colors', () => (
    <div style={colorSessionStyle}>
      {visColors.map((entry) => (
        <div key={entry.name} style={visColorItemStyle}>
          <div style={visColorBlockStyle} className={entry.color} />
          <div className='body' style={visColorTextStyle}>
            {entry.name}
          </div>
        </div>
      ))}
    </div>
  ));
