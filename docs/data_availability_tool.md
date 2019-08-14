# Data Availability Tool configuration

The DAT requires the `dataAvailabilityToolConfig` block in `gitops.json`. An example of configuration:

```
"dataAvailabilityToolConfig": {
    "guppyConfig": {
        "dataType": "follow_up",
        "mainField": "harmonized_visit_number",
        "mainFieldTitle": "Visit number",
        "mainFieldIsNumeric": true,
        "aggFields": [
            "age_at_visit",
            "abcv",
            "thrpyv",
            "trzv"
        ],
        "fieldMapping": [
            {"field": "abcv", "name": "Abcavir Use"},
            {"field": "thrpyv", "name": "Therapy Type"},
            {"field": "trzv", "name": "Terazol Use"},
            {"field": "subject_id", "name": "Subjects"}
        ],
        "colorRange": ["#09e8d9", "#e36702"]
    }
}
```

- `mainFieldIsNumeric`: optional, default is false
- `fieldMapping`: optional. Fields for which a mapping is _not_ provided will be capitalized, for example `age_at_visit` will be displayed `Age At Visit`.
- `colorRange`: optional, default is ['#EBF7FB', '#1769a3']

An additional row is always displayed using the values for the configuration field `dataExplorerConfig`.`guppyConfig`.`manifestMapping`.`referenceIdFieldInResourceIndex` (typically `subject_id` or `case_id`). A name mapping can also be provided for this row.
