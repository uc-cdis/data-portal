# Explorer

## Configuration

The explorer requires a configuration field, called `explorerConfig`, to be placed in the config file of Portal. The `explorerConfig` is an array which can hold multiple configuration objects, one for each tab. Each individual configuration object should contains a set of fields like `charts`, `filters`, `table`, `buttons`, `guppyConfig` and other optional fields. Each tab serves the information from one single ES index, as have been defined in `guppyConfig.dataType`.

An example of `explorerConfig` is (some contents are omitted for conciseness):

```jsonc
{
  "explorerConfig": [
    // --> 1st explorer
    {
      "id": 1,
      "label": "Data",
      "charts": {
        "project_id": {
          "chartType": "count",
          "title": "Projects"
        }
        // ...
      },
      "filters": {
        "tabs": [
          {
            "title": "Case",
            // GraphQL fields (node attributes) to list out facets
            "fields": [
              "project_id"
              // ...
            ]
          }
        ]
      },
      "table": {
        "enabled": true,
        // GraphQL fields (node attributes) to include in the table
        "fields": [
          "project_id"
          // ...
        ],
        // optional; fields (must exist in "fields" list above) to display as clickable buttons
        "linkFields": ["url"]
      },
      "survivalAnalysis": {
        // optional; if missing, survival analysis feature won't be used
        "result": {
          // optional; if true, fetch and display calculated p-value for log-rank test
          "pval": false,
          // optional; if true, fetch and display number-at-risk table
          "risktable": false,
          // optional; if true, fetch and plot survival rates
          "survival": false
        }
      },
      "guppyConfig": {
        // must match the index “type” in the guppy configuration block in the manifest.json
        "dataType": "case",
        // plural of root node
        "nodeCountTitle": "Cases",
        // optional; a way to rename GraphQL fields to be more human readable
        "fieldMapping": [
          {
            "field": "_aliquots_count",
            // optional; custom label to display
            "name": "Aliquots Count",
            // optional; tooltip text to display on hover
            "tooltip": ""
          }
          // ....
        ],
        // optional; how to configure the mapping between cases/subjects/participants and files. This is used to export or download files that are associated with a cohort. It is basically joining two indices on specific GraphQL fields
        "manifestMapping": {
          // the type of the index (must match the guppy config block in manifest.json) that contains the resources for the manifest
          "resourceIndexType": "file",
          // the identifier in the manifest index to grab
          "resourceIdField": "object_id",
          // the field in the manifest index to match a field in the cohort
          "referenceIdFieldInResourceIndex": "case_id",
          // the field in the case/subject/participant index used to match with a field in the manifest index
          "referenceIdFieldInDataIndex": "case_id"
        },
        // required if downloading a file; the GUID for downloding a file; This should probably not change
        "downloadAccessor": "object_id"
      },
      "buttons": [
        {
          "enabled": true,
          // button type; see Notable fields section below for available types
          "type": "data",
          "title": "Download All Clinical",
          // file name when it is downloaded
          "fileName": "clinical.json",
          // optional; icon on left from /img/icons
          "leftIcon": "user",
          // optional; icon on right from /img/icons
          "rightIcon": "download",
          // optional; if putting into a dropdown; see "dropdowns" option below
          "dropdownId": "download"
        }
        // ...
      ],
      // optional; lists dropdowns if you want to combine multiple buttons into one dropdown
      "dropdowns": {
        // dropdownId value for button as set in "buttons" option above
        "download": {
          "title": "Download"
        }
      },
      // optional
      "patientsId": {
        // optional; if true, display a special filter section to set/upload a list of patient ids
        "filter": false,
        // optional; if true, display a button/modal to export the current cohort (patient ids set) to external data commons
        "export": false
      },
      // optional; if requesting access to the data sets what site should the user visit?
      "getAccessButtonLink": "https://dbgap.ncbi.nlm.nih.gov/",
      // optional; if exporting to Terra which URL should we use?
      "terraExportURL": "https://bvdp-saturn-dev.appspot.com/#import-data",
      // optional; see "docs/data_availability_tool.md" for details
      "dataAvailabilityToolConfig": {}
    },

    // --> 2nd explorer
    {
      "id": 2,
      "label": "File",
      "charts": {
        "data_type": {
          "chartType": "stackedBar",
          "title": "File Type"
        }
        // ...
      },
      "filters": {
        // ...
      },
      "buttons": [
        {
          "enabled": true,
          "type": "file-manifest",
          "title": "Download Manifest",
          "leftIcon": "datafile",
          "rightIcon": "download",
          "fileName": "file-manifest.json"
        }
      ],
      "table": {
        "enabled": true,
        "fields": [
          "project_id"
          //...
        ]
      },
      "guppyConfig": {
        "dataType": "file",
        "fieldMapping": [{ "field": "object_id", "name": "GUID" }],
        "nodeCountTitle": "Files",
        "manifestMapping": {
          "resourceIndexType": "case",
          "resourceIdField": "case_id",
          "referenceIdFieldInResourceIndex": "object_id",
          "referenceIdFieldInDataIndex": "object_id"
        },
        "downloadAccessor": "object_id"
      }

      // ... more options
    }

    // ... more explorers
  ]
}
```

### Notable fields

- `id`: Required. Meant to remain constant over time. Changing its value can break the filter sets feature.
- `label`: Optional. If omitted, will default to use the value of `guppyConfig.dataType` of this tab.
- `filters`: Required.
- `survivalAnalysis`: See [this external page](https://github.com/chicagopcdc/Documents/blob/master/GEN3/survival-analysis-tool/requirements.md) for further information.
- `guppyConfig`: Required.
  - `dataType`: Required. Must match the index “type” in the guppy configuration block in the manifest.json.
  - `nodeCountTitle`: Required. Plural of root node.
- `buttons`:
  - `type`: Available types include:
    - "data" for downloading data
    - "manifest" for creating file manifest
    - "export" for exporting to Terra
    - "export-to-pfb" for exporting to PFB
    - "export-to-workspace" for exporting to workspace
- `dataAvailabilityToolConfig`: See [this page](./data_availability_tool.md) for further information.

For a complete list of required and optional fields for a tab configuration object, please refer to [Portal Config](./portal_config.md).
