import React, { useState, useEffect, useMemo } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';
import { capitalize } from 'lodash';

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
    dictionary,
}: MDataDictionaryTableProps) => {
    const [categories, setCategories] = useState({});
    const [selectedId, setSelectedId] = useState('');
    // filters out ['_definitions', 'undefined', '_terms', 'data_release', 'metaschema', 'root']
    useEffect(() => {
        const categoryFilter = (id) => id.charAt(0) !== '_' && id === dictionary[id].id && dictionary[id].category && dictionary[id].id && dictionary[id].category.toLowerCase() !== 'internal';
        const filtered = Object.keys(dictionary).filter((id) => categoryFilter(id));
        const reduced = filtered.map((id) => dictionary[id]).reduce((d, property) => {
            if (!d[property.category]) {
                d[property.category] = [];
            }
            d[property.category].push(property);
            return d;
        }, {}) as MDataDictionaryCategory<MDataDictionaryProperty[]>;
        setCategories(reduced);
    }, [dictionary]);

    const columns = useMemo(
        () => ['property', 'type', 'required', 'description', 'term'].map((key) => ({
            accessorKey: key,
            header: key.toLocaleUpperCase(),
            Cell: ({ cell }) => (
                <>
                    {key === 'type' ? <>{<ul>{(cell.getValue()?.split(" ") || []).map((cell) => {
                        return <li>{cell}</li>
                    })}</ul>}</> : <span>{cell.getValue()}</span>}
                </>
            ),
        })),
        [],
    );

    const tableData = useMemo(() => {
        const keys = dictionary[selectedId]?.properties ? Object.keys(dictionary[selectedId].properties) : [];
        return keys.length ? keys.map((k) => {
            const { properties, required } = dictionary[selectedId];
            const row = properties[k];
            return {
                property: k.split('_').map((name) => capitalize(name)).join(' '),
                type: Object.keys(row).includes('anyOf') ? row.anyOf.map(({ type }) => type).join(" ") : row.type,
                required: required.includes(k) ? 'Required' : 'No',
                description: row?.description ?? row?.term?.description ?? 'No Description',
                term: '',
            };
        }) : [];
    }, [selectedId]);

    const handleSelect = (id) => {
        setSelectedId((i) => (i === id ? '' : id));
    };

    const table = useMantineReactTable({
        columns,
        data: tableData,
        enablePagination: false,
        enableBottomToolbar: false,
        enableTopToolbar: false
    });

    return (
        <React.Fragment>{Object.keys(categories).map((c) => (
            <div>
                <h2 style={{ color: "white", backgroundColor: "gray", border: "1px solid black", padding: "0 10px" }}>{c.split('_').map((name) => capitalize(name)).join(' ')}</h2>
                <div style={{ border: "1px solid black" }}>{categories[c].map(({ title, description, id }, key) => (
                    <div onClick={() => handleSelect(id)} style={{ display: "flex", flexDirection: "column", padding: 2 }}>
                        <div
                            key={key}
                            style={{ display: "flex", justifyContent: "space-between", borderBottom: key < categories[c].length - 1 ? "1px solid black" : 0 }}>
                            <div style={{ flexGrow: 0, flexShrink: 0, width: 260, padding: "0 10px" }}>{title}</div>
                            <div style={{ flexGrow: 1, padding: "0px 10px" }}>{description}</div>
                            <div style={{ display: "flex", fontSize: 12, flexGrow: 0, flexShrink: 0, justifyContent: "space-between" }}>
                                <button onClick={(e) => e.stopPropagation()} style={{ height: 30, width: 60, margin: "0 5px" }}>TSV</button>
                                <button onClick={(e) => e.stopPropagation()} style={{ height: 30, width: 60, margin: "0 5px" }}>JSON</button>
                            </div>
                        </div>
                        <div>
                            {selectedId === id ? (
                                <div onClick={(e) => e.stopPropagation()} key={selectedId}>
                                    <MantineReactTable table={table} />
                                </div>
                            ) : undefined}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        ))}
        </React.Fragment>
    );
};
