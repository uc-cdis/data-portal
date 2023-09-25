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
                <span>{cell.getValue()}</span>
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
                type: Object.keys(row).includes('anyOf') ? row.anyOf.map(({ type }) => type).join(' ') : row.type,
                required: required.includes(k) ? 'Required' : 'No',
                description: row?.description ?? row?.term?.description ?? 'No Description',
                term: '',
            };
        }) : [];
    }, [selectedId]);

    const handleSelect = (id) => {
        setSelectedId((i) => (i === id ? '' : id));
    };

    const table = useMantineReactTable({ columns, data: tableData });

    return (
        <React.Fragment>{Object.keys(categories).map((c) => (
            <div>
                <h1>{c.split('_').map((name) => capitalize(name)).join(' ')}</h1>
                <div>{categories[c].map(({ title, description, id }, key) => (
                    <React.Fragment>
                        <div
                            key={key}
                            onClick={() => handleSelect(id)}
                            onKeyDown={() => handleSelect(id)}
                        >
                            {title} {description}
                        </div>
                        {selectedId === id ? (
                            <div key={selectedId}>
                                <MantineReactTable table={table} />
                            </div>
                        ) : undefined}
                    </React.Fragment>
                ))}
                </div>
            </div>
        ))}
        </React.Fragment>
    );
};
