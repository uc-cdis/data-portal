# Portal Configurations

> Contents duplicated from https://github.com/uc-cdis/cdis-wiki/blob/master/dev/gen3/guides/ui_etl_configuration.md#portal-folder for public access

## The "portal config" file

Each Gen3 Commons has a JSON file which details what UI features should be deployed for a commons, and what the configuration for these features should be. This is commonly referred to as the "portal config" file. A "portal config" file usually locates at `/portal/gitops.json` in the manifest directory of a Commons. Portal also has some default config files under `/data/config` but most of them are legacy configurations.

Below is an example, with inline comments describing what each JSON block configures, as well as which properties are optional and which are required (if you are looking to copy/paste configuration as a start, please use something in the Github repo as the inline comments below will become an issue):

```
{
  "gaTrackingId": "xx-xxxxxxxxx-xxx", // required; the Google Analytics ID to track statistics
  "graphql": { // required; start of query section - these attributes must be in the dictionary
    "boardCounts": [ // required; graphQL fields to query for the homepage chart
      {
        "graphql": "_case_count", // required; graphQL field name for aggregate count
        "name": "Case", // required; human readable name of field
        "plural": "Cases" // required; human readable plural name of field
      },
      {
        "graphql": "_study_count",
        "name": "Study",
        "plural": "Studies"
      },
      {
        "graphql": "_aliquot_count",
        "name": "Aliquot",
        "plural": "Aliquots"
      }
    ],
    "chartCounts": [ // required;
      {
        "graphql": "_case_count",
        "name": "Case"
      },
      {
        "graphql": "_study_count",
        "name": "Study"
      }
    ],
    "projectDetails": "boardCounts" // required; which JSON block above to use for displaying aggregate properties on the submission page (www.project.io/submission)
  },
  "components": {
    "appName": "Gen3 Generic Data Commons", // required; title of commons that appears on the homepage
    "homepageHref": "https://example.gen3.org/", // optional; link that the logo in header will pointing to
    "homepageAltText": "A customized logo", // optional; alt text for logo images in header and footer
    "index": { // required; relates to the homepage
      "introduction": { // optional; text on homepage
        "heading": "", // optional; title of introduction
        "text": "This is an example Gen3 Data Commons", // optional; text of homepage
        "link": "/submission" // optional; link for button underneath the text
      },
      "buttons": [ // optional; button “cards” displayed on the bottom of the homepage
        {
          "name": "Define Data Field", // required; title of card
          "icon": "planning", // required; name of icon to display on card located in /img/icons
          "body": "Please study the dictionary before you start browsing.", // required; card text
          "link": "/DD", // required; link for button
          "label": "Learn more" // required; title of button that leads to link above
        },
        {
          "name": "Explore Data",
          "icon": "explore",
          "body": "Explore data interactively.",
          "link": "/explorer",
          "label": "Explore data"
        },
        {
          "name": "Analyze Data",
          "icon": "analyze",
          "body": "Analyze your selected cases using Jupyter Notebooks in our secure cloud environment.",
          "link": "/workspace",
          "label": "Run analysis"
        }
      ],
      "homepageChartNodes": [ // optional; used for tiered access on the homepage. This means that the charts on the homepage will be available to the public.
        {
          "node": "case", // required; GraphQL field name of node to show a chart for
          "name": "Cases" // required; plural human readable name of node
        },
        {
          "node": "study",
          "name": "Studies"
        },
        {
          "node": "aliquot",
          "name": "Aliquots"
        }
      ]
    },
    "navigation": { // required; details what should be in the navigation bar
      "items": [ // required; the buttons in the navigation bar
        {
          "icon": "dictionary", // required; icon from /img/icons for the button
          "link": "/DD", // required; the link for the button
          "color": "#a2a2a2", // optional; hex color of the icon
          "name": "Dictionary" // required; text for the button
        },
        {
          "icon": "exploration",
          "link": "/explorer",
          "color": "#a2a2a2",
          "name": "Exploration"
        },
        {
          "icon": "workspace",
          "link": "/workspace",
          "color": "#a2a2a2",
          "name": "Workspace"
        },
        {
          "icon": "profile",
          "link": "/identity",
          "color": "#a2a2a2",
          "name": "Profile"
        }
      ]
    },
    "topBar": { // required if useArboristUI is true, else optional
      "items": [
        {
          "icon": "upload",
          "link": "/submission",
          "name": "Submit Data"
        },
        {
          "link": "https://gen3.org/resources/user/",
          "name": "Documentation"
        }
      ],
      "useProfileDropdown": false // optional; enables expiremental profile UI; defaults false, may change in future releases
    },
    "login": { // required; what is displayed on the login page (/login)
      "title": "Gen3 Generic Data Commons", // optional; title for the login page
      "subTitle": "Explore, Analyze, and Share Data", // optional; subtitle for login page
      "text": "This is a generic Gen3 data commons.", // optional; text on the login page
      "contact": "If you have any questions about access or the registration process, please contact ", // optional; text for the contact section of the login page
      "email": "support@datacommons.io", // optional; email for contact
      "image": "gene" // optional; images displayed on the login page
    },
    "footerLogos": [ // optional; logos to be displayed in the footer, usually sponsors
      {
        "src": "/src/img/gen3.png", // required; src path for the image
        "href": "https://ctds.uchicago.edu/gen3", // required; link for image
        "alt": "Gen3 Data Commons" // required; alternate text if image won’t load
      },
      {
        "src": "/src/img/createdby.png",
        "href": "https://ctds.uchicago.edu/",
        "alt": "Center for Translational Data Science at the University of Chicago"
      }
    ],
    "categorical9Colors": ["#c02f42", "#175676", "#59CD90", "#F2DC5D", "#40476D", "#FFA630", "#AE8799", "#1A535C", "#462255"], // optional; colors for the graphs both on the homepage and on the explorer page (will be used in order)
    "categorical2Colors": ["#6d6e70", "#c02f42"] // optional; colors for the graphs when there are only 2 colors (bar and pie graphs usually)
  },
  "requiredCerts": [], // optional; do users need to take a quiz or agree to something before they can access the site?
  "featureFlags": { // optional; will hide certain parts of the site if needed
    "explorer": true, // required; indicates the flag and whether to hide it or not
    "explorerPublic": true // optional; If set to true, the data explorer page would be treated as a public component and can be accessed without login. Data explorer page would be public accessible if 1. tiered access level is set to libre OR 2. this explorerPublic flag is set to true.
  },
  "dataExplorerConfig": { // required; configuration for the Data Explorer (/explorer)
    "charts": { // optional; indicates which charts to display in the Data Explorer
      "project_id": { // required; GraphQL field to query for a chart (ex: this one will display the number of projects, based on the project_id)
        "chartType": "count", // required; indicates this chart will display a “count”
        "title": "Projects" // required; title to display on the chart
      },
      "case_id": {
        "chartType": "count",
        "title": "Cases"
      },
      "gender": {
        "chartType": "pie", // required; pie chart type
        "title": "Gender"
      },
      "race": {
        "chartType": "bar", // required; bar chart type
        "title": "Race"
      },
    },
    "filters": { // required; details facet configuration for the Data Explorer
      "tabs": [ // required; divides facets into tabs
        {
          "title": "Diagnosis", // required; title of the tab
          "fields": [ // GraphQL fields (node attributes) to list out facets
            "diastolic_blood_pressure",
            "systolic_blood_pressure",
          ]
        },
        {
          "title": "Case",
          "fields": [
            "project_id",
            "race",
            "ethnicity",
            "gender",
            "bmi",
            "age_at_index"
          ]
        }
      ]
    },
    "table": { // required; configuration for Data Explorer table
      "enabled": true, // required; indicates if the table should be enabled or not by default
      "fields": [ // required; fields (node attributes) to include to be displayed in the table
        "project_id",
        "race",
        "ethnicity",
        "gender",
        "bmi",
        "age_at_index",
        "diastolic_blood_pressure",
        "systolic_blood_pressure",
        "url"
      ],
      "linkFields": [ // optional; fields (must exist in "field" list above) to display as clickable buttons
        "url"
      ]
    },
    "dropdowns": { // optional; lists dropdowns if you want to combine multiple buttons into one dropdown (ie. Download dropdown has Download Manifest and Download Clinical Data as options)
      "download": { // required; id of dropdown button
        "title": "Download" // required; title of dropdown button
      }
    },
    "buttons": [ // required; buttons for Data Explorer
      {
        "enabled": true, // required; if the button is enabled or disabled
        "type": "data", // required; button type - what should it do? Data = downloading clinical data
        "title": "Download All Clinical", // required; title of button
        "leftIcon": "user", // optional; icon on left from /img/icons
        "rightIcon": "download", // optional; icon on right from /img/icons
        "fileName": "clinical.json", // required; file name when it is downloaded
        "dropdownId": "download" // optional; if putting into a dropdown, the dropdown id
      },
      {
        "enabled": true,
        "type": "manifest", // required; manifest = create file manifest type
        "title": "Download Manifest",
        "leftIcon": "datafile",
        "rightIcon": "download",
        "fileName": "manifest.json",
        "dropdownId": "download"
      },
      {
        "enabled": true,
        "type": "export", // required; export = export to Terra type
        "title": "Export All to Terra",
        "rightIcon": "external-link"
      },
      {
        "enabled": true,
        "type": "export-to-pfb", // required; export-to-pfb = export to PFB type
        "title": "Export to PFB",
        "leftIcon": "datafile",
        "rightIcon": "download"
      },
      {
        "enabled": true,
        "type": "export-to-workspace", // required; export-to-workspace = export to workspace type
        "title": "Export to Workspace",
        "leftIcon": "datafile",
        "rightIcon": "download"
      }
    ],
    "guppyConfig": { // required; how to configure Guppy to work with the Data Explorer
      "dataType": "case", // required; must match the index “type” in the guppy configuration block in the manifest.json
      "nodeCountTitle": "Cases", // required; plural of root node
      "fieldMapping": [ // optional; a way to rename GraphQL fields to be more human readable
        { "field": "consent_codes", "name": "Data Use Restriction" },
        { "field": "bmi", "name": "BMI" }
      ],
      "manifestMapping": { // optional; how to configure the mapping between cases/subjects/participants and files. This is used to export or download files that are associated with a cohort. It is basically joining two indices on specific GraphQL fields
        "resourceIndexType": "file", // required; what is the type of the index (must match the guppy config block in manifest.json) that contains the resources you want a manifest of?
        "resourceIdField": "object_id", // required; what is the identifier in the manifest index that you want to grab?
        "referenceIdFieldInResourceIndex": "case_id", // required; what is the field in the manifest index you want to make sure matches a field in the cohort?
        "referenceIdFieldInDataIndex": "case_id" // required; what is the field in the case/subject/participant index you are using to match with a field in the manifest index?
      },
      "accessibleFieldCheckList": ["project_id"], // optional; only useful when tiered access is enabled (tier_access_level=regular). When tiered access is on, portal needs to perform some filtering to display data explorer UI components according to user’s accessibility. Guppy will make queries for each of the fields listed in this array and figure out for each fields, what values are accessible to the current user and what values are not.
      "accessibleValidationField": "project_id" // optional; only useful when tiered access is enabled (tier_access_level=regular). This value should be selected from the “accessibleFieldCheckList” variable. Portal will use this field to check against the result returned from Guppy with “accessibleFieldCheckList” to determine if user has selected any unaccessible values on the UI, and changes UI appearance accordingly.
    },
    "getAccessButtonLink": "https://dbgap.ncbi.nlm.nih.gov/", // optional; for tiered access, if a user wants to get access to the data sets what site should they visit?
    "terraExportURL": "https://bvdp-saturn-dev.appspot.com/#import-data" // optional; if exporting to Terra which URL should we use?
  },
  "fileExplorerConfig": { // optional; configuration for the File Explorer
    "charts": { // optional; indicates which charts to display in the File Explorer
      "data_type": { // required; GraphQL field to query for a chart (ex: this one will display a bar chart for data types of the files in the cohort)
        "chartType": "stackedBar", // required; chart type of stack bar
        "title": "File Type" // required; title of chart
      },
      "data_format": {
        "chartType": "stackedBar",
        "title": "File Format"
      }
    },
    "filters": { // required; details facet configuration for the File Explorer
      "tabs": [ // required; divides facets into tabs
        {
          "title": "File", // required; title of the tab
          "fields": [ // required; GraphQL fields (node attributes) to list out facets
            "project_id",
            "data_type",
            "data_format"
          ]
        }
      ]
    },
    "table": { // required; configuration for File Explorer table
      "enabled": true, // required; indicates if the table should be enabled by default
      "fields": [ // required; fields (node attributes) to include to be displayed in the table
        "project_id",
        "file_name",
        "file_size",
        "object_id"
      ]
    },
    "guppyConfig": { // required; how to configure Guppy to work with the File Explorer
      "dataType": "file", // required; must match the index “type” in the guppy configuration block in the manifest.json
      "fieldMapping": [ // optional; a way to rename GraphQL fields to be more human readable
        { "field": "object_id", "name": "GUID" } // required; the file index should always include this one
      ],
      "nodeCountTitle": "Files", // required; plural of root node
      "manifestMapping": { // optional; how to configure the mapping between cases/subjects/participants and files. This is used to export or download files that are associated with a cohort. It is basically joining two indices on specific GraphQL fields
        "resourceIndexType": "case", // required; joining this index with the case index
        "resourceIdField": "case_id", // required; which field should is the main identifier in the other index?
        "referenceIdFieldInResourceIndex": "object_id", // required; which field should we join on in the other index?
        "referenceIdFieldInDataIndex": "object_id" // required; which field should we join on in the current index?
      },
      "accessibleFieldCheckList": ["project_id"],
      "accessibleValidationField": "project_id",
      "downloadAccessor": "object_id" // required; for downloading a file, what is the GUID? This should probably not change
    },
    "buttons": [ // required; buttons for File Explorer
      {
        "enabled": true, // required; determines if the button is enabled or disabled
        "type": "file-manifest", // required; button type - file-manifest is for downloading a manifest from the file index
        "title": "Download Manifest", // required; title of the button
        "leftIcon": "datafile", // optional; button’s left icon
        "rightIcon": "download", // optional; button’s right icon
        "fileName": "file-manifest.json", // required; name of downloaded file
      },
      {
        "enabled": true,
        "type": "export-files-to-workspace", // required; this type is for export files to the workspace from the File Explorer
        "title": "Export to Workspace",
        "leftIcon": "datafile",
        "rightIcon": "download"
      }
    ],
    "dropdowns": {} // optional; dropdown groupings for buttons
  },
  "resourceBrowser": {), // see Resource Browser documentation
  "workspacePageDescription": "", // text to display above the workspace options
  "useArboristUI": false, // optional; set true to enable arborist UI; defaults to false if absent
  "showArboristAuthzOnProfile": false, // optional; set true to list arborist resources on profile page
  "showFenceAuthzOnProfile": true, // optional; set false to not list fence project access on profile page
  "componentToResourceMapping": { // optional; configure some parts of arborist UI
    "Workspace": { // name of component as defined in this file
      "resource": "/workspace", // ABAC fields defining permissions required to see this component
      "method": "access",
      "service": "jupyterhub"
    },
    "Analyze Data": {
      "resource": "/workspace",
      "method": "access",
      "service": "jupyterhub"
    },
    "Query": {
      "resource": "/query_page",
      "method": "access",
      "service": "query_page"
    },
    "Query Data": {
      "resource": "/query_page",
      "method": "access",
      "service": "query_page"
    }
  }
}
```
