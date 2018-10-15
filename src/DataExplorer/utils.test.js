import { constructGraphQLQuery, hasKeyChain } from './utils';

describe('utils for downloading manifest', () => {
  const selectedTableRows = ['1', '2'];
  const arrangerConfig = {
    manifestMapping: {
      fileIndexType: 'file',
      fileIdField: 'uuid',
      fileReferenceIdFieldInFileIndex: 'subject_id',
      fileReferenceIdFieldInDataIndex: 'node_id'
    },
  };
  const queryForCount = constructGraphQLQuery(
    selectedTableRows,
    arrangerConfig.manifestMapping.fileIndexType,
    arrangerConfig.manifestMapping.fileReferenceIdFieldInFileIndex,
    [
      arrangerConfig.manifestMapping.fileIdField,
      arrangerConfig.manifestMapping.fileReferenceIdFieldInFileIndex,
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
    arrangerConfig.manifestMapping.fileReferenceIdFieldInFileIndex,
    [
      arrangerConfig.manifestMapping.fileIdField,
      arrangerConfig.manifestMapping.fileReferenceIdFieldInFileIndex,
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

  const testObject = { a: { b: { c: 1 } } };
  const hasKeys = 'a.b.c';
  const hasNoKeys = 'a.b.c.d';
  it('returns correctly from hasKeyChain function', () => {
    expect(hasKeyChain(testObject, hasKeys)).toBe(true);
    expect(hasKeyChain(testObject, hasNoKeys)).toBe(false);
    expect(hasKeyChain({}, hasNoKeys)).toBe(false);
    expect(hasKeyChain(null, hasNoKeys)).toBe(false);
  });
});
