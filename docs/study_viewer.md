# Study Viewer

Example configuration:

```
"studyViewerConfig": [
    {
        "dataType": "dataset",
        "title": "Datasets",           // page title
        "titleField": "name",         // row title
        "listItemConfig": {
            // displayed outside of table:
            "blockFields": ["short_description"],
            // displayed in table:
            "tableFields": ["condition", ...],
            "hideEmptyFields": false //optional false by default; hides empty fields
        },
        "singleItemConfig": { // optional, if omitted, "listItemConfig" block will be used for both pages
            // displayed outside of table:
            "blockFields": ["long_description"],
            // displayed in table:
            "tableFields": ["condition", ...],
            "hideEmptyFields": false, //optional false by default; hides empty fields
            // optional configs for side boxes, only for single study viewer
            "sideBoxes": [
                {
                "title": "Test Box",
                "items": [
                    {
                        "type": "pdf",
                        "link": "https://aaa",
                        "name": "This is a PDF file"
                    },
                    {
                        "type": "file",
                        "link": "https://bbb",
                        "name": "This is a file"
                    },
                    {
                        "type": "link",
                        "link": "https://ccc",
                        "name": "This is a link"
                    },
                    {
                        "link": "https://ddd",
                        "name": "This is a default type file"
                    }
                ]
                }
            ]
        },
        "fieldMapping": [...],
        "rowAccessor": "project_id", // rows unique ID
        "fileDataType": "clinicalTrialFile", // ES index of the clinical trial object files, optional
        "docDataType": "openAccessFile", // ES index of the open access documents, optional
        "openMode": "open-first", // optional, configure how the study viewer list do with each collapsible card on initial loading, see details in notes
        "openFirstRowAccessor": "", // optional, only works if `openMode` is `open-first`
        "defaultOrderBy": [<field name (eg "title", or from listItemConfig.blockFields/tableFields)>, <"asc" (default) or "desc">] // optional, overrides `openFirstRowAccessor`
        "buttons": [
            {
                // configuration common to all buttons
                "type": "",
                "singleItemView": false, // whether to display this button in the single item view (default: true)
                "listView": true, // whether to display this button in the list view (default: true)
                "enableButtonField": "data_available_for_request", // optional, name of a boolean field. If the value is false for this row, the button will not be displayed
                "disableButtonTooltipText": "Coming soon" // optional, tooltip text to display when the "enableButtonField" value is false
            },
            {
                // configuration specific to the "Download" button
                "type": "download",
                "downloadField": "object_id" // GUID - Note: unused for now, hardcoded to "object_id" (TODO)
                "overrideUrlField": "external_url"// optional, field to look for in the file to specify the download location of the file
            },
            {
                // configuration specific to the "Request Access" button
                "type": "request_access",
                "requiredIdpField": "required_idp", // optional, requires user to have logged in through this identity provider to request access
                "resourceDisplayNameField": "title",
                "redirectModalText": "", // optional, link label for the URL in "You will now be sent to <URL>"
                "accessRequestedText": "DAR In Progress", // optional, button text that will be overridden for the disabled button when user already has a request in SUBMITTED state. If omitted, the default text will be "Access Requested"
                "accessRequestedTooltipText": "Your recently submitted DAR is being reviewed" // optional, button tooltip that will be displayed for the disabled button when user already has a request in SUBMITTED state. If omitted, there will be no tooltip showing up by default
            },
            {
                // configuration specific to the "Export to Workspace" button
                "type": "export-pfb-to-workspace",
                "root_node": "clinical_trial_file",// name of the node corresponding to the "ROOT_NODE" ES index in the Pelican job config
                "disableButtonTooltipText": "Working on an Export" // optional, tooltip text to display when the "Export to Workspace" button is disabled during export
                }
        ]
    },
    {
        ....another study viewer config
    }
]
```

## Configuration Notes

1. All fields not marked "optional" are required.
2. The configuration above is subject to change. After `Tube` supports generating nested ES document then we can remove the `fileDataType` and `docDataType` fields.
3. The field `rowAccessor` should be a field that exists in `dataType`, `fileDataType`, and `docDataType`. The study viewer will use that field to cross query with different ES indices.
4. About `openMode` and `openFirstRowAccessor`, the list view of study browser supports 3 display modes on initial loading:
    - `open-all`: opens all collapsible cards by default. And this is the default option if `openMode` is omitted in the config
    - `close-all`: closes all collapsible cards by default
    - `open-first`: opens the first collapsible card in the list and keeps all other cards closing
        - When in `open-first` mode, user can specify a value using `openFirstRowAccessor`. The study viewer will try to find a study with that title in the list and bring it to the top of the list in order to open it.

## Additional Notes

1. Required fields for `fileData` and `docData` ES indices are: `file_name`, `file_size`, `data_format` and `data_type`. For `fileData`, additional required field is `object_id`; and for `docData`, `doc_url` is also required.
2. The access request logic depends on `Requestor`, for more info, see [Requestor](https://github.com/uc-cdis/requestor/).
