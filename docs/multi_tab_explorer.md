# Multi-tab Explorer

The multi-tab explorer is an enhancement to Windmill's data and file explorer feature. The enhancement includes a configuration format change to support rendering multiple tabs in the explorer, each tab will serve contents from one ES index. This enhancement allows the original file explorer to be decoupled with data explorer, and customize each tabs in the explorer.

This feature is available from Portal 2.26.0, and is backward compatible with existing data/file explorer configurations. For more information about the old configuration format for data/file explorer, please refer to [Portal Config](https://github.com/uc-cdis/data-portal/blob/master/docs/portal_config.md).

## Configuration

The multi-tab explorer requires a new configuration field, called `explorerConfig`, to be placed in the config file of Portal. The `explorerConfig` is an array which can hold multiple configuration objects, one for each tab. Each individual configuration object has a similar format as the old `dataExplorerConfig` and/or `fileExplorerConfig`, which means it should contain a set of fields like `charts`, `filters`, `table`, `buttons`, `guppyConfig` and other optional fields. Each tab serves the information from one single ES index, as have been defined in `guppyConfig.dataType`.

An example of this new `explorerConfig` is (some contents are omitted for conciseness):

```
"explorerConfig":[
    {                                       ---> 1st tab
      "tabTitle": "Data",
      "charts": {
        "project_id": {
          "chartType": "count",
          "title": "Projects"
        },
        ...
      },
      "filters": {
        "tabs": [
          {
            "title": "Case",
            "fields": [
              "project_id",
              ...
            ]
          }
        ]
      },
      "table": {
        "enabled": true,
        "fields": [
          "project_id",
          "url",
          ...
        ],
        "linkFields": [ "url" ]
      },
      "guppyConfig": {
        "dataType": "case",
        "nodeCountTitle": "Cases",
        "fieldMapping": [
          {"field": "_aliquots_count", "name": "Aliquots Count"},
          ....
        ],
        "manifestMapping": {
          "resourceIndexType": "file",
          "resourceIdField": "object_id",
          "referenceIdFieldInResourceIndex": "case_id",
          "referenceIdFieldInDataIndex": "case_id"
        },
        "accessibleFieldCheckList": ["project_id"],
        "accessibleValidationField": "project_id"
      },
      "buttons": [
         ...
      ]
    },
    {                                                  ---> 2nd tab
      "charts": {
        "data_type": {
          "chartType": "stackedBar",
          "title": "File Type"
        },
        ...
      },
      "filters": {
        ...
      },
      "table": {
        "enabled": true,
        "fields": [
          "project_id",
          ...
        ]
      },
      "guppyConfig": {
        "dataType": "file",
        "fieldMapping": [
          { "field": "object_id", "name": "GUID" }
        ],
        "nodeCountTitle": "Files",
        "manifestMapping": {
          "resourceIndexType": "case",
          "resourceIdField": "case_id",
          "referenceIdFieldInResourceIndex": "object_id",
          "referenceIdFieldInDataIndex": "object_id"
        },
        "accessibleFieldCheckList": ["project_id"],
        "accessibleValidationField": "project_id",
        "downloadAccessor": "object_id"
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
      "dropdowns": {}
    },
    {                                     ---> 3rd tab
      "charts": {
           ...
      },
      "filters": {
        "tabs": [
          {
            "title": "Subject",
            "fields": [
              "project_id",
              "subject_id"
            ]
          }
        ]
      },
      "table": {
        "enabled": true,
        "fields": [
          "project_id",
          "subject_id"
        ]
      },
      "guppyConfig": {
        "dataType": "subject",
        "fieldMapping": [
        ],
        "nodeCountTitle": "Subjects",
        "manifestMapping": {
        },
        "accessibleFieldCheckList": ["project_id"],
        "accessibleValidationField": "project_id"
      },
      "buttons": [
      ],
      "dropdowns": {}
    }
  ]
```

### Notable fields

- `tabTitle`: Optional. If omitted, will default to use the value of `guppyConfig.dataType` of this tab.
- `filters`: Required.
- `guppyConfig`: Required.
  - `dataType`: Required. Must match the index “type” in the guppy configuration block in the manifest.json.
  - `nodeCountTitle`: Optional. If omitted, will default to use plural of `guppyConfig.dataType` of this tab.

For a complete list of required and optional fields for a tab configuration object, please refer to [Portal Config](https://github.com/uc-cdis/data-portal/blob/master/docs/portal_config.md).

### Converting from old `dataExplorerConfig` or `fileExplorerConfig` to `explorerConfig`

The multi-tab explorer is backward compatible so it would work with existing `dataExplorerConfig` and `fileExplorerConfig`.

:warning: **Backward compatibility will only works if there is NO `explorerConfig` configuration exists in the Portal config file.** If you do have a new `explorerConfig` configuration exists in the Portal config file, any existing `dataExplorerConfig` and `fileExplorerConfig` will be ignored. If you intend to use the new `explorerConfig` configuration, please migrate existing `dataExplorerConfig` and `fileExplorerConfig` as described below.

In case of migrating existing configuration into the new `explorerConfig`, steps are easy to follow:

1. In Portal's configuration file (such as `gitops.json`), create a `explorerConfig` array object `"explorerConfig":[]`.
2. Copy all the values from the existing `dataExplorerConfig` as a whole object, and place it in the `explorerConfig` array. Add a `tabTitle` into it if needed.
3. Repeat for the existing `fileExplorerConfig` if needed.
4. Delete the old `dataExplorerConfig` and `fileExplorerConfig` on finish.

:information_source: Handling migration of the Data Availability Tool (DAT) configs

The Data Availability Tool (DAT) is a visualization tool to show data availability across projects. For more information about this tool, please read [Data Availability Tool](https://github.com/uc-cdis/data-portal/blob/master/docs/data_availability_tool.md)

In the past, in order to enable the DAT in data explorer, the portal config file must contain a `dataAvailabilityToolConfig` block. To migrate this DAT config so it can work with the new `explorerConfig`, simple copy the entire `dataAvailabilityToolConfig` block into the configuration block of the tab what the DAT will be put into.

Example:
```
"explorerConfig":[
    {                                       ---> 1st tab (with DAT)
      "tabTitle": "Data",
      "charts": {
        ...
      },
      "filters": {
        ...
      },
      "table": {
        ...
      },
      "dataAvailabilityToolConfig": {       ---> DAT configs
        "guppyConfig": {
          "dataType": "follow_up",
          "mainField": "visit_number",
          "mainFieldTitle": "Visit number",
          "mainFieldIsNumeric": true,
          "aggFields": [
              "age_at_visit",
              ...
          ],
          "fieldMapping": [
            { "field": "abcv", "name": "Abcavir Use" },
            ...
          ],
        "colorRange": ["#EBF7FB", "#1769A3"]
        }
      },
      "guppyConfig": {
        ...
      },
      "buttons": [
         ...
      ]
    },
    {                                          ---> 2nd tab (no DAT)
      "charts": {
        ...
      },
      "filters": {
        ...
      },
      "table": {
        ...
      },
      "guppyConfig": {
        ...
      },
      "buttons": [
        ...
      ],
      "dropdowns": {}
    }
  ]
```
