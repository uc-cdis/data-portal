import { useState } from 'react';
import Button from '../../../Button/index';
import './UnitCalculator.css';

export default function UnitCalculator({
  setShowCalculator,
  parameters,
  updateBound,
}) {
  const quantity = parameters.quantity; // string, like 'age'
  const desiredUnit = parameters.desiredUnit; // string, like 'days'
  const selectUnitsDict = parameters.selectUnits; // dictionary: (str, number) pairs, like ('months': 30)
  const selectUnits = Object.keys(selectUnitsDict); // array of just units, like ['months', 'yars']
  const selectionOptions = selectUnits.map((item) => (
    <option value={item}>{item}</option>
  ));

  const [quantityInput, setQuantityInput] = useState('');
  const [unit, setUnit] = useState('');
  const [convertedQuantity, setConvertedQuantity] = useState('');

  function exitCalc() {
    setShowCalculator(false);
  }

  function handleQuantityChange(event) {
    setQuantityInput(event.target.value);
  }

  function handleUnitChange(event) {
    setUnit(event.target.value);
  }

  function assignMin() {
    const parsed = parseFloat(convertedQuantity);
    updateBound(parsed, 'lower');
  }

  function assignMax() {
    const parsed = parseFloat(convertedQuantity);
    updateBound(parsed, 'upper');
  }

  function handleConvert() {
    const input = parseFloat(quantityInput);

    if (!quantityInput || !unit || isNaN(input)) {
      setConvertedQuantity('');
      return;
    }

    const conversionRate =
      unit in selectUnitsDict ? selectUnitsDict[unit] : null;
    const calcOutput = conversionRate ? input * conversionRate : '';
    setConvertedQuantity(calcOutput.toString());
  }

  return (
    <section className='mini-app'>
      <h4 className={'p-spacing'}>
        Compute {quantity} in {desiredUnit}
        <button onClick={exitCalc} className='button-exit'>
          {' '}
          X
        </button>
      </h4>
      <div className='container'>
        <div className='group-inline'>
          <label className='block' htmlFor='quantityInput'>
            Input:
          </label>
          <input
            id='quantityInput'
            placeholder='e.g. 2'
            className='full-width'
            value={quantityInput}
            name={quantity}
            type='number'
            onChange={handleQuantityChange}
          />
        </div>

        <div className='group-inline'>
          <label htmlFor='unitSelect'>Unit:</label>
          <select
            id='unitSelect'
            className='full-width'
            value={unit}
            onChange={handleUnitChange}
          >
            <option value=''>select unit</option>
            {selectionOptions}
          </select>
        </div>
      </div>

      <div className='p-spacing'>
        {' '}
        <Button
          label='Convert'
          buttonType='default'
          onClick={handleConvert}
        />{' '}
      </div>
      <br />
      <p id={'output'}>
        Output (in {desiredUnit}): {convertedQuantity}
      </p>
      <Button
        label='Copy output to clipboard'
        buttonType='default'
        onClick={() => {
          navigator.clipboard.writeText(convertedQuantity.toString());
        }}
      />
      <div className='button-group-inline'>
        <button className='button-assign' onClick={assignMin}>
          Assign to min
        </button>
        <button className='button-assign' onClick={assignMax}>
          Assign to max
        </button>
      </div>
    </section>
  );
}
