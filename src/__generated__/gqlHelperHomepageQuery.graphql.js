/**
 * @flow
 * @relayHash d5bd8807597dde6e1a7c607c5ce4d118
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type gqlHelperHomepageQueryResponse = {|
  +projectList: ?$ReadOnlyArray<?{|
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
query gqlHelperHomepageQuery {
  projectList: project(first: 10000) {
    name: project_id
    code
    experimentCount: _studies_count
    id
  }
  caseCount: _case_count
  experimentCount: _study_count
  aliquotCount: _aliquot_count
  fileCount1: _slide_image_count
  fileCount2: _submitted_aligned_reads_count
  fileCount3: _submitted_copy_number_count
  fileCount4: _submitted_methylation_count
  fileCount5: _submitted_somatic_mutation_count
  fileCount6: _submitted_unaligned_reads_count
  fileCount7: _app_checkup_count
  fileCount8: _cell_image_count
  fileCount9: _clinical_checkup_count
  fileCount10: _derived_checkup_count
  fileCount11: _mass_cytometry_assay_count
  fileCount12: _mass_cytometry_image_count
  fileCount13: _mri_result_count
  fileCount14: _sensor_checkup_count
  fileCount15: _test_result_count
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "gqlHelperHomepageQuery",
    "selections": [
      {
        "kind": "ScalarField",
        "alias": "fileCount6",
        "args": null,
        "name": "_submitted_unaligned_reads_count",
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": "projectList",
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 10000,
            "type": "Int"
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
        "storageKey": "project{\"first\":10000}"
      },
      {
        "kind": "ScalarField",
        "alias": "experimentCount",
        "args": null,
        "name": "_study_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "aliquotCount",
        "args": null,
        "name": "_aliquot_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount1",
        "args": null,
        "name": "_slide_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount2",
        "args": null,
        "name": "_submitted_aligned_reads_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount3",
        "args": null,
        "name": "_submitted_copy_number_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount4",
        "args": null,
        "name": "_submitted_methylation_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount5",
        "args": null,
        "name": "_submitted_somatic_mutation_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "caseCount",
        "args": null,
        "name": "_case_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount7",
        "args": null,
        "name": "_app_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount8",
        "args": null,
        "name": "_cell_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount9",
        "args": null,
        "name": "_clinical_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount10",
        "args": null,
        "name": "_derived_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount11",
        "args": null,
        "name": "_mass_cytometry_assay_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount12",
        "args": null,
        "name": "_mass_cytometry_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount13",
        "args": null,
        "name": "_mri_result_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount14",
        "args": null,
        "name": "_sensor_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount15",
        "args": null,
        "name": "_test_result_count",
        "storageKey": null
      }
    ],
    "type": "Root"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "gqlHelperHomepageQuery",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "gqlHelperHomepageQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "ScalarField",
        "alias": "fileCount6",
        "args": null,
        "name": "_submitted_unaligned_reads_count",
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": "projectList",
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 10000,
            "type": "Int"
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
        "storageKey": "project{\"first\":10000}"
      },
      {
        "kind": "ScalarField",
        "alias": "experimentCount",
        "args": null,
        "name": "_study_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "aliquotCount",
        "args": null,
        "name": "_aliquot_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount1",
        "args": null,
        "name": "_slide_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount2",
        "args": null,
        "name": "_submitted_aligned_reads_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount3",
        "args": null,
        "name": "_submitted_copy_number_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount4",
        "args": null,
        "name": "_submitted_methylation_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount5",
        "args": null,
        "name": "_submitted_somatic_mutation_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "caseCount",
        "args": null,
        "name": "_case_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount7",
        "args": null,
        "name": "_app_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount8",
        "args": null,
        "name": "_cell_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount9",
        "args": null,
        "name": "_clinical_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount10",
        "args": null,
        "name": "_derived_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount11",
        "args": null,
        "name": "_mass_cytometry_assay_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount12",
        "args": null,
        "name": "_mass_cytometry_image_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount13",
        "args": null,
        "name": "_mri_result_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount14",
        "args": null,
        "name": "_sensor_checkup_count",
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "fileCount15",
        "args": null,
        "name": "_test_result_count",
        "storageKey": null
      }
    ]
  },
  "text": "query gqlHelperHomepageQuery {\n  projectList: project(first: 10000) {\n    name: project_id\n    code\n    experimentCount: _studies_count\n    id\n  }\n  caseCount: _case_count\n  experimentCount: _study_count\n  aliquotCount: _aliquot_count\n  fileCount1: _slide_image_count\n  fileCount2: _submitted_aligned_reads_count\n  fileCount3: _submitted_copy_number_count\n  fileCount4: _submitted_methylation_count\n  fileCount5: _submitted_somatic_mutation_count\n  fileCount6: _submitted_unaligned_reads_count\n  fileCount7: _app_checkup_count\n  fileCount8: _cell_image_count\n  fileCount9: _clinical_checkup_count\n  fileCount10: _derived_checkup_count\n  fileCount11: _mass_cytometry_assay_count\n  fileCount12: _mass_cytometry_image_count\n  fileCount13: _mri_result_count\n  fileCount14: _sensor_checkup_count\n  fileCount15: _test_result_count\n}\n"
};

module.exports = batch;
