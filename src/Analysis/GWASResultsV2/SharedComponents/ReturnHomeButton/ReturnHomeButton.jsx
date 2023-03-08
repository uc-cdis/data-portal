import React, { useContext } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SharedContext from '../../Utils/SharedContext';
import VIEWS from '../../Utils/ViewsEnumeration';

const ReturnHomeButton = () => {
  const { setCurrentView } = useContext(SharedContext);
  return (
    <Button
      type='text'
      icon={<ArrowLeftOutlined />}
      onClick={() => setCurrentView(VIEWS.home)}
    >
      Return Home Button
    </Button>
  );
};
export default ReturnHomeButton;
