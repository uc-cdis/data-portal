import React, { useContext } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SharedContext from '../../../Utils/SharedContext';
import VIEWS from '../../../Utils/ViewsEnumeration';
import './ReturnHomeButton.css';

const ReturnHomeButton = () => {
  const { setCurrentView } = useContext(SharedContext);
  return (
    <Button
      type='text'
      className='return-home-button'
      icon={<ArrowLeftOutlined />}
      onClick={() => setCurrentView(VIEWS.home)}
    />
  );
};
export default ReturnHomeButton;
