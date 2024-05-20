import showSearchBarMessage from './showSearchBarMessage';
import TableData from '../../../TestData/TableData';
import DefaultAtlasColumnManagement from '../../../Utils/DefaultAtlasColumnManagement';
import { IRowData } from '../../../Interfaces/Interfaces';

describe('showSearchBarMessage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const paginatedData = [TableData.data[0]] as IRowData[];
  it(`returns true when searchTerm is found in hidden columns
   with checkIfCellContainsSearchTerm`, () => {
    const searchTerm = TableData.data[0].vocabularyID;
    const columnManagementData = {
      ...DefaultAtlasColumnManagement,
      ...{ vocabularyID: false },
    };
    const result = showSearchBarMessage(
      searchTerm,
      paginatedData,
      columnManagementData,
    );
    expect(result).toBe(true);
  });
  it(`returns true when searchTerm is found in hidden cells
  with checkIfHiddenCellsContainSearchTerm`, () => {
    const searchTerm = TableData.data[0].valueSummary[0].personCount.toString();
    const columnManagementData = {
      ...DefaultAtlasColumnManagement,
      ...{ valueSummary: false },
    };
    const result = showSearchBarMessage(
      searchTerm,
      paginatedData,
      columnManagementData,
    );
    expect(result).toBe(true);
  });
  it('returns true when searchTerm is found in a percentage column', () => {
    const searchTerm = 3.1415;
    const columnManagementData = {
      ...DefaultAtlasColumnManagement,
      ...{ numberOfPeopleWithVariable: false },
    };
    const paginatedDataWithPercentageData = [
      {
        ...TableData.data[0],
        ...{ numberOfPeopleWithVariablePercent: searchTerm },
      },
    ] as IRowData[];
    const result = showSearchBarMessage(
      searchTerm.toString(),
      paginatedDataWithPercentageData,
      columnManagementData,
    );
    expect(result).toBe(true);
  });
  it('returns false when searchTerm is not found in a percentage column', () => {
    const searchTerm = 3.1415;
    const columnManagementData = {
      ...DefaultAtlasColumnManagement,
      ...{ numberOfPeopleWithVariable: false },
    };
    const paginatedDataWithPercentageData = [
      {
        ...TableData.data[0],
        ...{ numberOfPeopleWithVariablePercent: 3 },
      },
    ] as IRowData[];
    const result = showSearchBarMessage(
      searchTerm.toString(),
      paginatedDataWithPercentageData,
      columnManagementData,
    );
    expect(result).toBe(false);
  });

  it('returns false when searchTerm is not found in hidden columns', () => {
    const searchTerm = 3.1415;
    const columnManagementData = {
      ...DefaultAtlasColumnManagement,
      ...{ numberOfPeopleWithVariable: false },
    };
    const paginatedDataWithPercentageData = [
      {
        ...TableData.data[0],
        ...{ numberOfPeopleWithVariablePercent: 3 },
      },
    ] as IRowData[];
    const result = showSearchBarMessage(
      searchTerm.toString(),
      paginatedDataWithPercentageData,
      columnManagementData,
    );
    expect(result).toBe(false);
  });
});
