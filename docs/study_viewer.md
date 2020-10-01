# Study Viewer

Example configuration:

```
[
    {
        "dataType": "dataset",
        "title": "Datasets",           // page title
        "titleField": "name",         // row title
        "listItemConfig": {  // required
            // displayed outside of table:
            "blockFields": ["short_description"],
            // displayed in table:
            "tableFields": ["condition", ...],
        },
        "singleItemConfig": { //optional, if omitted, "listItemConfig" block will be used for both pages
            // displayed outside of table:
            "blockFields": ["long_description"],
            // displayed in table:
            "tableFields": ["condition", ...],
        },
        "fieldMapping": [...],
        "rowAccessor": "project_id", // rows unique ID
        "fileDataType": "clinicalTrialFile", // ES index of the clinical trial object files, optional
        "docDataType": "openAccessFile", // ES index of the open access documents, optional
        "openMode": "open-first", // optional, configure how the study viewer list do with each collapsible card on initial loading, see details in notes
        "openFirstRowAccessor": "", // optional, only works if `openMode` is `open-first`
        "buttons": [
            {
                "type": "download",
                "downloadField": "object_id", // GUID - Note: unused for now, hardcoded to "object_id"
                "singleItemView": false // whether to display in the single item view (default: true)
                "listView": true // whether to display in the list view (default: true)
            },
            {
                "type": "request_access",
                "resourceDisplayNameField": "title"
            }
        ]
    },
    {
        ....another study viewer config
    }
]
```

## Notes

1. The configuration above is subject to change. After `Tube` supports generating nested ES document then we can remove the `fileDataType` and `docDataType` fields.
2. Required fields for `fileData` and `docData` ES indices are: `file_name`, `file_size`, `data_format` and `data_type`. For `fileData`, additional required field is `object_id`; and for `docData`, `doc_url` is also required.
3. The field `rowAccessor` should be a field that exists in all 3 ES indices. The study viewer will use that field to cross query with different ES indices.
4. About `openMode` and `openFirstRowAccessor`, the list view of study browser supports 3 display modes on initial loading:
    - `open-all`: opens all collapsible cards by default. And this is the default option if `openMode` is omitted in the config
    - `close-all`: closes all collapsible cards by default
    - `open-first`: opens the first collapsible card in the list and keeps all other cards closing
        - When in `open-first` mode, user can specify a value using `openFirstRowAccessor`. The study viewer will try to find a study with that title in the list and bring it to the top of the list in order to open it.
5. The access request logic depends on `Requestor`, for more info, see [Requestor](https://github.com/uc-cdis/requestor/).
