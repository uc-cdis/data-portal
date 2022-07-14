import React, { useEffect } from 'react';
import { useQueries } from 'react-query';
import { fetchConceptStatsByHare, queryConfig } from "./wizard-endpoints/cohort-middleware-api";
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import Spinner from '../../components/Spinner';

const CovariateStatsByHareCC = ({ selectedHare, caseCohortDefinitionId, controlCohortDefinitionId, selectedCovariates, selectedDichotomousCovariates, sourceId, handleHareSelect }) => {
    const results = useQueries([
        // .map((cov) => cov.concept_id), sourceId)
        { queryKey: ['conceptsstats', selectedCovariates, caseCohortDefinitionId], queryFn: () => fetchConceptStatsByHare(caseCohortDefinitionId, selectedCovariates, selectedDichotomousCovariates, sourceId), ...queryConfig },
        { queryKey: ['conceptsstats', selectedCovariates, controlCohortDefinitionId], queryFn: () => fetchConceptStatsByHare(controlCohortDefinitionId, selectedCovariates, selectedDichotomousCovariates, sourceId), ...queryConfig },
    ]);
    const statusCase = results[0].status;
    const statusControl = results[1].status;
    const dataCase = results[0].data;
    const dataControl = results[1].data;


  const getSelectedCaseAndControlBreakdownItems = (concept_value, allCaseHareBreakDownItems, allControlHareBreakDownItems) => {
    let selectedCasedHareBreakDownItem = null;
    let selectedControlHareBreakDownItem = null;
    for (const hareBreakDownItem of allCaseHareBreakDownItems) {
      if (hareBreakDownItem.concept_value === concept_value) {
        selectedCasedHareBreakDownItem = hareBreakDownItem;
        break;
      }
    }
    for (const hareBreakDownItem of allControlHareBreakDownItems) {
      if (hareBreakDownItem.concept_value === concept_value) {
        selectedControlHareBreakDownItem = hareBreakDownItem;
        break;
      }
    }
    console.log(`getSelectedCaseAndControlBreakdownItems called w/ concept_value: ${concept_value}, allCaseHareBreakDownItems: ${allCaseHareBreakDownItems}`, `allControlHareBreakDownItems: ${allControlHareBreakDownItems}`);
    console.log(`result [selectedCasedHareBreakDownItem, selectedControlHareBreakDownItem]:`, [selectedCasedHareBreakDownItem, selectedControlHareBreakDownItem]);
    return [selectedCasedHareBreakDownItem, selectedControlHareBreakDownItem];
  };

    // const getHareAndDescription = (caseHareBreakDownItem, controlHareBreakDownItem) => `${caseHareBreakDownItem.concept_value_name} (sizes: ${caseHareBreakDownItem.persons_in_cohort_with_value}, ${controlHareBreakDownItem.persons_in_cohort_with_value})`;

    const getHareAndDescriptionUsingValueAndBreakDownItems = (concept_value, allCaseHareBreakDownItems, allControlHareBreakDownItems) => {
        const selectedBreakDownItems = getSelectedCaseAndControlBreakdownItems(concept_value,
          allCaseHareBreakDownItems, allControlHareBreakDownItems);
        // const selectedCasedHareBreakDownItem = selectedBreakDownItems[0];
        // const selectedControlHareBreakDownItem = selectedBreakDownItems[1];
        return `${caseHareBreakDownItem.concept_value_name} (sizes: ${selectedBreakDownItems[0].persons_in_cohort_with_value}, ${selectedBreakDownItems[1].persons_in_cohort_with_value})`
        // return getHareAndDescription(selectedCasedHareBreakDownItem, selectedControlHareBreakDownItem);
      };


  const setSelectedHareDescriptionFromSelectedHare = (hare_as_concept_value, allCaseHareBreakDownItems, allControlHareBreakDownItems) => {
    const selectedBreakDownItems = getSelectedCaseAndControlBreakdownItems(hare_as_concept_value,
      allCaseHareBreakDownItems, allControlHareBreakDownItems);
    const selectedCasedHareBreakDownItem = selectedBreakDownItems[0];
    const selectedControlHareBreakDownItem = selectedBreakDownItems[1];
    setSelectedHareDescription(getHareAndDescription(selectedCasedHareBreakDownItem, selectedControlHareBreakDownItem));
    setSelectedCaseSize(selectedCasedHareBreakDownItem.persons_in_cohort_with_value);
    setSelectedControlSize(selectedControlHareBreakDownItem.persons_in_cohort_with_value);
  };

    useEffect(() => {
        if (selectedHare && dataCase && dataControl && dataCase.concept_breakdown && dataControl.concept_breakdown) {
            setSelectedHareDescriptionFromSelectedHare(selectedHare, dataCase.concept_breakdown, dataControl.concept_breakdown);
        }
    }, [selectedHare, dataCase, dataControl]);

    if (statusCase === 'loading' || statusControl === 'loading') {
        return <Spinner />;
    }
    if (statusCase === 'error' || statusControl === 'error') {
        return <React.Fragment>Error</React.Fragment>;
    }
    if (dataControl && dataCase) {
        // special case - endpoint returns empty result:
        if (dataControl.concept_breakdown == null || dataCase.concept_breakdown == null) {
            return (
                <React.Fragment>Error: there are no subjects in this cohort that have data available on all the selected covariates
                    and phenotype. Please review your selections
                </React.Fragment>
            );
        }
        // normal scenario - there is breakdown data, so show in dropdown:
        return (
            <div className='GWASUI-flexRow'>
                <Dropdown buttonType='secondary' id='cohort-hare-selection-dropdown'>
                    <Dropdown.Button rightIcon='dropdown' buttonType='secondary'>
                        {selectedHareDescription}
                    </Dropdown.Button>
                    <Dropdown.Menu>
                        {
                            dataCase.concept_breakdown.map((datum) => (
                                <Dropdown.Item
                                    key={`${datum.concept_value}`}
                                    value={`${datum.concept_value}`}
                                    onClick={() => { setSelectedHare(datum.concept_value); setSelectedHareValueAsConceptId(datum.concept_value_as_concept_id); setSelectedHareValueName(datum.concept_value_name); }}
                                >
                                    {<div>{getHareAndDescriptionUsingValueAndBreakDownItems(datum.concept_value, dataCase.concept_breakdown, dataControl.concept_breakdown)}</div>}
                                </Dropdown.Item>
                            ))
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }
};

export default CovariateStatsByHareCC;
