import React, {
  useState, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { CaretDownFilled, CheckOutlined } from '@ant-design/icons';
import './ComboboxWithInput.less';

const ComboboxWithInput = ({
  items: initialItems = [],
  value: externalValue,
  onChange: externalOnChange,
  disabled = false,
  placeholder = 'Select or create...',
  searchPlaceholder = 'Search or create new...',
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(externalValue || '');
  const [items, setItems] = useState(initialItems);
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const wrapperRef = useRef(null);
  const listboxId = 'combobox-listbox';
  const inputId = 'combobox-input';

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase())),
    );
  }, [inputValue, items]);

  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' && inputValue.trim()) {
      const newItem = {
        value: `item${items.length + 1}`,
        label: inputValue.trim(),
      };
      setItems([...items, newItem]);
      const newValue = newItem.value;
      setValue(newValue);
      externalOnChange?.(newItem.label, undefined); // inform of new list name
      setInputValue('');
      setOpen(false);
    }
  };

  const handleSelect = (newValue, label) => {
    if (disabled) return;
    setValue(newValue);
    externalOnChange?.(label, newValue );
    setOpen(false);
  };

  return (
    <div className={`combobox-wrapper ${disabled ? 'disabled' : ''}`} ref={wrapperRef}>
      <div className='combobox-inner'>
        <button
          disabled={disabled}
          type='button'
          onClick={() => setOpen(!open)}
          className='combobox-button'
          aria-haspopup='listbox'
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label='Select an option or create new'
          style={{
            width: 'unset',
            display: 'flex',
          }}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <CaretDownFilled className='chevron-icon' aria-hidden='true' />
        </button>
        {open && (
          <div className='dropdown-container' role='presentation'>
            <div className='input-wrapper'>
              <input
                disabled={disabled}
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck='false'
                type='text'
                id={inputId}
                className='search-input'
                placeholder={searchPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                role='combobox'
                aria-expanded={open}
                aria-controls={listboxId}
                aria-autocomplete='list'
                aria-label='Search or create new item'
              />
            </div>
            <ul
              id={listboxId}
              className='item-list'
              role='listbox'
              aria-label='Options'
            >
              {filteredItems.length === 0 && inputValue && (
                <li
                  className='empty-message'
                  role='alert'
                  aria-live='polite'
                >
                Press enter to create "{inputValue}"
                </li>
              )}
              {filteredItems.map((item) => (
                <li
                  key={item.value}
                  onClick={() => handleSelect(item.value, item.label)}
                  className='list-item'
                  role='option'
                  aria-selected={value === item.value}
                  tabIndex={0}
                >
                  <CheckOutlined
                    className={`check-icon ${value === item.value ? 'visible' : ''}`}
                    aria-hidden='true'
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

ComboboxWithInput.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
};

ComboboxWithInput.defaultProps = {
  items: [],
  value: '',
  onChange: () => {},
  disabled: false,
  placeholder: 'Select or create...',
  searchPlaceholder: 'Search or create new...',
};

export default ComboboxWithInput;
