import React, { useState } from 'react';
import { Drawer, Tabs } from 'antd';
import { User } from './DiscoveryDetailsInterfaces';
import { DiscoveryConfig } from '../DiscoveryConfig';
import { DiscoveryResource } from '../Discovery';
import FieldGrouping from './Components/FieldGrouping/FieldGrouping';
import NonTabbedDiscoveryDetails from './Components/NonTabbedDiscoveryDetails/NonTabbedDiscoveryDetails';
import HeaderButtons from './Components/HeaderButtons/HeaderButtons';
import StudyHeader from './Components/StudyHeader';

interface Props {
  modalVisible: boolean;
  setModalVisible: (boolean) => void;
  // setPermalinkCopied: (boolean) => void;
  modalData: DiscoveryResource;
  config: DiscoveryConfig;
  // permalinkCopied: boolean;
  user: User;
  // userAuthMapping: any;
  systemPopupActivated: boolean;
}

const DiscoveryDetails = (props: Props) => {
  const [tabActiveKey, setTabActiveKey] = useState('0');

  return (
    <Drawer
      className='discovery-modal'
      // if system-level popup is visible, do not show details drawer
      open={props.modalVisible && !props.systemPopupActivated}
      width={'50vw'}
      closable={false}
      onClose={() => {
        props.setModalVisible(false);
        setTabActiveKey('0');
      }}
    >
      <HeaderButtons props={props} setTabActiveKey={setTabActiveKey} />
      {props.config.detailView?.tabs ? (
        // Here is the tabbed version of discovery details page
        <div className='discovery-modal-content'>
          <StudyHeader props={props} />
          <Tabs
            type={'card'}
            activeKey={tabActiveKey}
            onChange={(activeKey) => {
              setTabActiveKey(activeKey);
            }}
            items={props.config.detailView.tabs.map(
              ({ tabName, groups }, tabIndex) => ({
                label: <span className='discovery-modal__tablabel'>{tabName}</span>,
                key: `${tabIndex}`,
                children: (groups || []).map((group, i) => (
                  <div key={i}>
                    <FieldGrouping
                      user={props.user}
                      group={group}
                      discoveryConfig={props.config}
                      resource={props.modalData}
                    />
                  </div>
                )),
              }),
            )}
          />
        </div>
      ) : (
        <NonTabbedDiscoveryDetails props={props} />
      )}
    </Drawer>
  );
};

export default DiscoveryDetails;
