Search filters are special filters in the Explorer page that allow the user to search over fields which have too many options to be displayed normally -- for example, individual subject IDs or file GUIDs.

## Deployment
SearchFilters require Guppy >= 0.9.0.

To deploy SearchFilters in a tab of the Explorer page, add an entry to data{/file}ExplorerConfig.filters.tabs.searchFields.

NOTE: Do not add the same field to both searchFields and fields, this will cause strange behavior in the search field.

Example config:
"filters": {
      "tabs": [
        {
          "title": "Subject",
          "searchFields": [
            "subject_id",
            "submitter_id",
            "consent_codes"
          ],
          "fields": [
            "data_type",
            "data_format",
            ...
          ]
        }
