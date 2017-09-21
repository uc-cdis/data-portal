/**
 * @flow
 * @relayHash e263a5b0000c1ed26494b9dc02f9db5f
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type gqlHelperExplorerPageQueryResponse = {|
  +viewer: ?{| |};
|};
*/


/*
query gqlHelperExplorerPageQuery {
  viewer {
    ...gqlHelperExplorerFragment
  }
}

fragment gqlHelperExplorerFragment on viewer {
  fileData1: slide_image(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData2: submitted_aligned_reads(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData3: submitted_copy_number(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData4: submitted_methylation(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData5: submitted_somatic_mutation(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData6: submitted_unaligned_reads(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData7: app_checkup(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData8: cell_image(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData9: clinical_checkup(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData10: derived_checkup(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData11: mass_cytometry_assay(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData12: mass_cytometry_image(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData13: mri_result(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData14: sensor_checkup(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData15: test_result(first: 10000) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "gqlHelperExplorerPageQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "viewer",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "gqlHelperExplorerFragment",
            "args": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Root"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "gqlHelperExplorerPageQuery",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "gqlHelperExplorerPageQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "viewer",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "fileData8",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "cell_image",
            "name": "cell_image",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "cell_image{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData1",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "slide_image",
            "name": "slide_image",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "slide_image{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData3",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "submitted_copy_number",
            "name": "submitted_copy_number",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "submitted_copy_number{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData4",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "submitted_methylation",
            "name": "submitted_methylation",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "submitted_methylation{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData5",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "submitted_somatic_mutation",
            "name": "submitted_somatic_mutation",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "submitted_somatic_mutation{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData6",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "submitted_unaligned_reads",
            "name": "submitted_unaligned_reads",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "submitted_unaligned_reads{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData7",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "app_checkup",
            "name": "app_checkup",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "app_checkup{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData2",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "submitted_aligned_reads",
            "name": "submitted_aligned_reads",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "submitted_aligned_reads{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData9",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "clinical_checkup",
            "name": "clinical_checkup",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "clinical_checkup{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData10",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "derived_checkup",
            "name": "derived_checkup",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "derived_checkup{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData11",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "mass_cytometry_assay",
            "name": "mass_cytometry_assay",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "mass_cytometry_assay{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData12",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "mass_cytometry_image",
            "name": "mass_cytometry_image",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "mass_cytometry_image{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData13",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "mri_result",
            "name": "mri_result",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "mri_result{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData14",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "sensor_checkup",
            "name": "sensor_checkup",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "sensor_checkup{\"first\":10000}"
          },
          {
            "kind": "LinkedField",
            "alias": "fileData15",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              }
            ],
            "concreteType": "test_result",
            "name": "test_result",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "project_id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_category",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_format",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "data_type",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "file_size",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": "test_result{\"first\":10000}"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query gqlHelperExplorerPageQuery {\n  viewer {\n    ...gqlHelperExplorerFragment\n  }\n}\n\nfragment gqlHelperExplorerFragment on viewer {\n  fileData1: slide_image(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData2: submitted_aligned_reads(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData3: submitted_copy_number(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData4: submitted_methylation(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData5: submitted_somatic_mutation(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData6: submitted_unaligned_reads(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData7: app_checkup(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData8: cell_image(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData9: clinical_checkup(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData10: derived_checkup(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData11: mass_cytometry_assay(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData12: mass_cytometry_image(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData13: mri_result(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData14: sensor_checkup(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData15: test_result(first: 10000) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n}\n"
};

module.exports = batch;
