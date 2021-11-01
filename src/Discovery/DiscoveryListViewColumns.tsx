import { ColumnType } from "antd/lib/table";
import { DiscoveryConfig } from "./DiscoveryConfig";
import React from "react";
import {Tag} from "antd/"
import { renderFieldContent } from "./Discovery"

const highlightSearchTerm = (
    value: string,
    searchTerm: string,
    highlighClassName = 'matched'
): {highlighted: React.ReactNode, matchIndex: number} => {
    const matchIndex = value.toLowerCase().indexOf(searchTerm.toLowerCase());
    const noMatchFound = matchIndex === -1;
    if (noMatchFound) {
      return { highlighted: value, matchIndex: -1 };
    }
    const prev = value.slice(0, matchIndex);
    const matched = value.slice(matchIndex, matchIndex + searchTerm.length);
    const after = value.slice(matchIndex + searchTerm.length);
    return {
      highlighted: (
        <React.Fragment>
          {prev}
          <span className={highlighClassName}>{matched}</span>
          {after}
        </React.Fragment>
      ),
      matchIndex,
    };
  };


const discoveryListViewColumns = (
    config: DiscoveryConfig,
    searchTerm: string
): ColumnType<DiscoveryMetadata>[] => {
    const columns: ColumnType<DiscoveryMetadata>[] = config.studyColumns.map(
        (columnConfig): ColumnType<DiscoveryMetadata> => {
            const column = {
                title: <div className='discovery-table-header'>{columnConfig.name}</div>,
                ellipsis: !!columnConfig.ellipsis,
                textWrap: 'word-break',
                width: columnConfig.width,
                render: (_, metadataRecord) => {
                    metadataRecord
                    let value = metadataRecord[columnConfig.field];
                    if (value === undefined) {
                        if (columnConfig.errorIfNotAvailable !== false) {
                            throw new Error(`Configuration error: Could not find field ${columnConfig.field} in record ${JSON.stringify(metadataRecord)}. Check the 'study_columns' section of the Discovery config.`);
                        }
                        if (columnConfig.valueIfNotAvailable) {
                            return columnConfig.valueIfNotAvailable;
                        }
                        return 'Not available';
                    }
                    const columnIsSearchable = (
                        config.features.search.searchBar.searchableTextFields
                        ? config.features.search.searchBar.searchableTextFields.indexOf(columnConfig.field) !== -1
                        : !columnConfig.contentType || columnConfig.contentType === 'string'
                    );
                    if (columnIsSearchable) {
                        // Show search highlights if there's an active search term
                        if (searchTerm) {
                            if (Array.isArray(value)) {
                                value = value.join(', ');
                            }
                            return highlightSearchTerm(value, searchTerm).highlighted;
                        }
                    }
                    if (columnConfig.hrefValueFromField) {
                        return <a href={`//${metadataRecord[columnConfig.hrefValueFromField]}`}
                            target='_blank'
                            rel='noreferrer'>
                            { renderFieldContent(value, columnConfig.contentType, config) }
                        </a>;
                    }
                    return renderFieldContent(value, columnConfig.contentType, config);
                }
            }
            return column;
        }
    );



    return columns
}

const columns: any = config.studyColumns.map((column) => ({
    // title: <div className='discovery-table-header'>{column.name}</div>,
    // ellipsis: !!column.ellipsis,
    // textWrap: 'word-break',
    // width: column.width,
    // render: (_, record) => {
    //   let value = record[column.field];

    //   if (value === undefined) {
    //     if (column.errorIfNotAvailable !== false) {
    //       throw new Error(`Configuration error: Could not find field ${column.field} in record ${JSON.stringify(record)}. Check the 'study_columns' section of the Discovery config.`);
    //     }
    //     if (column.valueIfNotAvailable) {
    //       return column.valueIfNotAvailable;
    //     }
    //     return 'Not available';
    //   }
    //   const columnIsSearchable = config.features.search.searchBar.searchableTextFields
    //     ? config.features.search.searchBar.searchableTextFields.indexOf(column.field) !== -1
    //     : !column.contentType || column.contentType === 'string';
    //   if (columnIsSearchable) {
    //     // Show search highlights if there's an active search term
    //     if (searchTerm) {
    //       if (Array.isArray(value)) {
    //         value = value.join(', ');
    //       }
    //       return highlightSearchTerm(value, searchTerm).highlighted;
    //     }
    //   }
    //   if (column.hrefValueFromField) {
    //     return <a href={`//${record[column.hrefValueFromField]}`} target='_blank' rel='noreferrer'>{ renderFieldContent(value, column.contentType, config) }</a>;
    //   }

    //   return renderFieldContent(value, column.contentType, config);
//     },
//   }),
//   );
//   columns.push(
//     {
//       textWrap: 'word-break',
//       title: <div className='discovery-table-header'> { config.tagsDisplayName || 'Tags' }</div>,
//       ellipsis: false,
//       width: config.tagColumnWidth || '200px',
//       render: (_, record) => (
//         <React.Fragment>
//           {record.tags.map(({ name, category }) => {
//             const isSelected = !!selectedTags[name];
//             const color = getTagColor(category, config);
//             if (typeof name !== 'string') {
//               return null;
//             }
//             return (
//               <Tag
//                 key={record.name + name}
//                 role='button'
//                 tabIndex={0}
//                 aria-pressed={isSelected ? 'true' : 'false'}
//                 className={`discovery-tag ${isSelected ? 'discovery-tag--selected' : ''}`}
//                 aria-label={name}
//                 style={{
//                   backgroundColor: isSelected ? color : 'initial',
//                   borderColor: color,
//                 }}
//                 onKeyPress={(ev) => {
//                   ev.stopPropagation();
//                   setSelectedTags({
//                     ...selectedTags,
//                     [name]: selectedTags[name] ? undefined : true,
//                   });
//                 }}
//                 onClick={(ev) => {
//                   ev.stopPropagation();
//                   setSelectedTags({
//                     ...selectedTags,
//                     [name]: selectedTags[name] ? undefined : true,
//                   });
//                 }}
//               >
//                 {name}
//               </Tag>
//             );
//           })}
//         </React.Fragment>
//       ),
//     },
//   );
//   if (config.features.authorization.enabled) {
//     columns.push({
//       title: <div className='discovery-table-header'>Data Availability</div>,
//       filters: [{
//         text: <React.Fragment><UnlockOutlined />&nbsp;Available</React.Fragment>,
//         value: AccessLevel.ACCESSIBLE,
//         id: 'accessible-data-filter',
//       }, {
//         text: <React.Fragment><DashOutlined />&nbsp;Not Available</React.Fragment>,
//         value: AccessLevel.NOT_AVAILABLE,
//         id: 'not-available-data-filter',
//       }, {
//         text: <React.Fragment><ClockCircleOutlined />&nbsp;Pending</React.Fragment>,
//         value: AccessLevel.PENDING,
//         id: 'pending-data-filter',
//       }],
//       onFilter: (value, record) => record[accessibleFieldName] === value,
//       // This will sort the values in the order defined by the AccessLevel enum. (AccessLevel.ACCESSIBLE=1, AccessLevel.UNACCESSIBLE=2, etc)
//       sorter: (a, b) => b[accessibleFieldName] - a[accessibleFieldName],
//       defaultSortOrder: 'descend',
//       ellipsis: false,
//       width: '106px',
//       textWrap: 'word-break',
//       render: (_, record) => {
//         if (record[accessibleFieldName] === AccessLevel.PENDING) {
//           return (
//             <Popover
//               overlayClassName='discovery-popover'
//               placement='topRight'
//               arrowPointAtCenter
//               content={(
//                 <div className='discovery-popover__text'>
//                   This study will have data soon
//                 </div>
//               )}
//             >
//               <ClockCircleOutlined className='discovery-table__access-icon' />
//             </Popover>
//           );
//         }
//         if (record[accessibleFieldName] === AccessLevel.NOT_AVAILABLE) {
//           return (
//             <Popover
//               overlayClassName='discovery-popover'
//               placement='topRight'
//               arrowPointAtCenter
//               content={(
//                 <div className='discovery-popover__text'>
//                 This study does not have any data yet.
//                 </div>
//               )}
//             >
//               <DashOutlined className='discovery-table__access-icon' />
//             </Popover>
//           );
//         }
//         if (record[accessibleFieldName] === AccessLevel.ACCESSIBLE) {
//           return (
//             <Popover
//               overlayClassName='discovery-popover'
//               placement='topRight'
//               arrowPointAtCenter
//               title={'You have access to this study.'}
//               content={(
//                 <div className='discovery-popover__text'>
//                   <React.Fragment>You have <code>{ARBORIST_READ_PRIV}</code> access to</React.Fragment>
//                   <React.Fragment><code>{record[config.minimalFieldMapping.authzField]}</code>.</React.Fragment>
//                 </div>
//               )}
//             >
//               <UnlockOutlined className='discovery-table__access-icon' />
//             </Popover>
//           );
//         }
//         return <React.Fragment />;
//         /* Hiding the closed lock for the HEAL project.
//           This may be useful functionality for other commons.
//           Keeping the logic for now.
//            https://ctds-planx.atlassian.net/browse/HP-393
//         */
//         // return (
//         //   <Popover
//         //     overlayClassName='discovery-popover'
//         //     placement='topRight'
//         //     arrowPointAtCenter
//         //     title={'You do not have access to this study.'}
//         //     content={(
//         //       <div className='discovery-popover__text'>
//         //         <React.Fragment>You don&apos;t have <code>{ARBORIST_READ_PRIV}</code> access to</React.Fragment>
//         //         <React.Fragment><code>{record[config.minimalFieldMapping.authzField]}</code>.</React.Fragment>
//         //       </div>
//         //     )}
//         //   >
//         //     {/* <EyeInvisibleOutlined className='discovery-table__access-icon' /> */}
//         //     ---
//         //   </Popover>
//         // );
//       },
//     });
//   }
//   // -----
