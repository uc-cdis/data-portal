# Export PFB to URL

A new button in the Explorer which allows us to send a PFB of data exported from the explorer to an arbitrary URL.
Used to transfer data to external analysis platforms, such as Seven Bridges, Terra, and Cavatica.

## Background
The Explorer already supported exporting selected subjects to Seven Bridges and Terra in PFB format.
Originally we implemented this feature for just seven bridges and terra in a hardcoded way, e.g. the
`terraExportURL` portal config. Now, BDCat needs to support sending PFBs to other analysis platforms,
so we added a more generic way to send a PFB of data to an external URL.

## Implementation
Adds a new ExplorerButtonGroup button type, `"export-pfb-to-url"`, which has an additional config field `targetURLTemplate`.
`targetURLTemplate` is the full URL that the PFB should be exported to, including any query params required by the third party
analysis platform we're sending the PFB to. `targetURLTemplate` MUST include the string `{{PRESIGNED_URL}}` -- this string will
be replaced by the actual presigned URL of the exported PFB.
> Example: `"targetURLTemplate": "https://cgc-interop-vayu.sbgenomics.com/import/pfb?URL={{PRESIGNED_URL}}&source=anvil"`

## Config
```
"{data,file}ExplorerConfig": {
    ...
    "buttons": [
      {
        "enabled": true,
        "type": "export-pfb-to-url",
        "targetURLTemplate": "https://terra.biodatacatalyst.nhlbi.nih.gov/#import-data?url={{PRESIGNED_URL}}",
        "title": "Export All to Terra",
        "rightIcon": "external-link"
      },
    ]
}
```
