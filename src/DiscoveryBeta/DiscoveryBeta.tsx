import React from 'react';
import { LockFilled, LinkOutlined, UnlockOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Table, Tag, Radio, Space, Modal, Alert, Popover } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RadioChangeEvent } from 'antd/lib/radio';

import { AccessLevel } from './consts';

import './DiscoveryBeta.css';

export const DiscoveryTag = ({ selected, onSelect, color, name }) => (
  <Tag
    role='button'
    tabIndex={0}
    aria-pressed={selected ? 'true' : 'false'}
    className={`discovery-header__tag-btn discovery-tag ${selected && 'discovery-tag--selected'}`}
    aria-label={name}
    style={{
      backgroundColor: selected ? color : 'initial',
      borderColor: color,
    }}
    onKeyPress={onSelect}
    onClick={onSelect}
  >
    {name}
  </Tag>
);

export const DiscoveryAccessPopover = ({ title, content, accessible }) => (
  <Popover
    overlayClassName='discovery-table__access-popover'
    placement='topRight'
    arrowPointAtCenter
    title={title}
    content={<div className='discovery-table__access-popover-text'>
      {content}
    </div>}
  >
    { accessible ? <UnlockOutlined /> : <LockFilled /> }
  </Popover>
);
interface DiscoveryBetaProps {
  pageTitle: string

  // header
  headerAggregations: {value: string, label: string}[]
  headerTagSelectorTitle: string
  headerTagsByCategory: {
    categoryName: string,
    tags: {name: string, selected: boolean, color: string}[]
  }[]

  // search
  showSearchBar: boolean
  searchTerm: string
  onSearchTermChange: React.ChangeEventHandler<HTMLInputElement>

  // access filter
  showAccessLevelSelector: boolean
  accessLevel: AccessLevel
  defaultAccessLevel: AccessLevel
  onAccessLevelChange: (e: RadioChangeEvent) => void

  // table
  tableColumns: ColumnsType<any>
  tableData: any[]
  tableRowKey: string
  tableShowExpandedRow: boolean
  // eslint-disable-next-line react/no-unused-prop-types
  tableExpandedRowRender?: (rowData: any) => React.ReactNode
  onTableSelect: (record: any) => void

  // modal
  modalVisible: boolean
  modalTitle: string
  modalFields: {
    includeName: boolean,
    groupName?: string,
    fields: {
        includeName: boolean,
        name: string,
        value: React.ReactNode,
      }[]
  }[]
  modalPermalink: string
  modalShowAccess: boolean
  modalUserHasAccess?: boolean
  onModalClose: () => void

  // tag selector
  onTagSelect: (tag: string) => void
}

const DiscoveryBeta: React.FunctionComponent<DiscoveryBetaProps> = (props: DiscoveryBetaProps) => (
  <div className='discovery-container'>
    <h1 className='discovery-page-title'>{props.pageTitle}</h1>
    <div className='discovery-header'>
      <div className='discovery-header__stats-container'>
        {
          props.headerAggregations.map(aggregation => (
            <div className='discovery-header__stat' key={aggregation.label}>
              <div className='discovery-header__stat-number'>
                {aggregation.value}
              </div>
              <div className='discovery-header__stat-label'>
                {aggregation.label}
              </div>
            </div>
          ))
        }
      </div>
      <div className='discovery-header__tags-container' >
        <h3 className='discovery-header__tags-header'>{props.headerTagSelectorTitle}</h3>
        <div className='discovery-header__tags'>
          {
            props.headerTagsByCategory.map(({ categoryName, tags }) => (<div className='discovery-header__tag-group' key={categoryName}>
              <h5>{categoryName}</h5>
              { tags.map(tag => (<DiscoveryTag
                key={categoryName + tag.name}
                selected={tag.selected}
                name={tag.name}
                onSelect={() => props.onTagSelect(tag.name)}
                color={tag.color}
              />))
              }
            </div>))
          }
        </div>
      </div>
    </div>
    <div className='discovery-table-container'>
      <div className='discovery-table__header'>
        { props.showSearchBar &&
        <Input
          className='discovery-table__search'
          prefix={<SearchOutlined />}
          value={props.searchTerm}
          onChange={props.onSearchTermChange}
          allowClear
        />
        }
        { props.showAccessLevelSelector &&
        <div className='disvovery-table__controls'>
          <Radio.Group
            onChange={props.onAccessLevelChange}
            value={props.accessLevel}
            defaultValue={props.defaultAccessLevel}
            className='discovery-table__access-button'
            buttonStyle='solid'
          >
            <Radio.Button value={AccessLevel.BOTH}>All</Radio.Button>
            <Radio.Button value={AccessLevel.UNACCESSIBLE}><LockFilled /></Radio.Button>
            <Radio.Button value={AccessLevel.ACCESSIBLE}><UnlockOutlined /></Radio.Button>
          </Radio.Group>
        </div>
        }
      </div>
      <Table
        columns={props.tableColumns}
        rowKey={props.tableRowKey}
        rowClassName='discovery-table__row'
        onRow={record => ({
          onClick: () => props.onTableSelect(record),
          onKeyPress: () => props.onTableSelect(record),
        })}
        dataSource={props.tableData}
        expandable={props.tableShowExpandedRow && ({
        // expand all rows
          expandedRowKeys: props.tableData.map(r => r[props.tableRowKey]),
          expandedRowRender: record => (<div
            className='discovery-table__expanded-row-content'
            role='button'
            tabIndex={0}
            onClick={() => props.onTableSelect(record)}
          >
            {props.tableExpandedRowRender(record)}
          </div>),
          expandedRowClassName: () => 'discovery-table__expanded-row',
          expandIconColumnIndex: -1, // don't render expand icon
        })}
      />
    </div>
    <Modal
      visible={props.modalVisible}
      onOk={props.onModalClose}
      onCancel={props.onModalClose}
      width='80vw'
      title={(
        <Space align='baseline'>
          <h3 className='discovery-modal__header-text'>{props.modalTitle}</h3>
          <a href={props.modalPermalink}><LinkOutlined /> Permalink</a>
        </Space>
      )}
      footer={false}
    >
      <Space direction='vertical' size='large'>
        { props.modalShowAccess && (
          props.modalUserHasAccess
            ? (
              <Alert
                type='success'
                message={<><UnlockOutlined /> You have access to this study.</>}
              />
            )
            : (
              <Alert
                type='warning'
                message={<><LockFilled /> You do not have access to this study.</>}
              />
            )
        )}
        { props.modalFields.map((fieldGroup, i) => (
          <Space key={i} direction='vertical' className='discovery-modal__attribute-group'>
            { fieldGroup.includeName &&
                  <h3 className='discovery-modal__attribute-group-name'>{fieldGroup.groupName}</h3>
            }
            { fieldGroup.fields.map(field => (
              <Space key={field.name} align='start' className='discovery-modal__attribute'>
                { field.includeName !== false &&
                        <span className='discovery-modal__attribute-name'>{field.name}</span>
                }
                <span className='discovery-modal__attribute-value'>{field.value}</span>
              </Space>
            ))}
          </Space>
        ))}
      </Space>
    </Modal>
  </div>);

DiscoveryBeta.defaultProps = {
  tableExpandedRowRender: () => null,
  modalUserHasAccess: false,
};

export default DiscoveryBeta;
