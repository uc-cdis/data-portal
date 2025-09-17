import { DiscoveryConfig } from '../../DiscoveryConfig';

interface Column {
    name: string;
    field: string;
    contentType?: 'string' | 'number' | 'link';
    errorIfNotAvailable?: boolean;
    valueIfNotAvailable?: string | number;
    ellipsis?: boolean;
    width?: string | number;
    hrefValueFromField?: 'string';
}

const isColumnSearchable = (
  column: Column,
  config: DiscoveryConfig,
  selectedFieldsForSearchIndexing: string[],
): boolean => {
  const allConfiguredSearchableTextFields = config.features.search.searchBar.searchableTextFields;
  if (allConfiguredSearchableTextFields) {
    const searchableTextFields = selectedFieldsForSearchIndexing.length > 0
      ? selectedFieldsForSearchIndexing : allConfiguredSearchableTextFields;
    const isSearchableField = searchableTextFields ? searchableTextFields.includes(column.field) : false;
    return isSearchableField;
  }
  const isContentTypeString = !column.contentType || column.contentType === 'string';
  return isContentTypeString;
};

export default isColumnSearchable;
