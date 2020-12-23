import React from 'react';
import { storiesOf } from '@storybook/react';
import './color-story.css';

const coreSystemColors = [
  [
    { name: 'base-blue', color: 'base-blue' },
    { name: 'base-blue-light', color: 'base-blue-light' },
  ],
  [
    { name: 'highlight-orange', color: 'highlight-orange' },
    { name: 'highlight-orange-light', color: 'highlight-orange-light' },
  ],
  [
    { name: 'bg-coal', color: 'bg-coal' },
    { name: 'bg-cloud', color: 'bg-cloud' },
  ],
];

const supportSystemColors = [
  [
    { name: 'gray', color: 'gray' },
    { name: 'lightgray', color: 'lightgray' },
  ],
  [
    { name: 'smoke', color: 'smoke' },
    { name: 'silver', color: 'silver' },
  ],
];

const extendSystemColors = [
  [
    { name: 'black', color: 'black' },
    { name: 'white', color: 'white' },
  ],
];

const visColors = [
  { name: 'base-blue', color: 'base-blue' },
  { name: 'lime', color: 'lime' },
  { name: 'iris', color: 'iris' },
  { name: 'rose', color: 'rose' },
  { name: 'bee', color: 'bee' },
  { name: 'base-blue-light', color: 'base-blue-light' },
  { name: 'pink', color: 'pink' },
  { name: 'highlight-orange', color: 'highlight-orange' },
  { name: 'mint', color: 'mint' },
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
        <h4>
Core System Colors
        </h4>
        <div style={colorSessionStyle}>
          {
            coreSystemColors.map((group, index) => (
              <div key={index} style={colorPairStyle}>
                {
                  group.map(entry => (
                    <div key={entry.name} style={colorItemStyle}>
                      <div style={systemColorBlockStyle} className={`g3-color__${entry.color}`} />
                      <span className='body'>
                        {entry.name}
                      </span>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
      <div>
        <h4>
Support System Colors
        </h4>
        <div style={colorSessionStyle}>
          {
            supportSystemColors.map((group, index) => (
              <div key={index} style={colorPairStyle}>
                {
                  group.map(entry => (
                    <div key={entry.name} style={colorItemStyle}>
                      <div style={systemColorBlockStyle} className={`g3-color__${entry.color}`} />
                      <span className='body'>
                        {entry.name}
                      </span>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
      <div>
        <h4>
Extended Colors
        </h4>
        <div style={colorSessionStyle}>
          {
            extendSystemColors.map((group, index) => (
              <div key={index} style={colorPairStyle}>
                {
                  group.map(entry => (
                    <div key={entry.name} style={colorItemStyle}>
                      <div style={systemColorBlockStyle} className={`g3-color__${entry.color}`} />
                      <span className='body'>
                        {entry.name}
                      </span>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  ))
  .add('Data Visualization Colors', () => (
    <div style={colorSessionStyle}>
      {
        visColors.map(entry => (
          <div key={entry.name} style={visColorItemStyle}>
            <div style={visColorBlockStyle} className={`g3-color__${entry.color}`} />
            <div className='body' style={visColorTextStyle}>
              {entry.name}
            </div>
          </div>
        ))
      }
    </div>
  ));
