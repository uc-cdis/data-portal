/**
 * @flow
 * @relayHash 31f56df53053cf9aea3a1cca843c1dd5
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type gqlHelperProjectDetailQueryResponse = {|
  +project: ?$ReadOnlyArray<?{|
    +name: ?string;
    +code: ?string;
    +experimentCount: ?number;
  |}>;
  +caseCount: ?number;
  +experimentCount: ?number;
  +aliquotCount: ?number;
  +fileCount1: ?number;
  +fileCount2: ?number;
  +fileCount3: ?number;
  +fileCount4: ?number;
  +fileCount5: ?number;
  +fileCount6: ?number;
  +fileCount7: ?number;
  +fileCount8: ?number;
  +fileCount9: ?number;
  +fileCount10: ?number;
  +fileCount11: ?number;
  +fileCount12: ?number;
  +fileCount13: ?number;
  +fileCount14: ?number;
  +fileCount15: ?number;
|};
*/


/*
query gqlHelperProjectDetailQuery(
  $name: [String]
) {
  project(project_id: $name) {
    name: project_id
    code
    experimentCount: _studies_count
    id
  }
  caseCount: _case_count(project_id: $name)
  experimentCount: _study_count(project_id: $name)
  aliquotCount: _aliquot_count(project_id: $name)
  fileCount1: _slide_image_count(project_id: $name)
  fileCount2: _submitted_aligned_reads_count(project_id: $name)
  fileCount3: _submitted_copy_number_count(project_id: $name)
  fileCount4: _submitted_methylation_count(project_id: $name)
  fileCount5: _submitted_somatic_mutation_count(project_id: $name)
  fileCount6: _submitted_unaligned_reads_count(project_id: $name)
  fileCount7: _app_checkup_count(project_id: $name)
  fileCount8: _cell_image_count(project_id: $name)
  fileCount9: _clinical_checkup_count(project_id: $name)
  fileCount10: _derived_checkup_count(project_id: $name)
  fileCount11: _mass_cytometry_assay_count(project_id: $name)
  fileCount12: _mass_cytometry_image_count(project_id: $name)
  fileCount13: _mri_result_count(project_id: $name)
  fileCount14: _sensor_checkup_count(project_id: $name)
  fileCount15: _test_result_count(project_id: $name)
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "name",
        "type": "[String]",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "gqlHelperProjectDetailQuery",
    "selections": [
      {
        "kind": "ScalarField",
        "alias": "fileCount6",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_unaligned_reads_count",
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "concreteType": "project",
        "name": "project",
        "plural": true,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": "name",
            "args": null,
            "name": "project_id",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "code",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "experimentCount",
            "args": null,
            "name": "_studies_count",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "experimentCount",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_study_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "aliquotCount",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_aliquot_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount1",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_slide_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount2",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_aligned_reads_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount3",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_copy_number_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount4",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_methylation_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount5",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_somatic_mutation_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "caseCount",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_case_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount7",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_app_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount8",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_cell_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount9",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_clinical_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount10",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_derived_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount11",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_mass_cytometry_assay_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount12",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_mass_cytometry_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount13",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_mri_result_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount14",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_sensor_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount15",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_test_result_count",
        "storageKey": null
      }
    ],
    "type": "Root"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "gqlHelperProjectDetailQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "name",
        "type": "[String]",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "gqlHelperProjectDetailQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "ScalarField",
        "alias": "fileCount6",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_unaligned_reads_count",
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "concreteType": "project",
        "name": "project",
        "plural": true,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": "name",
            "args": null,
            "name": "project_id",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "code",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "experimentCount",
            "args": null,
            "name": "_studies_count",
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
        "kind": "ScalarField",
        "alias": "experimentCount",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_study_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "aliquotCount",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_aliquot_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount1",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_slide_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount2",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_aligned_reads_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount3",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_copy_number_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount4",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_methylation_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount5",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_submitted_somatic_mutation_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "caseCount",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_case_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount7",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_app_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount8",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_cell_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount9",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_clinical_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount10",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_derived_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount11",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_mass_cytometry_assay_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount12",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_mass_cytometry_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount13",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_mri_result_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount14",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_sensor_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount15",
        "args": [
          {
            "kind": "Variable",
            "name": "project_id",
            "variableName": "name",
            "type": "[String]"
          }
        ],
        "name": "_test_result_count",
        "storageKey": null
      }
    ]
  },
  "text": "query gqlHelperProjectDetailQuery(\n  $name: [String]\n) {\n  project(project_id: $name) {\n    name: project_id\n    code\n    experimentCount: _studies_count\n    id\n  }\n  caseCount: _case_count(project_id: $name)\n  experimentCount: _study_count(project_id: $name)\n  aliquotCount: _aliquot_count(project_id: $name)\n  fileCount1: _slide_image_count(project_id: $name)\n  fileCount2: _submitted_aligned_reads_count(project_id: $name)\n  fileCount3: _submitted_copy_number_count(project_id: $name)\n  fileCount4: _submitted_methylation_count(project_id: $name)\n  fileCount5: _submitted_somatic_mutation_count(project_id: $name)\n  fileCount6: _submitted_unaligned_reads_count(project_id: $name)\n  fileCount7: _app_checkup_count(project_id: $name)\n  fileCount8: _cell_image_count(project_id: $name)\n  fileCount9: _clinical_checkup_count(project_id: $name)\n  fileCount10: _derived_checkup_count(project_id: $name)\n  fileCount11: _mass_cytometry_assay_count(project_id: $name)\n  fileCount12: _mass_cytometry_image_count(project_id: $name)\n  fileCount13: _mri_result_count(project_id: $name)\n  fileCount14: _sensor_checkup_count(project_id: $name)\n  fileCount15: _test_result_count(project_id: $name)\n}\n"
};

module.exports = batch;
