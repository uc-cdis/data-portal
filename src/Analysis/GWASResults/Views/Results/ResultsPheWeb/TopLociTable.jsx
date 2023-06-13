import React, { useMemo } from 'react';
import { Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import downloadCSVFromJson from './downloadCSVFromJSON';

const TopLociTable = ({ data }) => {
  const tableData = useMemo(() => {
    return data.map((obj) => ({
      ...obj,
      variant: `${obj?.chrom}:${obj?.pos.toLocaleString('en-US')} ${obj?.ref}/
    ${obj?.alt} (${obj?.rsids})`,
    }));
  }, [data]);

  const handleSearchTermChange = () => null;
  const downloadTopLoci = () => downloadCSVFromJson('topLociCSV.csv', data);

  const lociTableState = {
    variantSearchTerm: '',
    currentPage: 1,
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
              value={lociTableState.nearest_genes}
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
      title: 'af',
      dataIndex: 'af',
      key: 'af',
      sorter: (a, b) => a.af.toString().localeCompare(b.af.toString()),

      children: [
        {
          title: (
            <Input
              placeholder='Search by Af'
              suffix={<SearchOutlined />}
              value={lociTableState.af}
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
              value={lociTableState.pval}
              onChange={(event) => handleSearchTermChange(event, 'pval')}
            />
          ),
          dataIndex: 'pval',
        },
      ],
      sorter: (a, b) => a.pval.toString().localeCompare(b.pval.toString()),
    },
  ];
  console.log('DATA:', tableData);

  return (
    <section className='top-loci'>
      <h2>Top Loci</h2>
      <div className='table-header'>
        <Button onClick={downloadTopLoci}>Download All Results</Button>
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        rowKey={(record) => record.pos}
        // onChange={handleTableChange}
        pagination={{
          // current: lociTableState.currentPage,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
        }}
      />
    </section>
  );
};

export default TopLociTable;
