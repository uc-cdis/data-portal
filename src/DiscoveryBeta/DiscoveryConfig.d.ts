/* eslint-disable camelcase */
export interface DiscoveryConfig {
    features: {
        exploration_integration: {
            enabled: boolean
        },
        views: {
            grid_view: {
                enabled: boolean
            }
        },
        search: {
            search_bar: {
                enabled: boolean,
                search_tags: boolean,
                searchable_text_fields: string[],
            }
        },
        authorization: {
            enabled: boolean,
            request_access: {
                enabled: boolean,
                type: 'global' | 'per_study' | 'both',
                global: {
                    string: string
                },
                per_study: {
                    content_type: 'string',
                    field: string
                }
            }
        }
    },
    aggregations: [
        {
            name: string,
            field: string,
            type: 'count' | 'sum'
        }
    ],
    tag_selector: {
        title: string
    },
    study_columns: [
        {
            name: string
            field: string
            content_type?: 'string' | 'number'
            error_if_not_available?: boolean
            value_if_not_available?: string | number
        }
    ],
    study_preview_field: {
        name: string,
        field: string,
        content_type: 'string' | 'paragraphs',
        include_name: boolean,
        include_if_not_available: boolean,
        value_if_not_available: string
    },
    study_page_fields: {
        show_all_available_fields: boolean,
        header: {
            field: string
        },
        fields_to_show: [
            {
                group_name?: string
                include_name?: boolean,
                fields: [
                    {
                        name: string
                        field: string
                        content_type: 'string' | 'number'
                        include_name?: boolean
                        include_if_not_available?: boolean
                        value_if_not_available?: string | number
                    }
                ]
            }
        ]
    },
    minimal_field_mapping: {
        tags_list_field_name: string,
        authz_field: string,
        uid: string
    },
    tag_categories: [
        {
            name: string,
            color: string
            display: boolean
        }
    ]
}
