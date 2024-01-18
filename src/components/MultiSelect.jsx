import {
    Button,
    ComboBox,
    Input,
    Label,
    ListBox,
    ListBoxItem,
    Popover
} from 'react-aria-components';
import './MultiSelect.css';

export default function MultiSelect() {
    return <ComboBox>
        <div>
            <Input />
            <Button>▼</Button>
        </div>
        <Popover>
            <ListBox>
                <ListBoxItem>Aardvark</ListBoxItem>
                <ListBoxItem>Cat</ListBoxItem>
                <ListBoxItem>Dog</ListBoxItem>
                <ListBoxItem>Kangaroo</ListBoxItem>
                <ListBoxItem>Panda</ListBoxItem>
                <ListBoxItem>Snake</ListBoxItem>
            </ListBox>
        </Popover>
    </ComboBox>;
}
