import React, { useState, useEffect, useMemo } from "react";
import {
    MantineReactTable,
    useMantineReactTable
} from 'mantine-react-table';
import { capitalize } from "lodash";

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
    const [selectedId, setSelectedId] = useState("");
    const [selectedData, setSelectedData] = useState([]);
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

    const columns = useMemo(
        () => ["property", "type", "required", "description", "term"].map((key) => {
            return {
                accessorKey: key,
                header: key.toLocaleUpperCase(),
                Cell: ({ cell }) => (
                    <span>{cell.getValue()}</span>
                ),
            }
        }),
        [],
    );

    const tableData = useMemo(() => {
        let keys = dictionary[selectedId]?.properties ? Object.keys(dictionary[selectedId].properties) : [];
        return keys.length ? keys.map((k) => {
            const { properties, required } = dictionary[selectedId];
            const row = properties[k];
            return {
                property: k.split("_").map((name) => capitalize(name)).join(" "),
                type: Object.keys(row).includes("anyOf") ? row.anyOf.map(({ type }) => type).join(" ") : row.type,
                required: required.includes(k) ? "Required" : "No",
                description: row?.description ?? row?.term?.description ?? "No Description",
                term: ""
            }
        }) : [];
    }, [selectedId]);

    const table = useMantineReactTable({ columns, data: tableData });

    return (<>{Object.keys(categories).map((c, key) => {
        return <div key={key}>
            <h1>{c.split("_").map((name) => capitalize(name)).join(" ")}</h1>
            <div>{categories[c].map(({ title, description, id }, key) => {
                return <>
                    <div key={key} onClick={() => {
                        setSelectedId((i) => i === id ? "" : id);
                    }}>
                        {title} {description}
                    </div>
                    {selectedId === id ? (<div key={selectedId}>
                        <MantineReactTable table={table} />
                    </div>) : undefined}</>
            })}</div>
        </div>
    })}</>)
}
