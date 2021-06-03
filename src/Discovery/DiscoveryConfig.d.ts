export interface DiscoveryConfig {
    public?: boolean // If false, requires user to sign in before seeing the Discovery page
    features: {
        exportToWorkspaceBETA: {
            enabled: boolean
            enableDownloadManifest: boolean
            manifestFieldName: string
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
                placeholder?: string
                // searchTags: boolean, // not supported, consider removing
                // searchableTextFields: string[], // not supported, consider removing
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
        }
    },
    aggregations: AggregationConfig[],
    tagSelector: {
        title: string
    },
    tagColumnWidth: string,
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
            includeName?: boolean,
            fields: StudyPageFieldConfig[]
        }[]
    },
    minimalFieldMapping: {
        tagsListFieldName: string,
        authzField: string,
        uid: string,
        commons: string
    },
    tagCategories: {
        name: string,
        color: string
        display: boolean
    }[]
}
export interface StudyPageFieldConfig {
    name: string
    field: string
    contentType: 'string' | 'number' | 'paragraphs' | 'link'
    includeName?: boolean
    includeIfNotAvailable?: boolean
    valueIfNotAvailable?: string | number
}
export interface AggregationConfig {
  name: string
  field: string
  type: 'sum' | 'count'
}
