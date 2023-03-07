import React, { useContext } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SharedContext from '../../Utils/SharedContext';
import './ReturnHomeButton.css';

const ReturnHomeButton = () => {
  const { setCurrentView } = useContext(SharedContext);
  return (
    <Button
      type='text'
      icon={<ArrowLeftOutlined />}
      onClick={() => setCurrentView('home')}
    >
      Return Home Button
    </Button>
  );
};
export default ReturnHomeButton;
