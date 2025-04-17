import { useState } from 'react';
import * as Yup from 'yup';
import Select from 'react-select';
import { Formik, Field, Form, FieldArray } from 'formik';
import { useAppDispatch } from '../redux/hooks';
import Button from '../gen3-ui-component/components/Button';
import IconComponent from '../components/Icon';
import SimpleInputField from '../components/SimpleInputField';
import MultiValueField from '../components/MultiValueField';
import Pill from '../components/Pill';
import dictIcons from '../img/icons';
import { overrideSelectTheme } from '../utils';
import {
  updateProjectApprovedUrl,
  updateProjectState,
  updateProjectUsers,
  updateUserDataAccess,
  deleteRequest,
} from '../redux/dataRequest/asyncThunks';
import '../GuppyDataExplorer/ExplorerFilterSetForms/ExplorerFilterSetForms.css';
import UserAccessTable from './UserAccessTable';
import DataRequestFilterSets from './DataRequestFilterSets';

const dataAccessSchema = Yup.object().shape({
  email: Yup.string().email().required('Must be a valid email address'),
});
const updateUrlSchema = Yup.object().shape({
  approved_url: Yup.string().url().required('Must be a valid URL'),
});
const addUsersSchema = Yup.object().shape({
  associated_users_emails: Yup.array()
    .of(Yup.string().email())
    .min(1, 'Must have associated users')
    .required('Must have associated users'),
});

function errorObjectForField(errors, touched, fieldName) {
  return touched[fieldName] && errors[fieldName]
    ? { isError: true, message: errors[fieldName] }
    : { isError: false, message: '' };
}

/** @typedef {import("../redux/dataRequest/types").DataRequestProject} DataRequestProject */
/** @typedef {import("../redux/types").RootState} RootState */

/**
 * @param {Object} props
 * @param {DataRequestProject} [props.project]
 * @param {RootState["dataRequest"]["projectStates"]} [props.projectStates]
 * @param {RootState["explorer"]["savedFilterSets"]} props.savedFilterSets
 * @param {function} [props.onAction]
 * @param {function} [props.onClose]
 */
/* eslint-disable react/prop-types */
export default function AdminProjectActions({
  project,
  projectStates,
  savedFilterSets,
  onAction,
  onClose,
}) {
  const dispatch = useAppDispatch();
  const [actionType, setActionType] = useState('');
  const [currentEmailInput, setCurrentEmailInput] = useState('');
  const [isActionPending, setActionPending] = useState(false);
  const [actionRequestError, setRequestactionError] = useState({
    isError: false,
    message: '',
  });
  const currentProjectState = projectStates[project.status] ?? {
    id: -1,
    code: '',
  };
  const projectStateOptions = Object.keys(projectStates).map((name) => ({
    label: name,
    value: projectStates[name].id,
  }));
  return (
    <div
      className={`data-request-admin__actions-container
            ${isActionPending ? 'data-request-admin__actions-container--action-pending' : ''}`}
    >
      {actionType && (
        <button
          type='button'
          className='back-button'
          onClick={() => setActionType('')}
        >
          <IconComponent dictIcons={dictIcons} iconName='back' height='12px' />
        </button>
      )}
      {(() => {
        switch (actionType) {
          case 'APPROVED_URL':
            return (
              <Formik
                validationSchema={updateUrlSchema}
                initialValues={{
                  approved_url: '',
                }}
                onSubmit={({ approved_url }) => {
                  setActionPending(true);
                  const actionRequest =
                    /** @type {import("../redux/dataRequest/types").Request} */
                    (
                      dispatch(
                        updateProjectApprovedUrl({
                          approved_url,
                          project_id: project.id,
                        }),
                      )
                    );

                  actionRequest.then((action) => {
                    setActionPending(false);
                    if (!action.payload.isError) {
                      onAction?.(actionType);
                      setActionType('ACTION_SUCCESS');
                      return;
                    }

                    const { isError, message } = action.payload;
                    setRequestactionError({ isError, message });
                  });
                }}
              >
                {({ errors, touched }) => (
                  <Form className='data-request__form'>
                    <div className='data-request__header'>
                      <h2>Update Approved Data URL</h2>
                    </div>
                    <div className='data-request__fields'>
                      <Field name='approved_url'>
                        {({ field }) => (
                          <SimpleInputField
                            className='data-request__value-container'
                            label='Approved Data URL'
                            input={<input type='text' {...field} />}
                            error={errorObjectForField(
                              errors,
                              touched,
                              'approved_url',
                            )}
                          />
                        )}
                      </Field>
                    </div>
                    <Button
                      submit
                      className='data-request__submit'
                      label='Submit'
                    />
                    {actionRequestError.isError && (
                      <span className='data-request__request-error'>
                        {actionRequestError.message}
                      </span>
                    )}
                  </Form>
                )}
              </Formik>
            );
          case 'PROJECT_STATE':
            return (
              <Formik
                initialValues={{
                  state_id: currentProjectState.id,
                }}
                onSubmit={({ state_id }) => {
                  setActionPending(true);
                  const updateRequest =
                    /** @type {import("../redux/dataRequest/types").Request} */
                    (
                      dispatch(
                        updateProjectState({
                          state_id,
                          project_id: project.id,
                        }),
                      )
                    );

                  updateRequest.then((action) => {
                    setActionPending(false);
                    if (!action.payload.isError) {
                      onAction?.(actionType);
                      setActionType('ACTION_SUCCESS');
                      return;
                    }

                    const { isError, message } = action.payload;
                    setRequestactionError({ isError, message });
                  });
                }}
              >
                {({ values, errors, touched }) => (
                  <Form className='data-request__form'>
                    <div className='data-request__header'>
                      <h2>Change Project State</h2>
                    </div>
                    <div className='data-request__fields'>
                      <Field name='state'>
                        {({ field }) => (
                          <SimpleInputField
                            className='data-request__value-container'
                            label='Project State'
                            input={
                              <Select
                                value={field.value}
                                options={projectStateOptions}
                                onChange={({ value }) => {
                                  values.state_id = value;
                                }}
                                autoFocus
                                isClearable={false}
                                isSearchable={false}
                                theme={overrideSelectTheme}
                              />
                            }
                            error={errorObjectForField(
                              errors,
                              touched,
                              'state',
                            )}
                          />
                        )}
                      </Field>
                    </div>
                    <Button
                      submit
                      className='data-request__submit'
                      label='Submit'
                    />
                    {actionRequestError.isError && (
                      <span className='data-request__request-error'>
                        {actionRequestError.message}
                      </span>
                    )}
                  </Form>
                )}
              </Formik>
            );
          case 'USER_ACCESS':
            return (
              <UserAccessTable
                projectId={project.id}
                setActionType={setActionType}
              />
            );
          case 'PROJECT_USERS_ADD':
            return (
              <Formik
                validationSchema={addUsersSchema}
                initialValues={{
                  associated_users_emails: [],
                }}
                onSubmit={(values) => {
                  setActionPending(true);
                  const users = values.associated_users_emails.map((email) => ({
                    project_id: project.id,
                    email,
                  }));
                  const updateRequest =
                    /** @type {import("../redux/dataRequest/types").Request} */
                    (dispatch(updateProjectUsers({ users })));

                  updateRequest.then((action) => {
                    setActionPending(false);
                    if (!action.payload.isError) {
                      onAction?.(actionType);
                      setActionType('USER_ACCESS');
                      return;
                    }

                    const { isError, message } = action.payload;
                    setRequestactionError({ isError, message });
                  });
                }}
              >
                {({ values, errors, touched, setFieldTouched }) => (
                  <Form className='data-request__form'>
                    <div className='data-request__header'>
                      <h2>Add Users to Project</h2>
                    </div>
                    <div className='data-request__fields'>
                      <FieldArray name='associated_users_emails'>
                        {({ remove, unshift }) => {
                          const addEmail = () => {
                            if (currentEmailInput === '') return;
                            unshift(currentEmailInput);
                            setCurrentEmailInput('');
                          };
                          return (
                            <MultiValueField
                              label='User Emails'
                              fieldId='associated_users_emails'
                              className='data-request__value-container'
                              error={errorObjectForField(
                                errors,
                                touched,
                                'associated_users_emails',
                              )}
                            >
                              {({
                                valueContainerProps,
                                valueProps,
                                inputProps,
                              }) => (
                                <>
                                  <div
                                    className='data-request__multi-value-row data-request__multi-value-values-row'
                                    {...valueContainerProps}
                                  >
                                    {values.associated_users_emails.map(
                                      (email, index) => (
                                        <span key={index} {...valueProps}>
                                          <Pill
                                            onClose={() => {
                                              setFieldTouched(
                                                'associated_users_emails',
                                                true,
                                                false,
                                              );
                                              remove(index);
                                            }}
                                          >
                                            {email}
                                          </Pill>
                                        </span>
                                      ),
                                    )}
                                  </div>
                                  <div className='data-request__multi-value-row'>
                                    <input
                                      {...inputProps}
                                      type='email'
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') addEmail();
                                      }}
                                      onChange={(e) =>
                                        setCurrentEmailInput(e.target.value)
                                      }
                                      value={currentEmailInput}
                                    />
                                  </div>
                                  <div className='data-request__multi-value-row'>
                                    <Button
                                      buttonType='secondary'
                                      label='Add Email'
                                      onClick={addEmail}
                                    />
                                  </div>
                                </>
                              )}
                            </MultiValueField>
                          );
                        }}
                      </FieldArray>
                    </div>
                    <Button
                      submit
                      className='data-request__submit'
                      label='Submit'
                    />
                    {actionRequestError.isError && (
                      <span className='data-request__request-error'>
                        {actionRequestError.message}
                      </span>
                    )}
                  </Form>
                )}
              </Formik>
            );
          case 'PROJECT_DATA_ACCESS':
            return (
              <Formik
                validationSchema={dataAccessSchema}
                initialValues={{
                  email: '',
                }}
                onSubmit={({ email }) => {
                  setActionPending(true);
                  const actionRequest =
                    /** @type {import("../redux/dataRequest/types").Request} */
                    (
                      dispatch(
                        updateUserDataAccess({
                          email,
                          project_id: project.id,
                          role: 'DATA_ACCESS',
                        }),
                      )
                    );

                  actionRequest.then((action) => {
                    setActionPending(false);
                    if (!action.payload.isError) {
                      onAction?.(actionType);
                      setActionType('ACTION_SUCCESS');
                      return;
                    }

                    const { isError, message } = action.payload;
                    setRequestactionError({ isError, message });
                  });
                }}
              >
                {({ errors, touched }) => (
                  <Form className='data-request__form'>
                    <div className='data-request__header'>
                      <h2>Grant User Data Access</h2>
                    </div>
                    <div className='data-request__fields'>
                      <Field name='email'>
                        {({ field }) => (
                          <SimpleInputField
                            className='data-request__value-container'
                            label='User Email'
                            input={<input type='email' {...field} />}
                            error={errorObjectForField(
                              errors,
                              touched,
                              'email',
                            )}
                          />
                        )}
                      </Field>
                    </div>
                    <Button
                      submit
                      className='data-request__submit'
                      label='Submit'
                    />
                    {actionRequestError.isError && (
                      <span className='data-request__request-error'>
                        {actionRequestError.message}
                      </span>
                    )}
                  </Form>
                )}
              </Formik>
            );
          case 'ADD_FILTERSET_TO_REQUEST': {
            return (
              <DataRequestFilterSets
                projectId={project.id}
                savedFilterSets={savedFilterSets}
                onAction={onAction}
              />
          );
          }
          case 'ACTION_SUCCESS':
            return (
              <div className='data-request-admin__action-success'>
                <span>Success!</span>
              </div>
            );
          case 'DELETE_REQUEST':
            return (
              <div className='data-request__form'>
                <div className='data-request__header'>
                  <h2>Are you sure to delete the request?</h2>
                </div>
                <div>
                  <Button
                    label='Yes'
                    buttonType='secondary'
                    onClick={() => {
                      setActionPending(true);
                      dispatch(deleteRequest({ project_id: project.id })).then(
                        (action) => {
                          setActionPending(false);
                          if (!action.payload.isError) {
                            onAction?.(actionType);
                            onClose?.();
                            return;
                          }

                          const { isError, message } = action.payload;
                          setRequestactionError({ isError, message });
                        },
                      );
                    }}
                  />
                  <Button
                    label='No'
                    buttonType='secondary'
                    onClick={() => {
                      setActionType('');
                      setRequestactionError({ isError: false, message: '' });
                    }}
                  />
                </div>
                {actionRequestError.isError && (
                  <span className='data-request__request-error'>
                    {actionRequestError.message}
                  </span>
                )}
              </div>
            );
          default:
            return (
              <div className='data-request-admin__action-list-container'>
                <ul className='data-request-admin__action-list'>
                  <li>
                    <Button
                      label='Update Approved URL'
                      onClick={() => setActionType('APPROVED_URL')}
                      buttonType='secondary'
                    />
                  </li>
                  <li>
                    <Button
                      label='Update State'
                      onClick={() => setActionType('PROJECT_STATE')}
                      buttonType='secondary'
                    />
                  </li>
                  <li>
                    <Button
                      label='User Access'
                      onClick={() => setActionType('USER_ACCESS')}
                      buttonType='secondary'
                    />
                  </li>
                  {/* <li> */}
                  {/*   <Button */}
                  {/*     label='Add Users' */}
                  {/*     onClick={() => setActionType('PROJECT_USERS_ADD')} */}
                  {/*     buttonType='secondary' */}
                  {/*   /> */}
                  {/* </li> */}
                  {/* <li> */}
                  {/*   <Button */}
                  {/*     label='Update User Data Access' */}
                  {/*     onClick={() => setActionType('PROJECT_DATA_ACCESS')} */}
                  {/*     buttonType='secondary' */}
                  {/*   /> */}
                  {/* </li> */}
                  <li>
                    <Button
                      label='Add Filter Set to Request'
                      onClick={() => setActionType('ADD_FILTERSET_TO_REQUEST')}
                      buttonType='secondary'
                    />
                  </li>
                  <li>
                    <Button
                      label='Delete Request'
                      onClick={() => setActionType('DELETE_REQUEST')}
                      buttonType='secondary'
                    />
                  </li>
                </ul>
              </div>
            );
        }
      })()}
    </div>
  );
}
