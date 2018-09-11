import { constructGraphQLQuery } from './utils';

describe('utils for downloading manifest', () => {
  const selectedTableRows = ['1', '2'];
  const arrangerConfig = {
    manifestMapping: {
      fileIndexType: 'file',
      fileIdField: 'uuid',
      fileReferenceIdField: 'subject_id',
    },
  };
  const queryForCount = constructGraphQLQuery(
    selectedTableRows,
    arrangerConfig.manifestMapping.fileIndexType,
    arrangerConfig.manifestMapping.fileReferenceIdField,
    [
      arrangerConfig.manifestMapping.fileIdField,
      arrangerConfig.manifestMapping.fileReferenceIdField,
    ],
    true);
  const expectedSqonVariable = {
    content: [
      {
        content: {
          field: 'subject_id',
          value: selectedTableRows,
        },
        op: 'in',
      },
    ],
    op: 'and',
  };
  const expectedQueryForCount = {
    query: `query ($first: Int, $sqon: JSON){
                file {
                  hits (first: $first, filters: $sqon) {
                    total
                  }
                }
              }`,
    variables: {
      first: 0,
      sqon: expectedSqonVariable,
    },
  };
  const fakeReturnCount = 6;
  const queryForData = constructGraphQLQuery(
    selectedTableRows,
    arrangerConfig.manifestMapping.fileIndexType,
    arrangerConfig.manifestMapping.fileReferenceIdField,
    [
      arrangerConfig.manifestMapping.fileIdField,
      arrangerConfig.manifestMapping.fileReferenceIdField,
    ],
    false,
    fakeReturnCount);
  const expectedQueryForData = {
    query: `query ($first: Int, $sqon: JSON){
                file {
                  hits (first: $first, filters: $sqon) {
                    edges {
                          node {
                            uuid
                            subject_id
                          }
                        }
                  }
                }
              }`,
    variables: {
      first: fakeReturnCount,
      sqon: expectedSqonVariable,
    },
  };
  it('build graphql query string', () => {
    expect(queryForCount).toEqual(expectedQueryForCount);
    expect(queryForData).toEqual(expectedQueryForData);
  });
});
