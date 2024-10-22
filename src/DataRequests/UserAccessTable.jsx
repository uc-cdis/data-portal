import { useEffect, useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  deleteProjectUser,
  getProjectUsers,
  getUserRoles,
  updateUserDataAccess,
} from '../redux/dataRequest/asyncThunks';
import Spinner from '../components/Spinner';
import Table from '../components/tables/base/Table';
import Button from '../gen3-ui-component/components/Button';

const tableHeader = ['User ID', 'Role', 'Actions'];
const filterConfig = {
  'User ID': true,
  Role: false,
  Actions: false,
};
export default function UserAccessTable({ projectId, setActionType }) {
  const dispatch = useAppDispatch();

  const {
    projectUsers,
    isError,
    isProjectUsersPending,
    userRoles,
    isUserRolesPending,
  } = useAppSelector((state) => state.dataRequest);

  const [selectedRoles, setSelectedRoles] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      dispatch(getProjectUsers(projectId));
      dispatch(getUserRoles());
    }
  }, [projectId, dispatch]);

  // Initialize selectedRoles when projectUsers are loaded
  useEffect(() => {
    if (projectUsers && projectUsers.length > 0) {
      setSelectedRoles(
        projectUsers.reduce((acc, user) => {
          acc[user.email] = user.role;
          return acc;
        }, {}),
      );
    }
  }, [projectUsers]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [successMsg, errorMsg],
  );

  const submitUserRemoval = (email) => {
    dispatch(deleteProjectUser({ email, project_id: projectId })).then(() =>
      dispatch(getProjectUsers(projectId)),
    );
  };

  const submitRoleChange = (email) => {
    dispatch(
      updateUserDataAccess({
        email,
        project_id: projectId,
        role: selectedRoles[email],
      }),
    ).then((action) => {
      if (!action.payload.isError) {
        setSuccessMsg(`Role updated successfully for ${email}`);
        setErrorMsg('');
      } else {
        setErrorMsg(action.payload.message);
        setSuccessMsg('');
      }
      timeoutRef.current = setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 3000);
    });
  };

  const userRoleOptions = userRoles.map((role) => ({
    label: role.role,
    value: role.role,
  }));
  const selectCustomStyle = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      borderColor: '#ccc',
      boxShadow: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure the menu appears above the modal
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Ensure the portal has a high z-index
    }),
  };

  const handleRoleChange = (email, selectedOption) => {
    setSelectedRoles((prevSelectedRoles) => ({
      ...prevSelectedRoles,
      [email]: selectedOption.value,
    }));
  };
  // Memoize table data to update only when projectUsers or selectedRoles change
  const tableData = useMemo(
    () =>
      projectUsers.map((user) => [
        user.email,
        <Select
          key={`select-${user.email}`}
          options={userRoleOptions}
          value={{
            label: selectedRoles[user.email],
            value: selectedRoles[user.email],
          }}
          styles={selectCustomStyle}
          menuPortalTarget={document.body}
          onChange={(selectedOption) =>
            handleRoleChange(user.email, selectedOption)
          }
        />,
        <div className='data-requests__table-actions'>
          <Button
            label='Remove User'
            onClick={() => submitUserRemoval(user.email)}
          />
          <Button
            label='Change Permission'
            onClick={() => submitRoleChange(user.email)}
          />
        </div>,
      ]),
    [projectUsers, userRoleOptions, userRoleOptions],
  );

  return (
    <>
      {(isProjectUsersPending || isUserRolesPending) && <Spinner />}
      {isError && <p>Error loading project users.</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <Table
        header={tableHeader}
        data={tableData}
        filterConfig={filterConfig}
      />
      <Button
        label='Add User'
        onClick={() => setActionType('PROJECT_USERS_ADD')}
      />
    </>
  );
}

UserAccessTable.propTypes = {
  projectId: PropTypes.string.isRequired,
  setActionType: PropTypes.func.isRequired,
};
