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

- `dataType`, `mainField` and `aggFields` will be provided to the Guppy aggregation query
- `mainFieldTitle` will be the name of the X axis, associated with values of `mainField`
- `mainFieldIsNumeric`: Gupppy needs to know whether `mainField` takes numeric or categorical values _(optional, default is false)_
- `fieldMapping`: fields for which a mapping is _not_ provided will be capitalized, for example `age_at_visit` will be displayed `Age At Visit` _(optional)_
- `colorRange`: a list of two hex color codes, the first one will be used for availabilities of 0% and the second one will be used for the greatest availability value found in the heatmap _(optional, default is `['#EBF7FB', '#1769a3']`)_

An additional row is always displayed using the values for the configuration field `dataExplorerConfig`.`guppyConfig`.`manifestMapping`.`referenceIdFieldInResourceIndex` (typically `subject_id` or `case_id`). A name mapping can also be provided for this row.
