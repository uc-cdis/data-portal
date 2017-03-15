import React from 'react';
import { Box } from '../theme';
import Nav from './nav.js'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';
import AceEditor from 'react-ace';


const ProjectLink = styled(Link)`
  cursor: pointer;
  li;
  background: ghostwhite;
  padding: 5px;
  border-radius: 5px;
  display: inline-block;
  margin-bottom: 1em;
  margin-right: 1em;
  color: #8a6d3b;
  &:hover,
  &:focus,
  &:active {
    border: 1px solid #8a6d3b;
    color: #8a6d3b;
  }
`;

const AccessKeyPair = styled.div`
  border-top: 1px dashed ${props => props.theme.mid_gray};
  padding-top: 1em;
  margin-top: 1em;
`;

const IdentityComponent = ( {user} ) => {
    return (
        <Box>
            <Nav />
            <h3>Access Management</h3>
            <ul>
                {user.user_name &&
                <AccessKeyPair>
                  <AceEditor width="100%" height="300px"  mode="json" theme="kuroir" readOnly={true} value={JSON.stringify(user.access_key_pair, null, '    ')} />
                </AccessKeyPair>
                }
            </ul>
        </Box>
    )

};

const mapStateToProps = (state) => {
    return {
        'user': state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {};
};


let User = connect(mapStateToProps, mapDispatchToProps)(IdentityComponent);
export default User;
