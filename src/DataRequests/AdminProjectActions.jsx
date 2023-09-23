import { useState } from 'react';
import { useAppDispatch  } from '../redux/hooks';
import Button from '../gen3-ui-component/components/Button';
import IconComponent from '../components/Icon';
import { Formik, Field, Form, FieldArray } from "formik";
import Select from 'react-select';
import SimpleInputField from '../components/SimpleInputField';
import MultiValueField from '../components/MultiValueField';
import ExplorerFilterDisplay from '../GuppyDataExplorer/ExplorerFilterDisplay';
import Pill from '../components/Pill';
import dictIcons from '../img/icons';
import { overrideSelectTheme } from '../utils';
import {
    updateProjectApprovedUrl,
    updateProjectState,
    updateProjectUsers,
    updateUserDataAccess,
    addFiltersetToRequest
} from '../redux/dataRequest/asyncThunks';
import * as Yup from 'yup';
import '../GuppyDataExplorer/ExplorerFilterSetForms/ExplorerFilterSetForms.css';


const data_access_schema = Yup.object().shape({
    email: Yup.string().email().required('Must be a valid email address')
});
const update_url_schema = Yup.object().shape({
    approved_url: Yup.string().url().required('Must be a valid URL')
});
const add_users_schema = Yup.object().shape({
    associated_users_emails: Yup.array()
        .of(Yup.string().email())
        .min(1, 'Must have associated users')
        .required('Must have associated users'),
});

function errorObjectForField(errors, touched, fieldName) {
    return touched[fieldName] && errors[fieldName] ?
      { isError: true, message: errors[fieldName] } : 
      { isError: false, message: '' }
  }

/** @typedef {import('../redux/dataRequest/types').DataRequestProject} DataRequestProject */
/** @typedef {import('../redux/types').RootState} RootState */

  
  /**
   * @param {Object} props
   * @param {DataRequestProject} [props.project]
   * @param {RootState['dataRequest']['projectStates']} [props.projectStates]
   * @param {RootState['explorer']['savedFilterSets']} props.savedFilterSets
   * @param {function} [props.onAction]
   */
export default function AdminProjectActions({ project, projectStates, savedFilterSets, onAction }) {
    let dispatch = useAppDispatch();
    let [actionType, setActionType] = useState('')
    let [currentEmailInput, setCurrentEmailInput] = useState("");
    let [isActionPending, setActionPending] = useState(false);
    let [actionRequestError, setRequestactionError] = useState({ isError: false, message: '' });
    let currentProjectState = projectStates[project.status] ?? { id: -1, code: '' };
    let projectStateOptions = Object.keys(projectStates).map((name) => ({ label: name, value: projectStates[name].id }));
    let [selected, setSelected] = useState({
        label: '',
        value: null,
    });

    return <div className={
            `data-request-admin__actions-container
            ${isActionPending ? 'data-request-admin__actions-container--action-pending' : ''}`
        }>
        {actionType !== '' && 
            <button className="back-button" onClick={() => setActionType('')}>
                <IconComponent dictIcons={dictIcons} iconName='back' height='12px' />
            </button>
        }
        {(() => {
            switch(actionType) {
                case 'APPROVED_URL':
                    return (
                    <Formik
                        validationSchema={update_url_schema}
                        initialValues={{
                            approved_url: ''
                        }}
                        onSubmit={({ approved_url }) => {
                            setActionPending(true);
                            let actionRequest =
                                /** @type {import('../redux/dataRequest/types').Request} */
                                (dispatch(updateProjectApprovedUrl({ approved_url, project_id: project.id })));
                    
                            actionRequest.then((action) => {
                                setActionPending(false);
                                if (!action.payload.isError) {
                                    onAction?.(actionType);
                                    setActionType('ACTION_SUCCESS')
                                    return;
                                }
                        
                                let { isError, message } = action.payload;
                                setRequestactionError({ isError, message });
                            })
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form className="data-request__form">
                                <div className="data-request__header">
                                    <h2>Update Approved Data URL</h2>
                                </div>
                                <div className="data-request__fields">
                                    <Field name="approved_url">
                                        {({ field, meta }) => 
                                        <SimpleInputField
                                            className="data-request__value-container"
                                            label="Approved Data URL"
                                            input={<input type="text" {...field} />}
                                            error={errorObjectForField(errors, touched, 'approved_url')}
                                        />}
                                    </Field>
                                </div>
                                <Button submit={true} className="data-request__submit" label="Submit" />
                                {actionRequestError.isError && <span className="data-request__request-error">{actionRequestError.message}</span>}
                            </Form>
                        )}
                    </Formik>);
                case 'PROJECT_STATE':
                    return (
                        <Formik
                            initialValues={{
                                state_id: currentProjectState.id
                            }}
                            onSubmit={({ state_id }) => {
                                setActionPending(true);
                                let updateRequest = 
                                    /** @type {import('../redux/dataRequest/types').Request} */ 
                                    (dispatch(updateProjectState({ state_id, project_id: project.id })));
                        
                                updateRequest.then((action) => {
                                    setActionPending(false);
                                    if (!action.payload.isError) {
                                        onAction?.(actionType);
                                        setActionType('ACTION_SUCCESS');
                                        return;
                                    }
                            
                                    let { isError, message } = action.payload;
                                    setRequestactionError({ isError, message });
                                })
                            }}
                        >
                            {({ values, errors, touched }) => (
                                <Form className="data-request__form">
                                    <div className="data-request__header">
                                        <h2>Change Project State</h2>
                                    </div>
                                    <div className="data-request__fields">
                                        <Field name="state">
                                            {({ field, meta }) => 
                                            <SimpleInputField
                                                className="data-request__value-container"
                                                label="Project State"
                                                input={
                                                    <Select
                                                        value={field.value}
                                                        options={projectStateOptions}
                                                        onChange={({ value }) => { values.state_id = value; }}
                                                        autoFocus
                                                        isClearable={false}
                                                        isSearchable={false}
                                                        theme={overrideSelectTheme}
                                                    />
                                                }
                                                error={errorObjectForField(errors, touched, 'state')}
                                            />}
                                        </Field>
                                    </div>
                                    <Button submit={true} className="data-request__submit" label="Submit" />
                                    {actionRequestError.isError && <span className="data-request__request-error">{actionRequestError.message}</span>}
                                </Form>
                            )}
                        </Formik>);
                case 'PROJECT_USERS_ADD':
                    return (
                        <Formik
                            validationSchema={add_users_schema}
                            initialValues={{
                                associated_users_emails: []
                            }}
                            onSubmit={(values) => {
                                setActionPending(true);
                                let users = values.associated_users_emails
                                    .map((email) => ({ project_id: project.id, email }));
                                let updateRequest = 
                                    /** @type {import('../redux/dataRequest/types').Request} */ 
                                    (dispatch(updateProjectUsers({ users })));
                        
                                updateRequest.then((action) => {
                                    setActionPending(false);
                                    if (!action.payload.isError) {
                                        onAction?.(actionType);
                                        setActionType('ACTION_SUCCESS');
                                        return;
                                    }
                            
                                    let { isError, message } = action.payload;
                                    setRequestactionError({ isError, message });
                                })
                            }}
                            >
                            {({ values, errors, touched, setFieldTouched }) => (
                                <Form className="data-request__form">
                                    <div className="data-request__header">
                                        <h2>Add Users to Project</h2>
                                    </div>
                                    <div className="data-request__fields">
                                        <FieldArray name="associated_users_emails">
                                            {({ remove, unshift }) => {
                                                let addEmail = () => {
                                                    if (currentEmailInput === '') return;
                                                    unshift(currentEmailInput);
                                                    setCurrentEmailInput('');
                                                };
                                                return <MultiValueField
                                                    label="User Emails"
                                                    fieldId="associated_users_emails"
                                                    className="data-request__value-container"
                                                    error={errorObjectForField(errors, touched, 'associated_users_emails')}
                                                    >
                                                    {({ valueContainerProps, valueProps, inputProps }) => (<>
                                                        <div className="data-request__multi-value-row data-request__multi-value-values-row" {...valueContainerProps}>
                                                            {values.associated_users_emails.map((email, index) => {
                                                            return <span key={index} {...valueProps}>
                                                                <Pill onClose={() => {
                                                                    setFieldTouched('associated_users_emails', true, false);
                                                                    remove(index);
                                                                }}>
                                                                {email}
                                                                </Pill>
                                                            </span>;
                                                            })}
                                                        </div>
                                                        <div className="data-request__multi-value-row">
                                                            <input
                                                                {...inputProps}
                                                                type="email"
                                                                onKeyDown={(e) => { if(e.key === 'Enter') addEmail(); }}
                                                                onChange={(e) => setCurrentEmailInput(e.target.value)} value={currentEmailInput}
                                                            />
                                                        </div>
                                                        <div className="data-request__multi-value-row">
                                                            <Button buttonType="secondary" label="Add Email" onClick={addEmail} />
                                                        </div>
                                                    </>)}
                                                </MultiValueField>;
                                            }}
                                        </FieldArray>
                                    </div>
                                    <Button submit={true} className="data-request__submit" label="Submit" />
                                    {actionRequestError.isError && <span className="data-request__request-error">{actionRequestError.message}</span>}
                                </Form>
                            )}
                            </Formik>);
                case 'PROJECT_DATA_ACCESS':
                    return (
                    <Formik
                        validationSchema={data_access_schema}
                        initialValues={{
                            email: ''
                        }}
                        onSubmit={({ email }) => {
                            setActionPending(true);
                            let actionRequest = 
                                /** @type {import('../redux/dataRequest/types').Request} */ 
                                (dispatch(updateUserDataAccess({ email, project_id: project.id })));
                    
                            actionRequest.then((action) => {
                                setActionPending(false);
                                if (!action.payload.isError) {
                                    onAction?.(actionType);
                                    setActionType('ACTION_SUCCESS');
                                    return;
                                }
                        
                                let { isError, message } = action.payload;
                                setRequestactionError({ isError, message });
                            })
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form className="data-request__form">
                                <div className="data-request__header">
                                    <h2>Grant User Data Access</h2>
                                </div>
                                <div className="data-request__fields">
                                    <Field name="email">
                                        {({ field, meta }) => 
                                        <SimpleInputField
                                            className="data-request__value-container"
                                            label="User Email"
                                            input={<input type="email" {...field} />}
                                            error={errorObjectForField(errors, touched, 'email')}
                                        />}
                                    </Field>
                                </div>
                                <Button submit={true} className="data-request__submit" label="Submit" />
                                {actionRequestError.isError && <span className="data-request__request-error">{actionRequestError.message}</span>}
                            </Form>
                        )}
                    </Formik>);
                case 'ADD_FILTERSET_TO_REQUEST':
                    let filterSets = savedFilterSets?.data ?? [];
                    let options = filterSets.map((filterSet) => ({
                        label: filterSet.name,
                        value: filterSet,
                    }));
                    return (
                    <Formik
                        initialValues={{
                            filtersetId: null
                        }}
                        onSubmit={({ filtersetId }) => {
                            setActionPending(true);
                            let actionRequest = 
                                /** @type {import('../redux/dataRequest/types').Request} */ 
                                (dispatch(addFiltersetToRequest({ filtersetId, project_id: project.id })));
                    
                            actionRequest.then((action) => {
                                setActionPending(false);
                                if (!action.payload.isError) {
                                    onAction?.(actionType);
                                    setActionType('ACTION_SUCCESS');
                                    return;
                                }
                        
                                let { isError, message } = action.payload;
                                setRequestactionError({ isError, message });
                            })
                        }}
                    >
                        {({ values, errors, touched }) => (
                            <Form className="data-request__form">
                                <div className="data-request__header">
                                    <h2>Add Filter Set to Request</h2>
                                </div>
                                <div className="data-request__fields">
                                    <Field name="filtersetId">
                                        {({ field, meta }) => 
                                        <>
                                            <div className='explorer-filter-set-form'>
                                                <div>
                                                    <SimpleInputField
                                                        label='Filter Set'
                                                        input={
                                                            <Select
                                                                inputId='open-filter-set-name'
                                                                options={options}
                                                                value={selected}
                                                                isClearable={false}
                                                                theme={overrideSelectTheme}
                                                                onChange={(e) => {
                                                                    values.filtersetId = e.value.id;
                                                                    setSelected(e);
                                                                }}
                                                            />
                                                        }
                                                    />
                                                    <SimpleInputField
                                                        className='simple-input-field__container--label-top'
                                                        label='Description'
                                                        input={
                                                            <textarea
                                                                className={'filter-set-description'}
                                                                id='open-filter-set-description'
                                                                disabled
                                                                placeholder='No description'
                                                                value={selected.value?.description}
                                                            />
                                                        }
                                                    />
                                                </div>
                                                <ExplorerFilterDisplay filter={selected.value?.filter} />
                                            </div>
                                        </>}
                                    </Field>
                                </div>
                                <Button submit={true} className="data-request__submit" label="Add" />
                                {actionRequestError.isError && <span className="data-request__request-error">{actionRequestError.message}</span>}
                            </Form>
                        )}
                    </Formik>);
                case 'ACTION_SUCCESS':
                    return <div className="data-request-admin__action-success">
                        <span>Success!</span>
                    </div>;
                default:
                    return <div className="data-request-admin__action-list-container">
                        <ul className="data-request-admin__action-list">
                            <li>
                                <Button
                                    label="Update Approved URL"
                                    onClick={() => setActionType('APPROVED_URL')}
                                    buttonType="secondary"
                                />
                            </li>
                            <li>
                                <Button
                                    label="Update State"
                                    onClick={() => setActionType('PROJECT_STATE')}
                                    buttonType="secondary"
                                />
                            </li>
                            <li>
                                <Button
                                    label="Add Users"
                                    onClick={() => setActionType('PROJECT_USERS_ADD')}
                                    buttonType="secondary"
                                />
                            </li>
                            <li>
                                <Button
                                    label="Update User Data Access"
                                    onClick={() => setActionType('PROJECT_DATA_ACCESS')}
                                    buttonType="secondary"
                                />
                            </li>
                            <li>
                                <Button
                                    label="Add Filter Set to Request"
                                    onClick={() => setActionType('ADD_FILTERSET_TO_REQUEST')}
                                    buttonType="secondary"
                                />
                            </li>
                        </ul>
                    </div>;
            }
        })()}
    </div>;
}