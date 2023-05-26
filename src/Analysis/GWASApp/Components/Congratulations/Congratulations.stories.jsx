import React from 'react';
import Congratulations from './Congratulations';

export default {
  title: 'Tests3/GWASApp/Congratulations',
  component: Congratulations,
};

const MockTemplate = () => {
  return (
    <div className='GWASApp' style={{ margin: '40px auto', width: '800px' }}>
      <div className='configure-gwas'>
        <Congratulations
          dispatch={() => null}
          setShowSuccess={() => true}
          successText='Test Success Text'
          jobName='Test Job name'
        />
      </div>
    </div>
  );
};

export const MockedSuccess = MockTemplate.bind({});
