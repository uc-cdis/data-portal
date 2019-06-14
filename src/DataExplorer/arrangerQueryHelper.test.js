import { constructGraphQLQuery, constructGraphQLQueryWithSQON } from './arrangerQueryHelper';

describe('Arranger query helper', () => {
  const indexType = 'kid';
  const fieldName = 'year';
  const values = ['1', '2'];
  const targetFields = ['gender'];
  const queryForCount = constructGraphQLQuery(
    [{
      name: fieldName,
      values,
    }],
    indexType,
    [...targetFields],
    true,
  );
  const sqonObj = {
    content: [
      {
        content: {
          field: fieldName,
          value: values,
        },
        op: 'in',
      },
    ],
    op: 'and',
  };
  const expectedQueryForCount = {
    query: `query ($first: Int, $sqon: JSON){
                ${indexType} {
                  hits (first: $first, filters: $sqon) {
                    total
                  }
                }
              }`,
    variables: {
      first: 0,
      sqon: sqonObj,
    },
  };
  const fakeReturnCount = 6;
  const queryForData = constructGraphQLQuery(
    [{
      name: fieldName,
      values,
    }],
    indexType,
    [...targetFields],
    false,
    fakeReturnCount);
  const expectedQueryForData = {
    query: `query ($first: Int, $sqon: JSON){
                ${indexType} {
                  hits (first: $first, filters: $sqon) {
                    edges {
                          node {
                            ${targetFields[0]}
                          }
                        }
                  }
                }
              }`,
    variables: {
      first: fakeReturnCount,
      sqon: sqonObj,
    },
  };

  const queryWithSQON = constructGraphQLQueryWithSQON(
    indexType,
    sqonObj,
    [...targetFields],
    true,
  );

  it('build graphql query string', () => {
    expect(queryForCount).toEqual(expectedQueryForCount);
    expect(queryForData).toEqual(expectedQueryForData);
    expect(queryWithSQON).toEqual(expectedQueryForCount);
  });
});

