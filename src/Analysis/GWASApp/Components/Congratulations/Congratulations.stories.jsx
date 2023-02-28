import React from 'react';
import '../../GWASV2.css';
import Congratulations from './Congratulations';

export default {
  title: 'Tests3/GWASV2/Congratulations',
  component: Congratulations,
};

const MockTemplate = () => {
  return (
    <div className='GWASV2' style={{ margin: '40px auto', width: '800px' }}>
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
