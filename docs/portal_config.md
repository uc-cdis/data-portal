# Portal Configurations

> Contents duplicated from https://github.com/uc-cdis/cdis-wiki/blob/master/dev/gen3/guides/ui_etl_configuration.md#portal-folder for public access

## The "portal config" file

Each Gen3 Commons has a JSON file which details what UI features should be deployed for a commons, and what the configuration for these features should be. This is commonly referred to as the "portal config" file. A "portal config" file usually locates at `/portal/gitops.json` in the manifest directory of a Commons. Portal also has some default config files under `/data/config` but most of them are legacy configurations.

Below is an example, with inline comments describing what each JSON block configures, as well as which properties are optional and which are required (if you are looking to copy/paste configuration as a start, please use something in the Github repo as the inline comments below will become an issue):

```
{
  "gaTrackingId": "xx-xxxxxxxxx-xxx", // optional; the Google Analytics ID to track statistics
  "ddEnv": "DEV", // optional; the Datadog RUM option specifying the application’s environment, for example: prod, pre-prod, staging, etc. Can be determined automatically if omitted
  "ddSampleRate": 100, // optional; numeric; the Datadog RUM option specifying the percentage of sessions to track: 100 for all, 0 for none. Default to 100 if omitted
  "DAPTrackingURL": "https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=AGENCY&subagency=SUB", // optional, for adding DAP tracking feature if specified (see https://github.com/digital-analytics-program/gov-wide-code#participating-in-the-dap)
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
    ],systemUseTitle
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
   "systemUse" : { // optional; will show a Use Message in a popup, to inform users of the use policy of the commons. It will display a message which requires acceptance before a user can use the site.
      "systemUseTitle" : "", // required; Title of the popup dialog
      "systemUseText" : [""] // required; Message to show in a popup which is used to notify the user of site policy and use restrictions
      "expireUseMsgDays" : optional; 0, // the number of days to keep cookie once the "Accept" button is clicked, the default is 0 which sets the cookie to be a browser session cookie
    },
    "footer": {
      "links": [
        {
          "text": "Link title",
          "href": "https://example.com"
        }
      ]
    },
    "footerLogos": [ // optional; logos to be displayed in the footer, usually sponsors
      {
        "src": "/src/img/gen3.png", // required; src path for the image
        "href": "https://ctds.uchicago.edu/gen3", // required; link for image
        // The alt text for certain cross-commons logos, such as the Gen3 and CTDS logos, are non-configurable so as to avoid redundancy.
        // Note that this alt text is applied on the basis of link destination, not logo filename.
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
    "explorerPublic": true // optional; If set to true, the data explorer page would be treated as a public component and can be accessed without login. The Data Explorer page would be publicly accessible if 1. tiered access level is set to libre OR 2. this explorerPublic flag is set to true.
    "discovery": true, // optional; whether to enable the Discovery page. If true, `discoveryConfig` must be present as well.
    "discoveryUseAggMDS": true // optional, false by default; if true, the Discovery page will use the Aggregate Metadata path instead of the Metadata path. This causes the Discovery page to serve as an "Ecosystem Browser". See docs/ecosystem_browser.md for more details.
    "explorerStoreFilterInURL": true, // optional; whether to store/load applied filters in the URL during Data Explorer use.
    This feature currently supports single select filters and range filters; it
    lacks support for search filter state, accessibility state, table state.
    "explorerHideEmptyFilterSection": false, // optional, when filtering data hide FilterSection when they are empty.
    "explorerFilterValuesToHide": ["array of strings"], // optional, Values set in array will be hidden in guppy filters. Intended use is to hide missing data category from filters, for this it should be set to the same as `missing_data_alias` in Guppy server config
  },
  "dataExplorerConfig": { // required only if featureFlags.explorer is true; configuration for the Data Explorer (/explorer); can be replaced by explorerConfig, see Multi Tab Explorer doc
    "charts": { // optional; indicates which charts to display in the Data Explorer
      // Note that the fields configured in `charts` must be present in the `filters` section as well
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
      "ethnicity": {
        "chartType": "fullPie", // required; full pie chart type
        "title": "Ethnicity"
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
      "fields": [ // optional; fields (node attributes) to include to be displayed in the table
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
    "buttons": [ // optional; buttons for Data Explorer
      {
        "enabled": true, // required; if the button is enabled or disabled
        "type": "data", // required; button data type sub-options (case insensitive): ["data" (default), "data-tsv", "data-csv", "data-json"] - what should it do? Data = downloading default clinical JSON data
        "title": "Download All Clinical", // required; title of button
        "leftIcon": "user", // optional; icon on left from /img/icons
        "rightIcon": "download", // optional; icon on right from /img/icons
        "fileName": "clinical.json", // required; file name when it is downloaded (set file ext. to default json)
        "dropdownId": "download" // optional; if putting into a dropdown, the dropdown id
      },
      {
        "enabled": true, // required; if the button is enabled or disabled
        "type": "data-tsv", // required; button data type - what should it do? Data = downloading clinical TSV data
        "title": "TSV", // required; title of button
        "leftIcon": "datafile", // optional; icon on left from /img/icons
        "rightIcon": "download", // optional; icon on right from /img/icons
        "fileName": "clinical.tsv", // required; file name when it is downloaded (file ext. should match data type)
        "dropdownId": "download" // optional; if putting into a dropdown, the dropdown id
      },
      {
        "enabled": true, // required; if the button is enabled or disabled
        "type": "data-csv", // required; button data type - what should it do? Data = downloading clinical CSV data
        "title": "CSV", // required; title of button
        "leftIcon": "datafile", // optional; icon on left from /img/icons
        "rightIcon": "download", // optional; icon on right from /img/icons
        "fileName": "clinical.csv", // required; file name when it is downloaded (file ext. should match data type)
        "dropdownId": "download" // optional; if putting into a dropdown, the dropdown id
      },
      {
        "enabled": true, // required; if the button is enabled or disabled
        "type": "data-json", // required; (equivalent to just "data" but we add it for consistency) button data type - what should it do? Data = downloading clinical JSON data
        "title": "JSON", // required; title of button
        "leftIcon": "datafile", // optional; icon on left from /img/icons
        "rightIcon": "download", // optional; icon on right from /img/icons
        "fileName": "clinical.json", // required; file name when it is downloaded (file ext. should match data type)
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
        "type": "export-pfb-to-url", // export PFB to arbitrary URL; see docs/export_pfb_to_url.md
        "targetURLTemplate": "https://terra.biodatacatalyst.nhlbi.nih.gov/#import-data?url={{PRESIGNED_URL}}", // required if type is `export-pfb-to-url`; `{{PRESIGNED_URL}}` is a required template variable which is replaced by the presigned URL of the exported PFB
        "title": "Export All to Terra",
        "rightIcon": "external-link"
      },
      {
        "enabled": true,
        "type": "export-to-workspace", // required; export-to-workspace = export to workspace type
        "title": "Export to Workspace",
        "leftIcon": "datafile",
        "rightIcon": "download"
      },
      {
        "enabled": true,
        "type": "export-pfb-to-workspace", // required; export PFB to workspace
        "title": "Export PFB to Workspace",
        "leftIcon": "datafile",
        "rightIcon": "download"
      }
    ],
    "loginForDownload": true, //optional; redirects user to login page if they tries to download data without logging in.
    "guppyConfig": { // required; how to configure Guppy to work with the Data Explorer
      "dataType": "case", // required; must match the index “type” in the guppy configuration block in the manifest.json
      "tierAccessLevel": "regular", // optional; must match the index “tier_access_level” in the guppy configuration block in the manifest.json; see data-portal and guppy READMEs for more information
      "nodeCountTitle": "Cases", // optional; If omitted, will default to use plural of `guppyConfig.dataType` of this tab.
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
  "fileExplorerConfig": { // optional; configuration for the File Explorer; can be replaced by explorerConfig, see Multi Tab Explorer doc
    "charts": { // optional; indicates which charts to display in the File Explorer
      // Note that the fields configured in `charts` must be present in the `filters` section as well
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
      "nodeCountTitle": "Files", // optional; If omitted, will default to use plural of `guppyConfig.dataType` of this tab.
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
    "buttons": [ // optional; buttons for File Explorer
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
  "discoveryConfig": { // config for Discovery page. Required if 'featureFlags.discovery' is true. See src/Discovery/DiscoveryConfig.d.ts for Typescript schema.
    "requireLogin": false, // optional, defaults to false. If true, requires user to sign in before seeing the Discovery page
    "public": true, // optional, defaults to true. If false, requires user to sign in before seeing the Discovery page
    "features": {
      "exportToWorkspace": { // configures the export to workspace feature. If enabled, the Discovery page data must contain a field which is a list of GUIDs for each study. See `manifestFieldName`
          "enable": boolean
          "enableDownloadManifest": boolean // enables a button which allows user to download a manifest file for gen3 client
          "downloadManifestButtonText": string // text to be displayed on the download manifest button
          "manifestFieldName": string // the field in the Discovery page data that contains the list of GUIDs that link to each study's data files.
          "documentationLinks": {
              "gen3Client": string // link to documentation about the gen3 client. Used for button tooltips
              "gen3Workspaces": string // link to documentation about gen3 workspaces. Used for button tooltips.
          }
      },
      "pageTitle": {
        "enabled": true,
        "text": "My Special Test Discovery Page"
      },
      "search": {
        "searchBar": {
          "enabled": true,
          "inputSubtitle": "Search Bar", // optional, subtitle of search bar
          "placeholder": "Search studies by keyword", // optional, placeholder text of search input
          "searchableTextFields": ["study", "age", "publication"] // optional, list of properties in data to make searchable
                                                                  // if not present, only fields visible in the table will be searchable
        },
        "tagSearchDropdown": { // optional, config section for searchable tags
          "enabled": true,
          "collapseOnDefault": false, // optional, whether the searchable tag panel is collapsed when loading, default value is "true"
          "collapsibleButtonText": "Study Characteristics" // optional, display text for the searchable tag panel collapse control button, default value is "Tag Panel"
        }
      },
      "advSearchFilters": {
        "enabled": true
      },
      "authorization": {
        "enabled": true // toggles whether Discovery page displays users' access to studies. If true, 'useArboristUI' must also be set to true.
      }
    },
    "aggregations": [ // configures the statistics at the top of the discovery page (e.g. 'XX Studies', 'XX,XXX Subjects')
      {
        "name": "Studies",
        "field": "study_id",
        "type": "count" // count of rows in data where `field` is non-empty
      },
      {
        "name": "Total Subjects",
        "field": "_subjects_count",
        "type": "sum" // sums together all numeric values in `row[field]`. `field` must be a numeric field.
      }
    ],
    "tagSelector": {
      "title": "Associated tags organized by category"
    },
    "studyColumns": [ // configures the columns of the table of studies.
      {
        "name": "Study Name",
        "field": "name"
      },
      {
        "name": "Full Name",
        "field": "full_name",
        "contentType": "string", // contentType: string displays the content of the field without formatting.
        "width": 300 // optional, if set with a value, will set width of this column, can be used independently or together with "ellipsis"
      },
      {
        "name": "Number of Subjects",
        "field": "_subjects_count",
        "errorIfNotAvailable": false,
        "valueIfNotAvailable": "n/a",
        "contentType": "number" // contentType: number displays the content of the field formatted with Number.toLocaleString() (e.g. `72209` -> `"72,209"`)
      },
      {
        "name": "Long Text",
        "field": "long_text",
        "contentType": "string",
        "ellipsis": true // optional, if set to true, long content will be truncate into ellipsis cell content
      },
      {
        "name": "dbGaP Accession Number",
        "field": "study_id"
      },
      {
        "name": "Commons",
        "field": "commons_of_origin",
        "hrefValueFromField": "commons_url", // If this attribute is present, the text in the column will be linked. The href value of the link will be the corresponding value of the fieldname in this attribute.
      }
    ],
    "studyPreviewField": { // if present, studyPreviewField shows a special preview field beneath each row of data in the table, useful for study descriptions.
      "name": "Description",
      "field": "study_description",
      "contentType": "string",
      "includeName": false,
      "includeIfNotAvailable": true,
      "valueIfNotAvailable": "No description has been provided for this study."
    },
    "studyPageFields": { // studyPageFields configures the fields that are displayed when a user opens a study page by clicking on a row in the table.
      "header": { // if present, shows a header field at the top of the study page.
        "field": "name"
      },
      "fieldsToShow": [ // fields on the study page are grouped in order to separate logically distinct groups of fields
        {
          "groupName": "Study Identifiers",
          "includeName": true,
          "fields": [
            {
              "name": "Number of Subjects",
              "field": "_subjects_count",
              "contentType": "number" // contentType: number displays the content of the field formatted with Number.toLocaleString() (e.g. `72209` -> `"72,209"`)

            },
            {
              "name": "Full Name",
              "field": "full_name",
              "contentType": "string" // contentType: string displays the content of the field without formatting.

            },
            {
              "name": "Short Name",
              "field": "short_name",
              "contentType": "string",
              "includeName": true,
              "includeIfNotAvailable": true,
              "valueIfNotAvailable": "N/A"
            },
            {
              "name": "dbGaP Study Accession",
              "field": "dbgap_accession",
              "contentType": "string",
              "includeName": true,
              "includeIfNotAvailable": false
            },
            {
              "name": "Project ID",
              "field": "project_id",
              "contentType": "string",
              "includeIfNotAvailable": false
            }
          ]
        },
        {
          "fields": [
            {
              "name": "Description",
              "field": "study_description",
              "contentType": "paragraphs", // contentType: paragraphs works like contentType: string except it correctly displays newline characters ('\n') as line breaks.
              "includeName": false,
              "includeIfNotAvailable": true,
              "valueIfNotAvailable": "No description has been provided for this study."
            }
          ]
        }
      ]
    },
    "minimalFieldMapping": { // maps
      "tagsListFieldName": "tags", // required; the field which contains the list of tags (format: [{name: string, category: string}] )
      "authzField": "authz", // optional if features.authorization.enabled is false, otherwise required
      "dataAvailabilityField": "data_availability", // optional, for checking if a study has data pending to be available
      "uid": "study_id" // required; a unique identifier for each study. Can be any unique value and does not have to have any special meaning (eg does not need to be a GUID)
    },
    "tagCategories": [ // configures the categories displayed in the tag selector. If a tag category appears in the `tagsListFieldName` field but is not configured here, it will not be displayed in the tag selector.
      {
        "name": "Program", // this configures the tag category name that will be shown on the tag selector
        "color": "rgba(129, 211, 248, 1)", // color can be any vaid CSS color string, including hex, rgb, rgba, hsl
        "display": true,
        "displayName": "All Programs" // optional string to customize tag category display name
      },
      {
        "name": "Study Registration",
        "color": "rgba(236, 128, 141, 1)",
        "display": true
      },
      {
        "name": "Data Type",
        "color": "rgba(112, 182, 3, 1)",
        "display": true
      }
    ],
    "tagsDisplayName": "Tags" // optional, overrides the name of the mandatory tags column
  },
  "resourceBrowser": {), // see Resource Browser documentation
  "workspacePageTitle": "", // title to display above workspacePageDescription
  "workspacePageDescription": "", // html to display above the workspace options
  "studyViewerConfig": [],//See docs/study_viewer.md for more details.
  "useArboristUI": false, // optional; set true to enable Arborist UI; defaults to false if absent
  "hideSubmissionIfIneligible": true, // optional; only works if Arborist UI is enabled; if set to true, link/buttons to /submission page will be hidden to users who don't have permissions to submit data; defaults to false if absent
  "showArboristAuthzOnProfile": false, // optional; set true to list Arborist resources on profile page
  "showFenceAuthzOnProfile": true, // optional; set false to not list fence project access on profile page
  "showExternalLoginsOnProfile": false, // enable WTS OIDC logins via the profile page
  "componentToResourceMapping": { // optional; configure some parts of Arborist UI
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
  },
  "connectSrcCSPWhitelist": [ // optional; Array of urls to add to the header CSP (Content-Security-Policy) connect-src 'self'
    "https://example.s3.amazonaws.com" // full url to be added
  ]
}
```
