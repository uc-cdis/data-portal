import React, { useMemo, useState, useEffect } from 'react';
import { Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import downloadTSVFromJson from './downloadTSVFromJSON';

const TopLociTable = ({ data }) => {
  // Adds a variant key value pair with the desired formatting
  const tableData = useMemo(
    () =>
      data.map((obj) => ({
        ...obj,
        variant: `${obj?.chrom}:${obj?.pos.toLocaleString('en-US')} ${obj?.ref}/
    ${obj?.alt} (${obj?.rsids})`,
      })),
    [data]
  );

  const [filteredData, setFilteredData] = useState(data);
  const [lociTableState, setLociTableState] = useState({
    variantSearchTerm: '',
    nearestGenesSearchTerm: '',
    pvalSearchTerm: '',
    afSearchTerm: '',
    currentPage: 1,
  });

  useEffect(() => {
    setFilteredData(filterTableData(tableData, lociTableState));
  }, [lociTableState, tableData]);

  const handleSearchTermChange = (event, searchTermKey) => {
    if (searchTermKey === 'variant') {
      setLociTableState({
        ...lociTableState,
        currentPage: 1,
        variantSearchTerm: event.target.value,
      });
    }
    if (searchTermKey === 'nearest_genes') {
      setLociTableState({
        ...lociTableState,
        currentPage: 1,
        nearestGenesSearchTerm: event.target.value,
      });
    }
    if (searchTermKey === 'pval') {
      setLociTableState({
        ...lociTableState,
        currentPage: 1,
        pvalSearchTerm: event.target.value,
      });
    }
    if (searchTermKey === 'af') {
      setLociTableState({
        ...lociTableState,
        currentPage: 1,
        afSearchTerm: event.target.value,
      });
    }
    return null;
  };

  const filterBySearchTerm = (data, key, searchTerm) => {
    return data.filter((obj) =>
      obj[key]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };

  const filterTableData = (tableData, lociTableState) => {
    let filteredDataResult = tableData;
    if (lociTableState.variantSearchTerm.length > 0) {
      filteredDataResult = filterBySearchTerm(
        filteredDataResult,
        'variant',
        lociTableState.variantSearchTerm
      );
    }
    if (lociTableState.nearestGenesSearchTerm.length > 0) {
      filteredDataResult = filterBySearchTerm(
        filteredDataResult,
        'nearest_genes',
        lociTableState.nearestGenesSearchTerm
      );
    }
    if (lociTableState.afSearchTerm.length > 0) {
      filteredDataResult = filterBySearchTerm(
        filteredDataResult,
        'af',
        lociTableState.afSearchTerm
      );
    }
    if (lociTableState.pvalSearchTerm.length > 0) {
      filteredDataResult = filterBySearchTerm(
        filteredDataResult,
        'pval',
        lociTableState.pvalSearchTerm
      );
    }
    return filteredDataResult;
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination.current !== lociTableState.currentPage) {
      // User changes page selection, set page to current pagination selection
      return setLociTableState({
        ...lociTableState,
        currentPage: pagination.current,
      });
    }
    // When the user updates sorting set page to first page
    return setLociTableState({
      ...lociTableState,
      currentPage: 1,
    });
  };

  const columns = [
    {
      title: 'Variant',
      dataIndex: 'variant',
      key: 'variant',
      sorter: (a, b) => a.variant.localeCompare(b.variant),
      children: [
        {
          title: (
            <Input
              placeholder='Search by Variant'
              value={lociTableState.variantSearchTerm}
              onChange={(event) => handleSearchTermChange(event, 'variant')}
              suffix={<SearchOutlined />}
            />
          ),
          dataIndex: 'variant',
        },
      ],
    },
    {
      title: 'Nearest Gene(s)',
      dataIndex: 'nearest_genes',
      key: 'nearest_genes',
      sorter: (a, b) => a.nearest_genes.localeCompare(b.nearest_genes),
      children: [
        {
          title: (
            <Input
              placeholder='Search by Nearest gene(s)'
              suffix={<SearchOutlined />}
              value={lociTableState.nearestGenesSearchTerm}
              onChange={(event) =>
                handleSearchTermChange(event, 'nearest_genes')
              }
            />
          ),
          dataIndex: 'nearest_genes',
        },
      ],
    },
    {
      title: 'AF',
      dataIndex: 'af',
      key: 'af',
      sorter: (a, b) => a.af.toString().localeCompare(b.af.toString()),

      children: [
        {
          title: (
            <Input
              placeholder='Search by Af'
              suffix={<SearchOutlined />}
              value={lociTableState.afSearchTerm}
              onChange={(event) => handleSearchTermChange(event, 'af')}
            />
          ),
          dataIndex: 'af',
        },
      ],
    },
    {
      title: 'P-value',
      dataIndex: 'pval',
      key: 'pval',
      sorter: (a, b) => a.pval.localeCompare(b.pval),

      children: [
        {
          title: (
            <Input
              placeholder='Search by P-value'
              suffix={<SearchOutlined />}
              value={lociTableState.pvalSearchTerm}
              onChange={(event) => handleSearchTermChange(event, 'pval')}
            />
          ),
          dataIndex: 'pval',
        },
      ],
      sorter: (a, b) => a.pval.toString().localeCompare(b.pval.toString()),
    },
  ];

  return (
    <section className='top-loci'>
      <h2>Top Loci</h2>
      <div className='table-header'>
        <Button onClick={() => downloadTSVFromJson('topLociTSV.tsv', data)}>
          Download All Results
        </Button>
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey={(record) => record.pos}
        onChange={handleTableChange}
        pagination={{
          current: lociTableState.currentPage,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
        }}
      />
    </section>
  );
};

export default TopLociTable;
