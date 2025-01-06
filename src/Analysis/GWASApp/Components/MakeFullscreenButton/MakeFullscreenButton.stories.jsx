import React, { useState } from 'react';
import MakeFullscreenButton from './MakeFullscreenButton';
import FullScreenClassNames from './FullscreenClassNames';

export default {
  title: 'Tests3/GWASApp/MakeFullScreenButton',
  component: MakeFullscreenButton,
};

const Template = ({}) => {
  const totalCombinationsRGB = 16777215;
  return (
    <>
    <div>
    {FullScreenClassNames.map((classNameString, iterator) => (
      <>
      {iterator===0 &&
        <h3 className={classNameString.replace('.','')}>
          Classes to be Hidden and Shown to Make Full Screen:
        </h3>
      }
      {/* Create a div for each class with a random background color */}
      <div className={classNameString.replace('.','')}
        style={{"background":"#"+Math.floor(Math.random()*totalCombinationsRGB).toString(16)}}>
        {classNameString}
      </div>
      </>
    ))}
    <br />
    </div>
    <MakeFullscreenButton />
    </>
  );
};

export const SuccessState = Template.bind({});
