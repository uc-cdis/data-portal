import { fireEvent, render, screen } from '@testing-library/react';
import Dropdown from './index';

test('renders', () => {
  const { container } = render(
    <Dropdown>
      <Dropdown.Button>Dropdown</Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item>item1</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
  expect(container.firstElementChild).toHaveClass('g3-dropdown');
  expect(container.querySelector('.g3-dropdown__menu')).toBeInTheDocument();
  expect(
    container.querySelector('.g3-dropdown__menu--opened')
  ).not.toBeInTheDocument();
});

test('triggers menu correctly', () => {
  const onClickItem = jest.fn();
  const { container } = render(
    <Dropdown>
      <Dropdown.Button>Dropdown</Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item onClick={onClickItem}>item1</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
  fireEvent.click(screen.getByLabelText('Dropdown Button'));
  expect(container.querySelector('.g3-dropdown__menu')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Dropdown item'));
  expect(onClickItem).toHaveBeenCalledTimes(1);
});

test('triggers split menu correctly', () => {
  const onClickDropdown = jest.fn();
  const onClickItem = jest.fn();
  const { container } = render(
    <Dropdown>
      <Dropdown.Button split onClick={onClickDropdown}>
        Dropdown
      </Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item onClick={onClickItem}>item1</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
  fireEvent.click(screen.getByLabelText('Dropdown Button'));
  expect(container.querySelector('.g3-dropdown__menu')).not.toHaveClass(
    'g3-dropdown__menu--opened'
  );

  fireEvent.click(container.querySelector('.g3-dropdown-button__menu-trigger'));
  expect(container.querySelector('.g3-dropdown__menu')).toHaveClass(
    'g3-dropdown__menu--opened'
  );

  fireEvent.click(screen.getByLabelText('Dropdown item'));
  expect(onClickItem).toHaveBeenCalledTimes(1);
});
