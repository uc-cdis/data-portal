import React from 'react';
import styled from 'styled-components';
import Introduction from '../components/Introduction';
import { ReduxIndexButtonBar, ReduxIndexBarChart } from './reduxer';
import dictIcons from '../img/icons';
import { indexDetails } from '../localconf';
import getProjectsList from './relayer';

const IndexTop = styled.div`
  width: 100%;
  display: inline-flex;
`;

class IndexPageComponent extends React.Component {
  constructor(props) {
    super(props);
    getProjectsList();
  }

  render() {
    return (
      <div style={{ width: '1220px' }}>
        <IndexTop>
          <Introduction data={indexDetails.introduction} dictIcons={dictIcons} />
          <ReduxIndexBarChart />
        </IndexTop>
        <ReduxIndexButtonBar />
      </div>
    );
  }
}

const IndexPage = IndexPageComponent;

export default IndexPage;
