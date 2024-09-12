## request format
/v0/tools/tableone
`{
  "filterSets": [
    {
      "filters": {
        "AND": [
          {
            "IN": {
              "ethnicity": [
                "Hispanic or Latino"
              ]
            }
          },
          {
            "IN": {
              "sex": [
                "Female"
              ]
            }
          }
        ]
      },
      "id": 485,
      "name": "2. name1"
    }
  ],
  "usedFilterSetIds": [
    -1,
    485
  ],
  "covarFields":[
    "sex",
    "race",
    "survival_characteristics.lkss"
  ],
  "covariates": [
            {
                "type": "categorical",
                "name": "lkss",
                "label":"lkss",
                "values": [
                    "Alive",
                    "Dead",
                    "Unknown"
                ],
                "keys": [
                    "Alive",
                    "Dead",
                    "Unknown"
                ]
            }

        ]
}`