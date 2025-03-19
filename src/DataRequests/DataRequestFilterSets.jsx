import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Formik, Field, Form } from 'formik';
import Button from '../gen3-ui-component/components/Button';
import SimpleInputField from '../components/SimpleInputField';
import ExplorerFilterDisplay from '../GuppyDataExplorer/ExplorerFilterDisplay';
import { overrideSelectTheme } from '../utils';
import {
  getProjectFilterSets
} from '../redux/dataRequest/asyncThunks';
import '../GuppyDataExplorer/ExplorerFilterSetForms/ExplorerFilterSetForms.css';
import { addFiltersetToRequest } from '../redux/dataRequest/asyncThunks';
import { useAppDispatch, useAppSelector } from '../redux/hooks';



export default function DataRequestFilterSets({ projectId, savedFilterSets, onAction}) {
    const dispatch = useAppDispatch();
    const [selected, setSelected] = useState({label: '', value: null,});
    const [actionRequestError, setRequestactionError] = useState({isError: false, message: '',});
    const {
        isError,
        projectFilterSets,
        lastProjectFilterSetRefresh,
    } = useAppSelector((state) => state.dataRequest);
    // Fetch project filter sets when needed
    const filterSets = savedFilterSets?.data ?? [];
    const options = filterSets.map((filterSet) => ({
        label: filterSet.name,
        value: filterSet,
    }));
    
    useEffect(() => {
        dispatch(getProjectFilterSets(projectId))
    }, [lastProjectFilterSetRefresh]); 
    return (
        <Formik
        initialValues={{
            filtersetId: null,
        }}
        onSubmit={({ filtersetId }) => {
            const actionRequest =
            /** @type {import("../redux/dataRequest/types").Request} */
            (
                dispatch(
                    addFiltersetToRequest({
                        filtersetId,
                        projectId: projectId,
                    }),
                )
                
            );
            actionRequest.then((action) => {
            if (!action.payload.isError) {
                onAction?.('SUCCESSFUL_FILTER_SET_CHANGE');
            }

            const { isError, message } = action.payload;
            setRequestactionError({ isError, message });
            });
        }}
        >
        {({ values }) => (
            <Form className='data-request__form'>
                <div className='data-request__header'>
                    <h2>Add Filter Set to Request</h2>
                </div>
            <div className='data-request__fields'>
                <Field name='filtersetId'>
                    {() => (
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
                        
                        <ExplorerFilterDisplay
                        filter={selected.value?.filter} title="Selected Filter Set"
                        />
                        <h3>Current Filters:</h3>
                        {
                            isError ? (
                            <p>Error loading project filters.</p>
                            ) : (
                            projectFilterSets.length === 0 ? (
                                <div>No filter sets associated with this request</div>
                            ) : (
                            <div className="current-filter-sets">
                            {projectFilterSets.map((filterSet) => (
                                filterSet.filter_object ? (
                                <div key={filterSet.id}>
                                    <ExplorerFilterDisplay filter={filterSet.filter_object} title={filterSet.name} />
                                </div>
                                ) : (
                                <div style={{ marginBottom: '10px' }}>
                                    <header>{filterSet.name}</header>
                                    <pre>{JSON.stringify(filterSet.graphql_object, null)}</pre>
                                </div>
                                )
                            ))}
                            </div>
                            )
                        )}
                        </div>
                    )}
                </Field>
            </div>
            <Button
            submit
            className='data-request__submit'
            label='Add'
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