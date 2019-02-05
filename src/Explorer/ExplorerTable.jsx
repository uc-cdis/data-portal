import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import getReduxStore from '../reduxStore';
import SelectComponent from '../components/SelectComponent';
import { humanFileSize } from '../utils';
import './ExplorerTable.less';

const makeDefaultState = (page, pageSize, originalPage) => ({
  page,
  originalPage,
  pageSize,
});

class ExplorerTableComponent extends Component {
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

  static renderRow(user, projectAvail, file, i) {
    const filesize = humanFileSize(file.size);
    return (
      <tr key={i} className='explorer-table__table-row'>
        <td className='explorer-table__table-data explorer-table__table-data--column-0'>
          <Link to={`/${file.project_id}`}>{file.project_id}</Link>
        </td>
        <td className='explorer-table__table-data explorer-table__table-data--column-1'>
          <Link to={`/files/${file.did}`}>{file.name}</Link>
        </td>
        <td className='explorer-table__table-data explorer-table__table-data--column-2'>{file.format}</td>
        <td className='explorer-table__table-data explorer-table__table-data--column-3'>{filesize}</td>
        <td className='explorer-table__table-data explorer-table__table-data--column-4'>{file.category}</td>
      </tr>
    );
  }

  render() {
    const columns = ['Project', 'File Name', 'Format', 'File Size', 'Category'];
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
      <table className='explorer-table'>
        <thead className='explorer-table__table-head'>
          <tr className='explorer-table__table-row'>
            {columns.map(
              (item, i) => (
                (item in specialAligns) ?
                  <td
                    className={`explorer-table__table-data explorer-table__table-data--head-cell explorer-table__table-data--column-${i}`}
                    key={item}
                    style={{ textAlign: specialAligns[item] }}
                  >
                    {item}
                  </td>
                  :
                  <td
                    className={`explorer-table__table-data explorer-table__table-data--head-cell explorer-table__table-data--column-${i}`}
                    key={item}
                  >
                    {item}
                  </td>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {
            filesList && filesList.map(
              (item, i) => ExplorerTableComponent.renderRow(this.props.user,
                this.props.projectAvail, item, i),
            )
          }
        </tbody>
        <tfoot className='explorer-table__table-foot'>
          <tr className='explorer-table__table-row'>
            <td className='explorer-table__table-data explorer-table__table-data--foot-column-0'>
              {
                (this.state.originalPage > 0) &&
                <button className='explorer-table__arrow-button' onClick={() => this.loadMorePrev()}>
                  Prev {this.props.pageCount}
                </button>
              }
            </td>
            <td className='explorer-table__table-data explorer-table__table-data--foot-column-1'>
              {
                pages.map(item => (
                  <button
                    className={`explorer-table__page-button ${item === this.state.page ? 'explorer-table__page-button--active' : ''}`}
                    key={item}
                    active={item === this.state.page ? 'true' : 'false'}
                    onClick={
                      () => {
                        this.setState({ page: item });
                        this.props.onPageChange(item);
                      }
                    }
                  >
                    {item + 1}
                  </button>
                ))
              }
            </td>
            <td className='explorer-table__table-data explorer-table__table-data--foot-column-2'>
              <SelectComponent
                values={pageSizeValues}
                title={'Page size: '}
                selectedValue={this.props.pageSize}
                onChange={value => this.props.onPageSizeChange(value)}
              />
            </td>
            <td className='explorer-table__table-data explorer-table__table-data--foot-column-3'>
              {
                (this.props.lastPageSize === 0) &&
                <button className='explorer-table__arrow-button' onClick={() => this.loadMoreNext()}>
                  Next {this.props.pageCount}
                </button>
              }
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

ExplorerTableComponent.propTypes = {
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

ExplorerTableComponent.defaultProps = {
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

export default ExplorerTableComponent;
