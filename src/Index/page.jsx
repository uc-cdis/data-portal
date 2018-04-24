import React from 'react';
import Introduction from '../components/Introduction'
import IndexButtonBar from '../components/IndexButtonBar';
import dictIcons from "../img/icons";
import { indexDetails, hostname } from "../localconf";
import styled from "styled-components";
import getProjectsList from './relayer';
import { ReduxIndexBarChart } from './reduxer';

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
      <div style={{width: "1220px"}}>
        <IndexTop>
          <Introduction data={indexDetails.introduction} dictIcons={dictIcons}/>
          <ReduxIndexBarChart/>
        </IndexTop>
        <IndexButtonBar dictIcons={dictIcons} buttons={indexDetails.buttons} hostname={hostname}/>
      </div>
    );
  }
}

const IndexPage = IndexPageComponent;

export default IndexPage;
