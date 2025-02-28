import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import SimpleInputField from '../components/SimpleInputField';
import Button from '../gen3-ui-component/components/Button';
import Table from '../components/tables/base/Table';
import Spinner from '../gen3-ui-component/components/Spinner/Spinner';
import './DataRequests.css';


const tableHeader = [
    'Name',
    'Type',
    'Source',
];

export default function VerifyPersonOrEntityUsingCSL() {
  const [responseJson, setResponseJson] = useState(null);
  const [actionRequestError, setRequestActionError] = useState({isError: false, message: '',});
  const [isActionPending, setActionPending] = useState(false);
  
  function errorObjectForField(errors, touched, fieldName) {
    return touched[fieldName] && errors[fieldName]
      ? { isError: true, message: errors[fieldName] }
      : { isError: false, message: '' };
  }

  const handleSubmit = async (input) => {
    try {
      setActionPending(true);
      const response = await fetch(`/amanuensis/admin/run-csl-verification?name=${input}`);
      const data = await response.json();
      if (!data.isError) {
        if (data.total === 0) {
            setResponseJson([]);
        } else {
            const extracted = data.results.map(({ name, type, source }) => ([
                name,
                type,
                source,
            ]));
            setResponseJson(extracted);
        }
        
      } else {
        setRequestActionError({ isError: true, message: data.message });
      }
    } catch (error) {
      setRequestActionError({ isError: true, message: "Sorry something went wrong" });   
    }
    setActionPending(false);
  };


    return (
        <Formik
            initialValues={{ input: '' }}
            validate={(values) => {
                const errors = {};
                if (!values.input) {
                    errors.input = 'Required';
                }
                return errors;
            }}
            onSubmit={({ input }, { resetForm }) => {
                if (input) {
                    handleSubmit(input);
                    resetForm();
                }
            }}
        >
            {({ errors, touched }) => (
                <Form className='data-request__form'>
                    <div className='data-request__fields'>
                        <Field name='input'>
                            {({ field }) => (
                                <SimpleInputField
                                    className='data-request__value-container'
                                    label='Name'
                                    input={<input type='text' {...field} />}
                                    error={errorObjectForField(errors, touched, 'input')}
                                />
                            )}
                        </Field>
                    </div>
                    {isActionPending ? (
                        <Spinner />) : (
                            responseJson !== null && !actionRequestError.isError && (
                                <div>
                                    {responseJson.length === 0 ? (
                                        <p>No matches found</p>
                                    ) : (
                                        <Table
                                            header={tableHeader}
                                            data={responseJson}
                                        />
                                    )}
                                </div>
                            )
                        )
                    }
                    <Button
                        submit
                        className='data-request__submit'
                        label='Submit'
                        enabled={!isActionPending}
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
}