/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type gqlHelperExplorerFragment = {|
  +fileData1: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData2: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData3: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData4: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData5: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData6: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData7: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData8: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData9: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData10: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData11: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData12: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData13: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData14: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
  +fileData15: ?$ReadOnlyArray<?{|
    +project_id: ?string;
    +file_name: ?string;
    +data_category: ?string;
    +data_format: ?string;
    +data_type: ?string;
    +file_size: ?number;
  |}>;
|};
*/


const fragment /*: ConcreteFragment*/ = {
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
  "name": "gqlHelperExplorerFragment",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "viewer"
};

module.exports = fragment;
