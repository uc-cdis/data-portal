import React, { useState, useEffect } from "react";

export interface MDataDictionaryTableProps {
    dictionary: any
}

export interface MDataDictionaryCategory<T> {
    [key: string]: T
}
export interface DDLink {
    backref: string;
    label: string;
    multiplicity: string;
    name: string;
    required: boolean;
    target_type: string;
}

export interface MDataDictionaryProperty {
    $schema: string;
    additionalProperties: boolean;
    category: string;
    description: string;
    id: string;
    links: DDLink[];
    namespace: string;
    nodeTerms: unknown | null
    program: string;
    project: string;
    properties: Record<string, any>;
    required: string[];
    submittable: boolean;
    systemProperties: string[];
    title: string;
    type: string;
    uniqueKeys: string[][];
    validators: unknown | null
}

export const MDataDictionaryTable: React.FC<MDataDictionaryTableProps> = ({
    dictionary
}: MDataDictionaryTableProps) => {
    const [categories, setCategories] = useState({});
    const [expandedCategory, setExpandedCategory] = useState("");
    // filters out ['_definitions', 'undefined', '_terms', 'data_release', 'metaschema', 'root']
    const categoryFilter = (id) => id.charAt(0) !== '_' && id === dictionary[id].id && dictionary[id].category && dictionary[id].id && dictionary[id].category.toLowerCase() !== "internal";

    useEffect(() => {
        const filtered = Object.keys(dictionary).filter((id) => categoryFilter(id));
        const reduced = filtered.map((id) => dictionary[id]).reduce((map, property) => {
            if (!map[property.category]) {
                map[property.category] = []
            }
            map[property.category].push(property)
            return map
        }, {}) as MDataDictionaryCategory<MDataDictionaryProperty[]>;
        setCategories(reduced);
    }, [dictionary]);

    return (<>{Object.keys(categories).map((c) => {
        return <div>
            <h1>{c}</h1>
            <div>{categories[c].map(({ title, description, id }) => {
                // todo columns for tables: "property", "type", "required", "description", "term"
                return <div onClick={() => setExpandedCategory((i) => i === id ? "" : id)}><div>{title} {description}</div>{expandedCategory === id ? <div>table</div> : undefined}</div>
            })}</div>
        </div>
    })}</>)

}
