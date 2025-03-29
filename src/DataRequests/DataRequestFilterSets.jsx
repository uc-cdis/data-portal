import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Formik, Field, Form } from 'formik';
import Button from '../gen3-ui-component/components/Button';
import SimpleInputField from '../components/SimpleInputField';
import ExplorerFilterDisplay from '../GuppyDataExplorer/ExplorerFilterDisplay';
import { overrideSelectTheme } from '../utils';
import '../GuppyDataExplorer/ExplorerFilterSetForms/ExplorerFilterSetForms.css';
import { addFiltersetToRequest, getProjectFilterSets } from '../redux/dataRequest/asyncThunks';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getFilterState } from '../GuppyComponents/Utils/queries';


export default function DataRequestFilterSets({ projectId, savedFilterSets, onAction}) {
    const dispatch = useAppDispatch();
    const [selected, setSelected] = useState({label: '', value: null,});
    const [changeFilterSetRequestError, setChangeFilterSetRequestError] = useState({isError: false, message: ''});
    const [fetchProjectFilterSetRequestError, setFetchProjectFilterSetRequestError] = useState({isError: false, message: ''});
    const options = (savedFilterSets?.data ?? []).map(
        (filterSet) => ({
            label: filterSet.name,
            value: filterSet,
        })
    );
    
    const {
        isError,
        projectFilterSets,
        lastProjectFilterSetRefresh,
    } = useAppSelector((state) => state.dataRequest);
    // First useEffect: only fetch the filter sets
    useEffect(() => {
        const actionRequest =
        /** @type {import("../redux/dataRequest/types").Request} */
        (
            dispatch(getProjectFilterSets(projectId))
        );
        actionRequest.then((action) => {
            if (action.payload.isError) {
                setFetchProjectFilterSetRequestError({
                    isError: true,
                    message: 'Failed to fetch filter sets',
                });
            }
            else {
                // Successfully fetched filter sets
                setFetchProjectFilterSetRequestError({
                    isError: false,
                    message: '',
                });
            }
        });
    }, [lastProjectFilterSetRefresh, projectId, dispatch]);
    
    return (
        <div>
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
                    else {
                        setChangeFilterSetRequestError({
                            isError: true,
                            message: 'Failed to add filter set to request',
                        });
                    }
                    });
                }}>
                {({ values }) => (
                    <Form className='data-request__form'>
                        <div className='data-request__header'>
                            <h2>Add Filter Set to Request</h2>
                        </div>
                        <div className='data-request__fields'>
                            <Field name='filtersetId'>
                                {() => (
                                    <div className='explorer-filter-set-form'>
                                            <SimpleInputField
                                                label='Filter Set'
                                                hideLabel={true}
                                                input={
                                                    <Select
                                                    inputId='open-filter-set-name'
                                                    options={options}
                                                    value={selected.value ? selected : null}
                                                    isClearable={false}
                                                    theme={overrideSelectTheme}
                                                    placeholder='Select a filter set...'
                                                    onChange={(e) => {
                                                    values.filtersetId = e.value.id;
                                                    setChangeFilterSetRequestError({
                                                        isError: false,
                                                        message: '',
                                                    });
                                                    setSelected(e);
                                                    }}
                                                    />
                                                }
                                            />
                                            {selected.value && (
                                            <SimpleInputField
                                                label='Description'
                                                hideLabel={true}
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
                                            )}
                                        
                                        {selected.value && (
                                        <ExplorerFilterDisplay
                                            filter={selected.value?.filter} title="Selected Filter Set"
                                        />
                                        )}
                                    </div>
                                )}
                                
                            </Field>
                            
                        </div>
                        {selected.value && (
                            <Button
                                submit
                                className='data-request__submit'
                                label='Change Project Filter Set'
                            />
                        )}
                        {(changeFilterSetRequestError.isError || isError)&& (
                        <span className='data-request__request-error'>
                            Unable to change filter's for this project request.
                        </span>
                        )}
                    </Form>
                )} 
            </Formik>
            <div>
                {fetchProjectFilterSetRequestError.isError ? (
                    <div className='data-request__request-error'>
                        Unable to get the Current Project filter sets
                    </div>
                ) : (
                    <div className='data-request__form'>
                        <div className='data-request__header'>
                            <h3>Current Filters:</h3>
                        </div>
                        <div className='data-request__fields'>
                            {projectFilterSets.some((filterSet) => filterSet.filter_object) && (
                                <div className="explorer-filter-set-form">
                                    <h4>Explorer:</h4>
                                    {projectFilterSets.map((filterSet) => (
                                        filterSet.filter_object ? (
                                            <ExplorerFilterDisplay filter={filterSet.filter_object} title={filterSet.name} manual={false} />
                                        ) : null
                                    ))}
                                </div>
                            )}

                            {projectFilterSets.some((filterSet) => filterSet.graphql_object && !filterSet.filter_source_internal_id) && (
                                <div className="explorer-filter-set-form">
                                    <h4>Manual:</h4>
                                    {projectFilterSets.map((filterSet) => (
                                        (filterSet.graphql_object &&
                                        typeof filterSet.graphql_object === 'object' &&
                                        Object.keys(filterSet.graphql_object).length > 0 &&
                                        !filterSet.filter_source_internal_id) ? (
                                            <ExplorerFilterDisplay filter={getFilterState(filterSet.graphql_object)} title={filterSet.name} manual={true} />
                                        ) : null
                                    ))}
                                </div>
                            )}
                            {projectFilterSets.some((filterSet) => filterSet.ids_list && (!filterSet.graphql_object || (typeof filterSet.graphql_object === 'object' && Object.keys(filterSet.graphql_object).length === 0)) && !filterSet.filter_source_internal_id) && (
                                <div className="explorer-filter-set-form">
                                    <h4>Subject Submitter Ids Only Filters:</h4>
                                    {projectFilterSets.map((filterSet) => (
                                        (filterSet.ids_list && (!filterSet.graphql_object || (typeof filterSet.graphql_object === 'object' && Object.keys(filterSet.graphql_object).length === 0)) && !filterSet.filter_source_internal_id) ? (
                                            <ExplorerFilterDisplay 
                                                filter={getFilterState({
                                                                        "AND": [
                                                                            {
                                                                                "IN": {
                                                                                    "subject_submitter_id": filterSet.ids_list
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                        )} 
                                                title={filterSet.name} 
                                                manual={true} 
                                            />
                                            ) : null
                                    ))}
                                </div>
                            )}
                            {projectFilterSets.length === 0 && (
                                <div className="explorer-filter-set-form">
                                    No filter sets found for this request.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}