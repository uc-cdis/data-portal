import React, { useState, useEffect, useMemo } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';
import { capitalize } from 'lodash';
// import { saveAs } from 'file-saver';
import { getCategoryColor, getCategoryIconSVG } from '../../NodeCategories/helper';
import { downloadTemplate } from '../../utils';

export interface MDataDictionaryTableProps {
    dictionary: any;
    dictionaryName: string;
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
    dictionaryName
}: MDataDictionaryTableProps) => {
    const [categories, setCategories] = useState({});
    const [selectedId, setSelectedId] = useState('');
    // filters out ['_definitions', 'undefined', '_terms', 'data_release', 'metaschema', 'root']
    const categoryFilter = (id) => id.charAt(0) !== '_' && id === dictionary[id].id && dictionary[id].category && dictionary[id].id && dictionary[id].category.toLowerCase() !== 'internal';

    useEffect(() => {
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
    const visibleCategories = Object.keys(dictionary).filter((id) => categoryFilter(id));
    return (
        <>
            <span>{`${dictionaryName} dictionary has ${visibleCategories.length} nodes and ${visibleCategories.map((n) => Object.keys(dictionary[n]?.properties)?.length ?? 0).reduce((acc, curr) => acc + curr)} properties`}</span>
            <React.Fragment>{Object.keys(categories).map((c) => {
                const IconSVG = getCategoryIconSVG(c);
                return (
                    <div style={{ borderLeft: `4px solid ${getCategoryColor(c)}`, marginTop: 10 }}>
                        <h4 style={{ display: "flex", color: "white", backgroundColor: "black", border: "1px solid black", marginBottom: 0, height: 40, justifyContent: "space-between" }}>
                            <div style={{ display: "flex" }}>
                                <div style={{ padding: 10, verticalAlign: "middle" }}><IconSVG /></div>
                                <div style={{ padding: 5, marginLeft: 0 }}>{c.split('_').map((name) => capitalize(name)).join(' ')}</div>
                            </div>
                            <div style={{ padding: 5, verticalAlign: "middle" }}>Download Template</div>
                        </h4>
                        <div style={{ border: "1px solid black", borderLeft: 0 }}>{categories[c].map(({ title, description, id }, key) => (
                            <div onClick={() => handleSelect(id)} style={{ display: "flex", flexDirection: "column", padding: 2 }}>
                                <div
                                    key={key}
                                    style={{ display: "flex", justifyContent: "space-between", borderBottom: key < categories[c].length - 1 ? "1px solid black" : 0, backgroundColor: "white" }}>
                                    {/* TODO add text color highlighting on hover */}
                                    <div style={{ flexGrow: 0, flexShrink: 0, width: 260, padding: 10 }}>{title}</div>
                                    <div style={{ flexGrow: 1 }}>{description}</div>
                                    <div style={{ display: "flex", fontSize: 12, flexGrow: 0, flexShrink: 0, justifyContent: "space-between", verticalAlign: "middle", paddingTop: 5 }}>
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            downloadTemplate(e, 'json')
                                        }} style={{ height: 30, width: 60, margin: "0 5px", color: "white", backgroundColor: "#4981C3" }}>JSON</button>
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            downloadTemplate(e, 'tsv')
                                        }} style={{ height: 30, width: 60, margin: "0 5px", color: "white", backgroundColor: "#4981C3" }}>TSV</button>
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
                )
            })}
            </React.Fragment>
        </>
    );
};
