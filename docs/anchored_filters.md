## Anchored filters

Anchored filters refer to explorer filters that are grouped by the combination of a sepecific "anchor" field and its value. Here, the "anchor" is a loose metaphor for how the select field-value serves to fix a certain set of filters to be applied in a limited fashion.

The anchor can only be applied to nested field filters, and the field used for the anchor should be a common attribute of these nested field filters. Otherwise, the use of anchored filters will fail.

### Configuration

The use of anchored filters can be specified using a portal configuration option for data explorer filters that looks like the following:

```jsonc
{
  "explorerConfig": [
    {
      "filters": {
        "anchor": {
          "field": "",
          "options": [""],
          "tabs": [""],
          "tooltip": "" // optional
        },
        "tabs": [
          // ...
        ]
      }
    }
  ]
}
```

- `"field"` is the name of the field to use as anchor. It must be a common attribute to all nested field filters to be used as anchored filters. Additionally, the anchor must be an _option_ (as opposed to _range_) type filter
- `"options"` is an array of values for the anchor field to be used for anchored filters.
- `"tabs"` is an array of tab titles where the tabs will contain nested field filters to be used as anchored filters.
- `"tooltip"` is the text to display on hover in a tooltip element. This is optional.

## UI

If anchored filters configuration is set, the specified filter tabs in the anchored filter configuration will get a special filter section on the top. This special filter section contains a radio button group to set anchor value to use. Only one anchor value can be selected at a time. The default option is to not set an anchor value and is labelled "Any".

Each anchor value gets its own set of filters, which is also reflected on the filter UI state, i.e. the checked/unchecked status as well as the relevant data count for each select filter option and min/max values for each range filter.

## Filter state data structure

The filter state data structure for anchored filters is simply additive to the original and does not change how normal, i.e. non-anchored, filters are encoded in the client-side filter state object.

The following is the updated filter state data structure modeled in TypeScript:

```ts
type OptionFilter = {
  __combineMode?: 'AND' | 'OR';
  selectedValues: string[];
};

type RangeFilter = {
  lowerBound: number;
  upperBound: number;
};

type SimpleFilterState = {
  [fieldName: string]: OptionFilter | RangeFilter;
};

type FilterState = {
  [fieldNameOrAnchorLabel: string]:
    | OptionFilter
    | RangeFilter
    | { filter: SimpleFilterState }; // for anchored filters
};
```

An anchor label value is formated as `[anchorField]:[anchorValue]`, where `[anchorField]` is the `explorerConfig[i].filters.anchor.field` value in the portal configuration and `[anchorValue]` is one of the `explorerConfig[i].filters.anchor.options` values in the portal configuration that is selected by the user.

The anchor label is used only if anchor value is set to be a non-empty value (i.e. not "Any").

### Example

```ts
const filterState: FilterState = {
  sex: {
    selectedValues: ['Female'],
  },
  'disease_phase:Initial Diagnosis': {
    filter: {
      'histologies.histology_grade': {
        selectedValues: ['Differentiating'],
      },
    },
  },
  'disease_phase:Relapse': {
    filter: {
      'tumor_assessments.tumor_classification': {
        selectedValues: ['Primary'],
      },
    },
  },
};
```

## GraphQL Query filter

When anchored filters are used in the translated GraphQL queries, the anchor field-value combination will be injected as an additional filter piece to each affected nested field filter piece. In this way, the anchored filters will be used in conjunction with the anchoring filter (i.e. joined by `"AND"`).

The example filter state above would be converted to the following GraphQL filter object:

```js
const gqlFilter = {
  AND: [
    {
      IN: {
        sex: ['Female'],
      },
    },
    {
      nested: {
        path: 'histologies',
        AND: [
          {
            AND: [
              {
                IN: {
                  histology_grade: ['Differentiating'],
                },
              },
              // injected anchored filter piece
              {
                IN: {
                  disease_phase: ['Initial Diagnosis'],
                },
              },
            ],
          },
        ],
      },
    },
    {
      nested: {
        path: 'tumor_assessments',
        AND: [
          {
            AND: [
              {
                IN: {
                  tumor_classification: ['Primary'],
                },
              },
              // injected anchored filter piece
              {
                IN: {
                  disease_phase: ['Relapse'],
                },
              },
            ],
          },
        ],
      },
    },
  ],
};
```
