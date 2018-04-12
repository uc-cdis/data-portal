import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TableRow, TableHead } from '../theme';
import { TableData, TableHeadCell,
  TableFooter,
  TableFootCell, PageButton, ArrowButton } from './style';
import getReduxStore from '../reduxStore';
import SelectComponent from '../components/SelectComponent';
import { userapiPath } from '../localconf';

const makeDefaultState = (page, pageSize, originalPage) => ({
  page,
  originalPage,
  pageSize,
});

export const ExplorerTableStyle = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  font-size: 15px;

`;


export class ExplorerTableComponent extends Component {
  static propTypes = {
    user: PropTypes.object,
    projectAvail: PropTypes.object,
    name: PropTypes.string.isRequired,
    filesList: PropTypes.array,
    lastPageSize: PropTypes.number,
    pageSize: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    originalPage: PropTypes.number,
    onPageLoadNextMore: PropTypes.func,
    onPageLoadPrevMore: PropTypes.func,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
  };

  static defaultProps = {
    user: {},
    projectAvail: {},
    filesList: [],
    lastPageSize: 0,
    originalPage: 0,
    onPageLoadNextMore: () => {},
    onPageLoadPrevMore: () => {},
    onPageChange: () => {},
    onPageSizeChange: () => {},
  };

  static renderFileName(user, projectAvail, projectID, did, name) {
    const parts = projectID.split('-');
    const program = parts[0];
    const project = parts[1];
    let hasAccess = false;
    if (projectID in projectAvail) {
      if (projectAvail[projectID] === 'Open') {
        hasAccess = true;
      }
    }
    if ('project_access' in user && program in user.project_access) {
      if (user.project_access[program].includes('read-storage')) {
        hasAccess = true;
      }
    }
    if ('project_access' in user && project in user.project_access) {
      if (user.project_access[project].includes('read-storage')) {
        hasAccess = true;
      }
    }
    const filename = hasAccess ? (
      <a key={name} href={`${userapiPath}data/download/${did}?expires_in=10&redirect`}>{name}</a>
    ) : (
      <span>{name}</span>
    );
    return filename;
  }

  static renderRow(user, projectAvail, file, columnWidths, i) {
    const filename = ExplorerTableComponent.renderFileName(user, projectAvail,
      file.project_id, file.did, file.name);
    return (
      <TableRow key={i}>
        <TableData c_width={columnWidths[0]}>
          <Link to={`/${file.project_id}`}>{file.project_id}</Link>
        </TableData>
        <TableData c_width={columnWidths[1]}>
          {filename}
        </TableData>
        <TableData c_width={columnWidths[2]}>{file.format}</TableData>
        <TableData c_width={columnWidths[3]} style={{ textAlign: 'right' }}>{file.size}</TableData>
        <TableData c_width={columnWidths[4]}>{file.category}</TableData>
      </TableRow>
    );
  }

  constructor(props) {
    super(props);
    this.state = makeDefaultState(props.page, props.pageSize, props.originalPage);
    this.resetState = this.resetState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    getReduxStore().then(
      (store) => {
        const explorerState = store.getState().explorer;
        if (explorerState.moreData === 'RECEIVED') {
          const filesList = nextProps.filesList;
          const numberOfPages = filesList ? Math.ceil(filesList.length / nextProps.pageSize) : 0;
          const newPage = nextProps.originalPage + (this.props.page % this.props.pageCount);
          const page = (numberOfPages > this.props.page % this.props.pageCount)
            ? newPage : (nextProps.originalPage + (numberOfPages - 1));
          this.setState({ page,
            originalPage: nextProps.originalPage,
            pageSize: nextProps.pageSize });
          this.props.onPageChange(page);
          if (explorerState.originalPageToReset.includes(this.props.name)) {
            store.dispatch({
              type: 'UNSET_RESET_ORIGIN_PAGE',
            });
          }
        }
      },
    );
  }

  resetState() {
    this.setState(makeDefaultState());
  }

  loadMoreNext() {
    this.setState({ originalPageToSet: this.state.originalPage + this.props.pageCount });
    this.props.onPageLoadNextMore();
  }

  loadMorePrev() {
    this.setState({ originalPageToSet: this.state.originalPage - this.props.pageCount });
    this.props.onPageLoadPrevMore();
  }

  render() {
    const columns = ['Project', 'File Name', 'Format', 'File Size', 'Category'];
    const columnWidths = ['20%', '35%', '10%', '15%', '20%'];
    const specialAligns = { 'File Size': 'right' };
    const startingPage = (this.state.page - this.state.originalPage);
    const filesList = this.props.filesList
      ? this.props.filesList.slice(startingPage * this.props.pageSize,
        (startingPage * this.props.pageSize) + this.props.pageSize) : [];
    let pages = [];
    const pageSizeValues = [5, 10, 20, 50];
    if (this.state.pageSize > 0) {
      const numberOfPages = this.props.filesList ?
        this.props.filesList.length / this.state.pageSize : 0;
      for (let i = 0; i < numberOfPages; i += 1) {
        pages = [...pages, this.state.originalPage + i];
      }
    }
    return (
      <ExplorerTableStyle>
        <TableHead>
          <TableRow>
            {columns.map(
              (item, i) => (
                (item in specialAligns) ?
                  <TableHeadCell
                    key={item}
                    c_width={columnWidths[i]}
                    style={{ textAlign: specialAligns[item] }}
                  >
                    {item}
                  </TableHeadCell>
                  :
                  <TableHeadCell key={item} c_width={columnWidths[i]}>
                    {item}
                  </TableHeadCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <tbody>
          {
            filesList && filesList.map(
              (item, i) => ExplorerTableComponent.renderRow(this.props.user,
                this.props.projectAvail, item, columnWidths, i),
            )
          }
        </tbody>
        <TableFooter>
          <TableRow>
            <TableFootCell c_width={'20%'}>
              {
                (this.state.originalPage > 0) &&
                <ArrowButton onClick={() => this.loadMorePrev()}>
                  Prev {this.props.pageCount}
                </ArrowButton>
              }
            </TableFootCell>
            <TableFootCell c_width={'40%'}>
              {
                pages.map(item =>
                  (<PageButton
                    key={item}
                    active={item === this.state.page}
                    onClick={
                      () => {
                        this.setState({ page: item });
                        this.props.onPageChange(item);
                      }
                    }
                  >
                    {item + 1}
                  </PageButton>))
              }
            </TableFootCell>
            <TableFootCell c_width={'20%'}>
              <SelectComponent
                values={pageSizeValues}
                title={'Page size: '}
                selectedValue={this.props.pageSize}
                onChange={value => this.props.onPageSizeChange(value)}
              />
            </TableFootCell>
            <TableFootCell c_width={'20%'}>
              {
                (this.props.lastPageSize === 0) &&
                <ArrowButton onClick={() => this.loadMoreNext()}>
                  Next {this.props.pageCount}
                </ArrowButton>
              }
            </TableFootCell>
          </TableRow>
        </TableFooter>
      </ExplorerTableStyle>
    );
  }
}
