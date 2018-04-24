import React from 'react';
import Introduction from '../components/Introduction'
import IndexButtonBar from '../components/IndexButtonBar';
import dictIcons from "../img/icons";
import { indexDetails, hostname } from "../localconf";
import styled from "styled-components";
import getReduxStore from '../reduxStore';
import getProjectsList from './RelayHelper';
import ReduxIndexBarChart from './ReduxIndexBarChart';

const IndexTop = styled.div`
  width: 100%;
  display: inline-flex;
`;
let dataInReduxDate = null;

//
// Set a flag once data is in Redux
//
getReduxStore().then(
  (store) => {
    const unsub = store.subscribe(
      () => {
        const state = store.getState();
        // console.log("Got some data?", state);
        if (state.homepage && state.homepage.projectsByName && state.homepage.summaryCounts) {
          dataInReduxDate = new Date();
          console.log("Have some data");
          unsub();
        }
        else if (state.homepage && state.homepage.hasOwnProperty('error')
          && state.homepage.error  !== null) {
          dataInReduxDate = null;
          console.log(state.homepage);
          console.log("Fail no data");
          unsub();
        }
      },
    );
  },
);

class IndexPageComponent extends React.Component {
  constructor(props) {
    super(props);
    getProjectsList();
  }

  render() {
    return (
      <div style={{width: "1220px"}}>
        <IndexTop>
          <Introduction data={indexDetails.introduction}/>
          <ReduxIndexBarChart/>
        </IndexTop>
        <IndexButtonBar dictIcons={dictIcons} buttons={indexDetails.buttons} hostname={hostname}/>
      </div>
    );
  }
}

const IndexPage = IndexPageComponent;

export default IndexPage;
