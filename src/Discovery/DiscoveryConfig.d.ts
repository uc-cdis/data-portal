export interface DiscoveryConfig {
    public?: boolean // If false, requires user to sign in before seeing the Discovery page
    features: {
        exportToWorkspace: {
            enabled: boolean
            enableDownloadManifest: boolean
            downloadManifestButtonText?: string
            manifestFieldName: string
            enableDownloadZip: boolean
            downloadZipButtonText?: string
            verifyExternalLogins?: boolean
        }
        // explorationIntegration: {
        //     enabled: boolean // not supported
        // },
        // views: {
        //     gridView: {
        //         enabled: boolean // not supported
        //     }
        // },
        pageTitle: {
            enabled: boolean
            text: string
        }
        search: {
            searchBar: {
                enabled: boolean,
                inputSubtitle?: string,
                placeholder?: string
                searchableTextFields?: string[] // list of properties in data to make searchable.
                                                // if not present, only fields visible in the table
                                                // will be searchable.
            },
            tagSearchDropdown?: {
                enabled: boolean,
                collapsibleButtonText?: string
                collapseOnDefault?: boolean
            }
        },
        authorization: {
            enabled: boolean,
            // requestAccess: { // not supported
            //     enabled: boolean,
            //     type: 'global' | 'per_study' | 'both',
            //     global: {
            //         string: string
            //     },
            //     perStudy: {
            //         content_type: 'string',
            //         field: string
            //     }
            // }
        },
        advSearchFilters?: {
            enabled: boolean,
            field: string,
            filters: {
                key: string
                // multiSelectBehavior?: 'AND' | 'OR' // defaults to OR // not yet supported
                keyDisplayName?: string
                valueDisplayNames?: {
                    [value: string]: string
                }
            }[]
        }
    },
    aggregations: AggregationConfig[],
    tagSelector: {
        title?: string
        showTagCategoryNames?: boolean
    },
    tagColumnWidth?: string,
    studyColumns: {
        name: string
        field: string
        contentType?: 'string' | 'number' | 'link'
        errorIfNotAvailable?: boolean
        valueIfNotAvailable?: string | number
        ellipsis?: boolean
        width?: string | number
        hrefValueFromField?: 'string'
    }[],
    studyPreviewField: {
        name: string,
        field: string,
        contentType: 'string' | 'number' | 'paragraphs',
        includeName: boolean,
        includeIfNotAvailable: boolean,
        valueIfNotAvailable: string
    },
    studyPageFields: {
        // show_all_available_fields: boolean, // not supported
        header?: {
            field: string
        },
        downloadLinks?: {
            field: string
            name?: string
        },
        fieldsToShow: {
            groupName?: string
            groupWidth?: 'half' | 'full' // defaults to `'half'`
            // showBackground?: boolean // defaults to `true`
            includeName?: boolean,
            fields: StudyPageFieldConfig[]
        }[]
        // descriptionField: {
        //     name: string
        //     field: string
        //     includeIfNotAvailable?: boolean // defaults to false
        //     valueIfNotAvailable?: string[] // defaults to 'n/a'
        // }
    },
    minimalFieldMapping: {
        tagsListFieldName: string,
        authzField: string,
        dataAvailabilityField?: string,
        uid: string,
        commons?: string
    },
    tagCategories: {
        name: string,
        color?: string
        display: boolean
        displayName?: string
    }[],
    tagsDisplayName?: string
}
export interface StudyPageFieldConfig {
    name: string
    field: string
    contentType: 'string' | 'number' | 'paragraphs' | 'link' | 'tags'
    includeName?: boolean
    includeIfNotAvailable?: boolean
    valueIfNotAvailable?: string | number
}
export interface AggregationConfig {
  name: string
  field: string
  type: 'sum' | 'count'
}
