import { useContext } from 'react';
import {
    Button,
    CalendarCell,
    CalendarGrid,
    DateInput,
    DateRangePicker,
    DateSegment,
    Dialog,
    Group,
    Heading,
    Popover,
    RangeCalendar
} from 'react-aria-components';
import { DateRangePickerStateContext } from 'react-aria-components';
import './DateRangePicker.css';

function DateRangePickerClearButton() {
  let state = useContext(DateRangePickerStateContext);
  return (
    <Button
      // Don't inherit default Button behavior from DateRangePicker.
      slot={null}
      className="clear-button"
      aria-label="Clear"
      onPress={() => state.setValue(null)}
    >
      ✕
    </Button>
  );
}

export default function AnotherDateRangePicker({ onChange }) {
    return <DateRangePicker
        onChange={onChange}
        defaultValue={{
          start: null,
          end: null
        }}
    >
    <Group>
      <DateInput slot="start">
        {(segment) => <DateSegment segment={segment} />}
      </DateInput>
      <span aria-hidden="true">–</span>
      <DateInput slot="end">
        {(segment) => <DateSegment segment={segment} />}
      </DateInput>
      <DateRangePickerClearButton />
      <Button>▼</Button>
    </Group>
    <Popover>
      <Dialog>
        <RangeCalendar>
          <header>
            <Button slot="previous">◀</Button>
            <Heading />
            <Button slot="next">▶</Button>
          </header>
          <CalendarGrid>
            {(date) => <CalendarCell date={date} />}
          </CalendarGrid>
        </RangeCalendar>
      </Dialog>
    </Popover>
  </DateRangePicker>;
}
