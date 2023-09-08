import { connect } from 'react-redux';
import { Formik, Field, Form, FieldArray } from "formik";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { createProject } from "../redux/dataRequest/asyncThunks";
import Pill from "../components/Pill";
import SimplePopup from "../components/SimplePopup";
import SimpleInputField from "../components/SimpleInputField";
import MultiValueField from "../components/MultiValueField";
import FilterSetOpenForm from "../GuppyDataExplorer/ExplorerFilterSetForms/FilterSetOpenForm";
import ViewFilterDetail from "../GuppyDataExplorer/ExplorerFilterDisplay/ViewFilterDetail";
import Button from "../gen3-ui-component/components/Button";
import IconComponent from '../components/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from 'rc-tooltip';
import dictIcons from '../img/icons/index';
import { useState } from "react";
import { fetchWithToken } from '../redux/explorer/filterSetsAPI';
import * as Yup from 'yup';
import './create.css'
import './DataRequests.css';

function mapPropsToState(state) {
  return {
    isCreatePending: state.dataRequest.isCreatePending
  };
}

let schema = Yup.object().shape({
  name: Yup.string().required('Project Name is a required field'),
  institution: Yup.string().required('Institution is a required field'),
  description: Yup.string().required('Description is a required field'),
  associated_users_emails: Yup.array()
    .of(Yup.string().email())
    .min(1, 'Must have associated users')
    .required('Must have associated users'),
  filter_set_ids: Yup.array()
    .of(Yup.number())
    .min(1, 'Must have Filter Sets')
    .required('Must have Filter Sets')
});

let adminSchema = Yup.object().shape({
  user_id: Yup.number().required('User Id is a required field'),
  name: Yup.string().required('Project Name is a required field'),
  institution: Yup.string().required('Institution is a required field'),
  description: Yup.string().required('Description is a required field'),
  associated_users_emails: Yup.array()
    .of(Yup.string().email())
    .min(1, 'Must have associated users')
    .required('Must have associated users'),
  filter_set_ids: Yup.array()
    .of(Yup.number())
    .min(1, 'Must have Filter Sets')
    .required('Must have Filter Sets')
});

function errorObjectForField(errors, touched, fieldName) {
  return touched[fieldName] && errors[fieldName] ?
    { isError: true, message: errors[fieldName] } : 
    { isError: false, message: '' }
}

function DataRequestCreate({ isCreatePending }) {
  let dispatch = useAppDispatch();
  const {
    getAccessButtonLink,
  } = useAppSelector((state) => state.explorer.config);
  let { 
      is_admin,
      authz: { '/services/amanuensis': serviceAccessMethods },
      email,
      additional_info: { institution },
      user_id: currentUserId,
  } = useAppSelector((state) => state.user);
  let serviceAccessMethod = Array.isArray(serviceAccessMethods) ?
    serviceAccessMethods[0]?.method :
    undefined;
  let isAdmin = is_admin || !!serviceAccessMethod;
  let savedFilterSets = useAppSelector((state) => state.explorer.savedFilterSets.data);

	let navigate = useNavigate();
	let goBack = () => {
		navigate(-1);
	}

  let [currentEmailInput, setCurrentEmailInput] = useState("");
  let [openAddFilter, setOpenAddFilter] = useState(false);
  let [viewFilter, setViewFilter] = useState(null);
  let [createRequestError, setRequestCreateError] = useState({ isError: false, message: '' });

  let initialValues = {
    name: "",
    description: "",
    institution: institution ?? "",
    associated_users_emails: email ? [email] : [],
    filter_set_ids: [],
  };

  return <div className={`data-requests ${isCreatePending ? 'data-requests--create-pending' : ''}`}>
    {isCreatePending && <div className="create-pending-overlay"></div>}
    <button className="back-button" onClick={goBack}>
      <IconComponent dictIcons={dictIcons} iconName='back' height='12px' />
    </button>	
    <Formik
      validationSchema={isAdmin ? adminSchema : schema}
      initialValues={isAdmin ? { user_id: currentUserId, ...initialValues } : initialValues}
      onSubmit={async (values) => {
        let createParams = isAdmin ? 
          { ...values, isAdmin, user_id: values.user_id } : 
          { ...values, isAdmin, user_id: currentUserId };
        let createRequest =
          /** @type {import('../redux/dataRequest/types').CreateRequest} */ 
          (dispatch(createProject(createParams)));

        createRequest.then((action) => {
          if (!action.payload.isError) {
            window.open(getAccessButtonLink);
            navigate('/requests');
            return;
          }

          let { isError, message } = action.payload;
          setRequestCreateError({ isError, message })
        })
      }}
    >
      {({ values, errors, touched, setFieldTouched }) => (
          <Form className="data-request__form">
            <header className="data-request__header">
              <h2>Create Data Request</h2>
            </header>
            <div className="data-request__fields">
              {isAdmin && 
                <Field name="user_id">
                  {({ field, meta }) => 
                    <SimpleInputField
                      className="data-request__value-container"
                      label="User Id"
                      input={<input type="text" {...field} />}
                      error={errorObjectForField(errors, touched, 'user_id')}
                    />}
                </Field>
              }
              <Field name="name">
                {({ field, meta }) => 
                  <SimpleInputField
                    className="data-request__value-container"
                    label="Project Name"
                    input={<input type="text" {...field} />}
                    error={errorObjectForField(errors, touched, 'name')}
                  />}
              </Field>
              <Field name="institution">
                {({ field, meta }) =>
                  <SimpleInputField
                    className="data-request__value-container"
                    label="Institution"
                    input={<input type="text" {...field} />}
                    error={errorObjectForField(errors, touched, 'institution')}
                  />}
              </Field>
              <Field name="description">
                {({ field, meta }) =>
                  <SimpleInputField
                    className="data-request__value-container"
                    label="Description" 
                    input={<textarea {...field} />}
                    error={errorObjectForField(errors, touched, 'description')}
                  />}
              </Field>
              <FieldArray name="associated_users_emails">
                  {({ remove, unshift }) => {
                    let addEmail = () => {
                      if (currentEmailInput === '') return;
                      unshift(currentEmailInput);
                      setCurrentEmailInput('');
                    };
                      return <MultiValueField
                          label="Assosciated Users"
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
                                <Button buttonType="secondary" label="Add Email" className='data-request__add-email' onClick={addEmail} />
                                <Tooltip
                                  placement='top'
                                  overlay='Email address must be backed by a Google account'
                                >
                                  <FontAwesomeIcon icon='circle-info' className='data-request__add-email-icon' />
                                </Tooltip>
                              </div>
                          </>)}
                    </MultiValueField>;
                  }}
              </FieldArray>
              <FieldArray name="filter_set_ids">
                  {({ remove, unshift }) => {
                    let addFilter = (filterSet) => {
                      if (!filterSet) return;
                      unshift(filterSet.id);
                      setOpenAddFilter(false);
                    };
                    return <MultiValueField
                        label="Filter Sets"
                        fieldId="filter_set_ids"
                        className="data-request__value-container"
                        error={errorObjectForField(errors, touched, 'filter_set_ids')}
                      >
                        {({ valueContainerProps, valueProps }) => (<>
                          <div className="data-request__multi-value-row data-request__multi-value-values-row" {...valueContainerProps}>
                            {values.filter_set_ids.map((filter_id, index) => {
                              let filter = savedFilterSets.find((filter) => filter.id === filter_id);
                              return <span key={index} {...valueProps}>
                                <Pill
                                  onClick={() => setViewFilter(filter)}
                                  onClose={() => { setFieldTouched('filter_set_ids', true, false);remove(index); }}
                                >
                                  {filter.name}
                                </Pill>
                              </span>;
                            })}
                          </div>
                          <div className="data-request__multi-value-row">
                            <Button buttonType="secondary" hasPopup="dialog" label="Add Filter" onClick={() => setOpenAddFilter(true)} />
                          </div>
                          {openAddFilter &&
                            <SimplePopup>
                              <FilterSetOpenForm
                                currentFilterSet={{ name: '', description: '', filter: {} }}
                                filterSets={savedFilterSets}
                                onAction={addFilter}
                                onClose={() => setOpenAddFilter(false)}
                              />
                            </SimplePopup>
                          }
                          {viewFilter &&
                            <SimplePopup >
                              <ViewFilterDetail
                                filterSet={viewFilter}    
                                onClose={() => setViewFilter(null)}                       
                              />
                            </SimplePopup>
                          }
                      </>)}
                    </MultiValueField>;
                  }}
              </FieldArray>
              <div className="data-request__link-container">
                <a target="_blank" rel="noopener noreferrer" href={getAccessButtonLink}>View and complete request form document</a>
              </div>
            </div>
            <Button submit={true} className="data-request__submit" label="Create" />
            {createRequestError.isError && <span className="data-request__request-error">{createRequestError.message}</span>}
          </Form>
      )}
    </Formik>
  </div>;
}

export default connect(mapPropsToState)(DataRequestCreate);