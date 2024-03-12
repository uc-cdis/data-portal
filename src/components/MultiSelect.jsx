import { useState, useRef } from 'react';
import {
    Button,
    Dialog,
    DialogTrigger,
    Group,
    Popover,
    ListBox,
    ListBoxItem,    
} from 'react-aria-components';
import './MultiSelect.css';

function getKey(key, items) {
    return items.find((item) => item.id === key);
}

/** @typedef {{ id, text }[]} SelectItems */

/**
 * @typedef {Object} MultiSelectProps
 * @property {SelectItems} items
 * @property {(items: SelectItems) => void} onChange
 */

/** @param {MultiSelectProps} props */
export default function MultiSelect({ items, onChange }) {
    /** @type [Set, (any) => void] */
    let [selectedKeys, setSelectedKeys] = useState(new Set([]));
    let triggerElement = useRef(null);
    
    return <div className="react-aria-MultiSelect">
        <Group ref={triggerElement}>
            <DialogTrigger>
                    <Button className="react-aria-MultiSelect__current-values">
                        {/* current selected values */}
                        {([...selectedKeys]).map((key, index) => {
                            if (index+1 < selectedKeys.size) {
                                return`${getKey(key, items).text}, `;
                            } else {
                                return `${getKey(key, items).text}`;
                            }
                        })}
                    </Button>
                    <Button className="react-aria-MultiSelect-trigger">▼</Button>
                <Popover triggerRef={triggerElement} placement="bottom left">
                    <Dialog>
                        <ListBox
                            items={items}
                            selectionMode='multiple'
                            selectedKeys={selectedKeys}
                            onSelectionChange={(selection) => {
                                setSelectedKeys(selection);
                                onChange([...selection].map((key) => {
                                    return getKey(key, items);
                                }));
                            }}
                        >
                            {item => {
                                return <ListBoxItem id={item.id}>
                                    {item.text}
                                </ListBoxItem>;
                            }}
                        </ListBox>
                    </Dialog>
                </Popover>
            </DialogTrigger>
            <Button
                type="button"
                className="clear-button"
                aria-label="Clear"
                onPress={() => {
                    onChange([]);
                    setSelectedKeys(new Set([]))
                }}
            >
                ✕
            </Button>
        </Group>
    </div>;
}
