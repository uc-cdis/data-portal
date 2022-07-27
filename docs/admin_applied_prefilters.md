# Admin-applied Prefilters

Commons administrators have the option to add hidden filters that are unalterable by users to each Data Explorer tab. These admin-applied prefilters are applied before any user-applied filters. Use this functionality to hide particular commons data from users, like extraneous administrative data. Note that this filter is only applied to the Data Explorer UI -- hidden data will still be accessible to users from the Query page and the Guppy API.

## Configuration

To apply an admin prefilter, use the portal config field called `adminAppliedPreFilters`. This setting goes in data/config/*.json, or in the gitops.json file. Place it inside a given tab entry within the `explorerConfig` block.

The setting follows the syntax of a Guppy selectedValues filter.

Syntax:
```
"adminAppliedPreFilters": {
      "<name-of-field-of-interest>": {
        "selectedValues": ["<selected-value-1>", "<selected-value-2>"]
      }
    }
```

In a commons with the above config block, data will only be shown in the explorer tab if the field `<name-of-field-of-interest>` is set to either `<selected-value-1>` or `<selected-value-2>`. Furthermore, because the data explorer calculates filters to display based on the data available, the filter setting for `<name-of-field-of-interest>` will only display `<selected-value-1>` and `<selected-value-2>` as applicable options.


In the below example, an admin filter is applied that only reveals data from the project named `jnkns-jenkins`. In the UI, the "Project" filter in this example will no longer display any other project name as a filter option but `jnkns-jenkins`.

```
"explorerConfig":[
    {
      "tabTitle": "Subjects",
      "adminAppliedPreFilters": {
         "project_id": {
            "selectedValues": ["jnkns-jenkins"]
          }
      },
      "charts": {
        "project_id": {
          "chartType": "count",
          "title": "Projects"
        },
        "subject_id": {
          "chartType": "count",
          "title": "Subjects"
        },
        "annotated_sex": {
          "chartType": "pie",
          "title": "Annotated Sex"
        },
        "race": {
          "chartType": "bar",
          "title": "Race"
        },
        "fileCounts": false
      },
```
