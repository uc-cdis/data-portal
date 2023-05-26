### File mapping configuration
Windmill lists unmapped files by checking Indexd. Before centralized auth's deployment, a file was determined to be
unmapped by checking if the acl field was null. After centralized auth, we use the authz field instead. The manifest.json
configuration setting `use_indexd_authz` specifies which of the two fields should be used. This field defaults to false.
```
"global": {
    ...
    "use_indexd_authz": "true"
  },
```
