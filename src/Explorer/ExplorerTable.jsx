import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { TableRow, TableHead } from '../theme';
import { TableData, TableHeadCell,
  ExplorerTableStyle, TableFooter,
  TableFootCell, PageButton, ArrowButton } from './style';
import { getReduxStore } from '../reduxStore';

const makeDefaultState = () => ({
  page: 0,
  originalPage: 0,
  originalPageToSet: 0,
});

export class ExplorerTableComponent extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    filesList: PropTypes.array,
    lastPageSize: PropTypes.number,
    pageSize: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    onPageLoadNextMore: PropTypes.func,
    onPageLoadPrevMore: PropTypes.func,
  };

  static defaultProps = {
    lastPageSize: 0,
    onPageLoadNextMore: () => {},
    onPageLoadPrevMore: () => {},
  };

  static renderRow(file, column_widths, i) {
    return (
      <TableRow key={i}>
        <TableData c_width={column_widths[0]}>
          <Link to={`/${file.project_id}`}>{file.project_id}</Link>
        </TableData>
        <TableData c_width={column_widths[1]}>{file.name}</TableData>
        <TableData c_width={column_widths[2]}>{file.format}</TableData>
        <TableData c_width={column_widths[3]}>{file.size}</TableData>
        <TableData c_width={column_widths[4]}>{file.category}</TableData>
      </TableRow>
    );
  }

  constructor(props) {
    super(props);
    this.state = makeDefaultState();
    this.resetState = this.resetState.bind(this);
  }

  /**
   * Subscribe to Redux updates at update time
   */
  componentWillUpdate() {
    getReduxStore().then(
      (store) => {
        const explorerState = store.getState().explorer;
        if (explorerState.resetCurrentPage) {
          this.setState({ page: 0, originalPage: 0 });
          store.dispatch({
            type: 'UNSET_RESET_CURRENT_PAGE',
          });
        } else if (explorerState.originalPageToReset.includes(this.props.name)
          && explorerState.more_data === 'RECEIVED') {
          this.setState({
            page: this.state.originalPageToSet,
            originalPage: this.state.originalPageToSet,
          });
          store.dispatch({
            type: 'UNSET_RESET_ORIGIN_PAGE',
          });
        }
      },
    );
  }

  resetState() {
    this.setState(makeDefaultState({}));
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
    const startingPage = (this.state.page - this.state.originalPage);
    const filesList = this.props.filesList
      ? this.props.filesList.slice(startingPage * this.props.pageSize,
        (startingPage * this.props.pageSize) + this.props.pageSize) : [];
    const numberOfPages = this.props.filesList ? this.props.filesList.length / this.props.pageSize : 0;
    let pages = [];
    for (let i = 0; i < numberOfPages; i += 1) {
      pages = [...pages, this.state.originalPage + i];
    }
    return (
      <ExplorerTableStyle>
        <TableHead>
          <TableRow>
            {columns.map(
              (item, i) => (<TableHeadCell key={i} c_width={columnWidths[i]}>
                {item}
              </TableHeadCell>),
            )}
          </TableRow>
        </TableHead>
        <tbody>
          {
            filesList && filesList.map(
              (item, i) => ExplorerTableComponent.renderRow(item, columnWidths, i),
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
            <TableFootCell c_width={'60%'}>
              {
                pages.map((item, i) =>
                  (<PageButton
                    key={i}
                    active={item === this.state.page}
                    onClick={() => this.setState({ page: item })}
                  >
                    {item + 1}
                  </PageButton>))
              }</TableFootCell>
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
