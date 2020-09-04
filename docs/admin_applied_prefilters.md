# Admin Applied Prefilters

Commons administrators have the option to add hidden filters that are unalterable by users to each Data Explorer tab. These admin-applied pre-filters are applied before any user-applied filters. Use this functionality to hide particular commons data from users, like extraneous administrative data.

## Configuration

To apply an admin pre-filter, use the portal config field called `adminAppliedPreFilters`. This setting goes in data/config/*.json, or in the gitops.json file, inside a given tab within the commons' `explorerConfig`.

The setting follows the syntax of a Guppy filter. Specify a selectedValues filter. The filter is applied to to the records displayed before any user-applied filters, and can be specified independently in the dataExplorerConfig and fileExplorerConfig blocks.

Syntax:
```
"adminAppliedPreFilters": {
      "<name-of-field-of-interest>": { 
        "selectedValues": ["<selected-value-1>", ...]
      }
    }
```


In the below example, an admin filter is applied that only reveals data from the project name `jnkns-jenkins`.

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
