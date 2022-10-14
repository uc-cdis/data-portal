import React from "react";
import PropTypes from "prop-types";
import { useQuery, queryConfig } from "react-query";
import { Table, Spin } from "antd";
import { fetchCohortDefinitions } from "../../Shared/wizardEndpoints/cohortMiddlewareApi";
import { useFetch, useFilter } from "../../Shared/formHooks";

const CohortDefinitions = ({
  sourceId,
  selectedCohort = undefined,
  handleCohortSelect,
  searchTerm,
}) => {
  const cohorts = useQuery(
    ["cohortdefinitions", sourceId],
    () => fetchCohortDefinitions(sourceId),
    queryConfig
  );
  const fetchedCohorts = useFetch(cohorts, "cohort_definitions_and_stats");
  const displayedCohorts = useFilter(fetchedCohorts, searchTerm, "cohort_name");

  const cohortSelection = (
    handler,
    inputSelectedCohort,
    inputOtherCohortSelected
  ) => ({
    type: "radio",
    columnTitle: "Select",
    selectedRowKeys: inputSelectedCohort
      ? [inputSelectedCohort.cohort_definition_id]
      : [],
    onChange: (_, selectedRows) => {
      handler(selectedRows[0]);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.size === 0 || record.cohort_name === inputOtherCohortSelected,
    }),
  });
  const cohortTableConfig = [
    {
      title: "Cohort Name",
      dataIndex: "cohort_name",
      key: "cohort_name",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
  ];

  return cohorts?.status === "success" ? (
    <Table
      className="GWASUI-table1"
      rowKey="cohort_definition_id"
      size="middle"
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100", "500"],
      }}
      rowSelection={cohortSelection(handleCohortSelect, selectedCohort)}
      columns={cohortTableConfig}
      dataSource={displayedCohorts}
    />
  ) : (
    <React.Fragment>
      <div className="GWASUI-spinnerContainer GWASUI-emptyTable">
        <Spin />
      </div>
    </React.Fragment>
  );
};

CohortDefinitions.propTypes = {
  sourceId: PropTypes.number.isRequired,
  selectedCohort: PropTypes.object,
  handleCohortSelect: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

CohortDefinitions.defaultProps = {
  selectedCohort: undefined,
};

export default CohortDefinitions;
