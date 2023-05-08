import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ButtonToggle from './index';

test('ButtonToggle toggles correctly', () => {
    function ButtonToggleWrapper() {
        let [isOn, setOn] = useState(true);
        let [value, setValue] = useState('');
        let handleToggle = ({ isOn, value }) => {
            setOn(isOn);
            setValue(value);
        };

        return <>
            <ButtonToggle isOn={isOn} onText='On' onValue={'ON'} offText='Off' offValue={'OFF'} onToggle={handleToggle} />
            <span className='toggle-value'>{value}</span>
        </>;
    }
    const { container } = render(<ButtonToggleWrapper />);

    const offInput = container.querySelector(
      '.button-toggle input[name="toggleOff"]'
    );
    const onInput = container.querySelector(
        '.button-toggle input[name="toggleOn"]'
    );
    const valueContainer = container.querySelector('.toggle-value');

  
    fireEvent.click(screen.getByText('Off'));

    expect(offInput).toHaveProperty('checked', true);
    expect(valueContainer).toHaveTextContent('OFF');

    fireEvent.click(screen.getByText('On'));

    expect(offInput).toHaveProperty('checked', false);
    expect(onInput).toHaveProperty('checked', true);
    expect(valueContainer).toHaveTextContent('ON');
  });