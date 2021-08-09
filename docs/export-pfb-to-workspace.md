# Export PFB to Workspace Button
------------------------
The Export PFB To Workspace button applies PFB as a handoff mechanism to send user-created virtual cohorts from the Data Explorer to the Workspace for programmatic user analysis. The design doc for this feature can be viewed here: https://docs.google.com/document/d/1954SSzVgDDM41uBksIt9RY7_MRAcCzoaMfmwHtfpFG4

-------
To enable the Export PFB to Workspace button in your commons, modify the explorerConfig (or dataExplorerConfig) block in your gitops.json file. Add a new button object to the list of buttons for that explorer tab.
```
{
    "enabled": true,
    "type": "export-pfb-to-workspace",
    "title": "Export PFB to Workspace",
    "leftIcon": "datafile",
    "rightIcon": "download"
},
```


Note: this button is not to be enabled in any commons without the appropriate versions of the fuse-sidecar, the manifestservice, and pelican. Some of these microservice versions are still pending merge. This document will be updated when all requirements have been merged and versioned.


-------
The advantages of using PFB as a handoff mechanism include:
- Built-in support for packaging of clinical data with the exported files -- researchers will be able to analyze the clinical data related to their virtual cohort in the same location as the mounted object files
- Adherence to a consistent interoperable file format -- PFB demonstrates versatility and convenience through integration across services
- Easily reproducible and shareable analyses -- researchers can share the PFB GUID for their cohort rather than the filters they applied in the explorer or the contents of their export


In contrast with the Export to Workspace button, the Export PFB to Workspace button places an additional parameter in the request to the pelican job that specifies that the PFB should be placed in indexd. This new parameter -- `access_format` -- specifies whether the generated PFB is to be returned to the caller as a presigned URL or as a GUID. This Export PFB to Workspace button sets `{ ‘access_format’: ‘<GUID>’ }` during the cohort creation step. The GUID is retrieved in a callback handler.

Windmill then makes a POST to the manifestservice at a new route, /manifests/cohorts, with the POST body
`{ 'guid' : '<cohort-guid>' }`

 The manifestservice will create a new file named with the value of the GUID for the PFB in the user's s3 folder:
```
s3://<manifest_service_bucket>/user-<user_id>/cohorts/<GUID>
```

Note that we create empty files using the PFB GUID as filename. The manifest service's GET / handler will return the filenames at `/user-<user-id>/cohorts` within a new "cohorts" key in its returned JSON.
```
GET /

Response: {
    "manifests" : [
        { "filename" : "manifest-2019-02-27T11-44-20.548126.json",
           "last_modified" : "2019-02-27 17:44:21" },
        ... ],
    "cohorts": [
        { "filename": "<GUID>", ... },
        ...]
}
```

The fuse-sidecar listens polls this endpoint. When a new GUID is found, the fuse-sidecar creates a presigned URL for the new PFB by querying Fence at /data/download/{GUID}. It is downloaded locally to `pd/data/<hostname>/cohort-<GUID>.pfb`.

The fuse-sidecar transforms the retrieved PFB file by applying the tools in the  pyPFB repo (https://github.com/uc-cdis/pypfb) to extract a list of GUIDs corresponding to object files to be mounted from the PFB in the usual manifest.json format that gen3-fuse expects. gen3-fuse then mounts the manifest to pd/data in the usual manner, this time to a mounted directory named like `pd/data/<hostname>/cohort-<GUID>-files/`

Note that in the resulting set of files, the original PFB is not a mounted file, but a file in local storage, just as the manifests themselves in the original flow are locally stored files. The folder `pd/data/<hostname>/cohort-<GUID>-files/` is the mounted folder.

The fuse-sidecar enforces no limit on the number of PFBs downloaded to a user’s notebook, although the number of mounts is still limited to 5. PFBs persist on the user volume at the discretion of the user even after their deletion from indexd.
