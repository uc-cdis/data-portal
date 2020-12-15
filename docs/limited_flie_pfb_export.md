Limited File PFB export adds a limited ability to export PFBs of data files from the Files tab. The limitation is that users cannot export data files of different data types (e.g. `Aligned Reads`, `Imaging Files`, etc.). (More specifically, users cannot export data files that are on different nodes in the graph.) We're accepting this limitation in order to avoid a significant rewrite of the pelican-export job, which assumes all entities to export are on the same node.

- Link to Jira ticket: [PXP-6544](https://ctds-planx.atlassian.net/browse/PXP-6544)
- Link to design doc: https://docs.google.com/document/d/12FkAYOpDuSdQScEgYBxXsPUdm8GUuUZgD6xU7EQga5A/edit#heading=h.53vab1pwrz1y
- Link to relevant Pelican PR: https://github.com/uc-cdis/pelican/pull/33
- Link to manual test plan: https://github.com/uc-cdis/gen3-qa/pull/454

### How to deploy
- Limited File PFB Export requires Pelican >= 0.5.1 / 2020.10, Tube >= 0.4.2 / 2020.10
- Limited File PFB Export is enabled by setting `fileExplorerConfig.enableLimitedFilePFBExport: { sourceNodeField: "source_node" }` and by adding buttons of buttonType `export-files` (Export to Terra), `export-files-to-pfb` (Download PFB), or `export-files-to-seven-bridges` (Export to Seven Bridges) to `fileExplorerConfig.buttons`. Example:
```
  "fileExplorerConfig": {
    ...
    "buttons": [
      ....
      {
        "enabled": true,
        "type": "export-files-to-pfb",
        "title": "Export All to PFB",
        "rightIcon": "external-link",
        "tooltipText": "You have not selected any cases to export. Please use the checkboxes on the left to select specific cases you would like to export."
      },
      {
        "enabled": true,
        "type": "export-files",
        "title": "Export All to Terra",
        "rightIcon": "external-link",
        "tooltipText": "You have not selected any cases to export. Please use the checkboxes on the left to select specific cases you would like to export."
      }
    ],
    "enableLimitedFilePFBExport": {"sourceNodeField": "source_node"},
```
- Limited File PFB Export requires the `source_node` property to be ETL'd -- `source_node` should be added to `props` in the `file` section of `etlMapping.yaml`. Example:
```
  - name: mpingram_file
    doc_type: file
    type: collector
    root: None
    category: data_file
    props:
      - name: object_id
      - name: md5sum
      ...
      - name: source_node
```
- Limited File PFB Export requires a new `export-files` job block to be added to the Sower config in manifest.json. The $ROOT_NODE environment variable must be set to `"file"`, or the name of the Guppy file index if it isn't "file". *For BioDataCatalyst, the EXTRA_NODES environment variable must be set to `""`*. (This is for backwards compatibility: pelican-export includes `reference_file` by default on all BDCat PFB exports unless $EXTRA_NODES is set to an empty string). Example sower config:
```
    {
      "name": "pelican-export-files",
      "action": "export-files",
      "container": {
        "name": "job-task",
        "image": "quay.io/cdis/pelican-export:0.5.1",
        "pull_policy": "Always",
        "env": [
          {
            "name": "DICTIONARY_URL",
            "valueFrom": {
              "configMapKeyRef": {
                "name": "manifest-global",
                "key": "dictionary_url"
              }
            }
          },
          {
            "name": "GEN3_HOSTNAME",
            "valueFrom": {
              "configMapKeyRef": {
                "name": "manifest-global",
                "key": "hostname"
              }
            }
          },
          {
            "name": "ROOT_NODE",
            "value": "file"
          },
          {
            "name": "EXTRA_NODES",
            "value": ""
          }
        ],
        "volumeMounts": [
          {
            "name": "pelican-creds-volume",
            "readOnly": true,
            "mountPath": "/pelican-creds.json",
            "subPath": "config.json"
          },
          {
            "name": "peregrine-creds-volume",
            "readOnly": true,
            "mountPath": "/peregrine-creds.json",
            "subPath": "creds.json"
          }
        ],
        "cpu-limit": "1",
        "memory-limit": "4Gi"
      },
      "volumes": [
        {
          "name": "pelican-creds-volume",
          "secret": {
            "secretName": "pelicanservice-g3auto"
          }
        },
        {
          "name": "peregrine-creds-volume",
          "secret": {
            "secretName": "peregrine-creds"
          }
        }
      ],
      "restart_policy": "Never"
    },
```
