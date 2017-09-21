/**
 * @flow
 * @relayHash f29375c9d0287e5bf464a87c510f4cbd
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type gqlHelperExplorerRefreshQueryResponse = {|
  +viewer: ?{| |};
|};
*/


/*
query gqlHelperExplorerRefreshQuery(
  $selected_projects: [String]
  $selected_file_types: [String]
  $selected_file_formats: [String]
) {
  viewer {
    ...gqlHelperExplorerFragment_43vKIe
  }
}

fragment gqlHelperExplorerFragment_43vKIe on viewer {
  fileData1: slide_image(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData2: submitted_aligned_reads(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData3: submitted_copy_number(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData4: submitted_methylation(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData5: submitted_somatic_mutation(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData6: submitted_unaligned_reads(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData7: app_checkup(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData8: cell_image(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData9: clinical_checkup(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData10: derived_checkup(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData11: mass_cytometry_assay(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData12: mass_cytometry_image(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData13: mri_result(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData14: sensor_checkup(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
    project_id
    file_name
    data_category
    data_format
    data_type
    file_size
    id
  }
  fileData15: test_result(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
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
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "selected_projects",
        "type": "[String]",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "selected_file_types",
        "type": "[String]",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "selected_file_formats",
        "type": "[String]",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "gqlHelperExplorerRefreshQuery",
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
            "args": [
              {
                "kind": "Variable",
                "name": "selected_file_formats",
                "variableName": "selected_file_formats",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "selected_file_types",
                "variableName": "selected_file_types",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "selected_projects",
                "variableName": "selected_projects",
                "type": null
              }
            ]
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
  "name": "gqlHelperExplorerRefreshQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "selected_projects",
        "type": "[String]",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "selected_file_types",
        "type": "[String]",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "selected_file_formats",
        "type": "[String]",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "gqlHelperExplorerRefreshQuery",
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
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData1",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData3",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData4",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData5",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData6",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData7",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData2",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData9",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData10",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData11",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData12",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData13",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData14",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "fileData15",
            "args": [
              {
                "kind": "Variable",
                "name": "data_format",
                "variableName": "selected_file_formats",
                "type": "[String]"
              },
              {
                "kind": "Variable",
                "name": "data_type",
                "variableName": "selected_file_types",
                "type": "[String]"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10000,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "project_id",
                "variableName": "selected_projects",
                "type": "[String]"
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
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query gqlHelperExplorerRefreshQuery(\n  $selected_projects: [String]\n  $selected_file_types: [String]\n  $selected_file_formats: [String]\n) {\n  viewer {\n    ...gqlHelperExplorerFragment_43vKIe\n  }\n}\n\nfragment gqlHelperExplorerFragment_43vKIe on viewer {\n  fileData1: slide_image(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData2: submitted_aligned_reads(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData3: submitted_copy_number(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData4: submitted_methylation(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData5: submitted_somatic_mutation(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData6: submitted_unaligned_reads(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData7: app_checkup(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData8: cell_image(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData9: clinical_checkup(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData10: derived_checkup(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData11: mass_cytometry_assay(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData12: mass_cytometry_image(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData13: mri_result(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData14: sensor_checkup(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n  fileData15: test_result(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {\n    project_id\n    file_name\n    data_category\n    data_format\n    data_type\n    file_size\n    id\n  }\n}\n"
};

module.exports = batch;
