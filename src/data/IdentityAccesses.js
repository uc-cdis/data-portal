import React from 'react';
import { Box } from '../theme';
import Nav from './nav.js'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';


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

const IdentityComponent = ( {user} ) => {
    return (
        <Box>
            <Nav />
            <h3>Access Management</h3>
            <ul>
                {user.username &&
                <div>
                    Test access keys
                </div>
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
