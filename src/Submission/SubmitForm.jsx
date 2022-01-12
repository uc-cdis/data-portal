import { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { jsonToString, overrideSelectTheme } from '../utils';
import SubmitNodeForm from './SubmitNodeForm';
import './SubmitForm.css';

/**
 * Form-based data submission.  The results of this form submission are subsequently
 * processed by the SubmitTSV component, and treated
 * the same way uploaded tsv/json data is treated.
 * @param {Object} props
 * @param {(formSchema: Object) => void} props.onUpdateFormSchema
 * @param {(value: string, type: string) => void} props.onUploadClick
 * @param {Object} props.submission
 */
function SubmitForm({ onUpdateFormSchema, onUploadClick, submission }) {
  const [nodeOption, setNodeOption] = useState({ label: '', value: '' });
  const [form, setForm] = useState({});
  const [showForm, setShowForm] = useState(false);

  function toggleForm() {
    setShowForm((s) => !s);
  }

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  function handleChange(event) {
    const { checked, name, value, type } = event.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  /**
   * @param {string} name
   * @param {{ value: string | null }} newEnum
   */
  function handleChangeEnum(name, newEnum) {
    setForm((f) => ({ ...f, [name]: newEnum.value ? newEnum.value : null }));
  }

  /**
   * @param {string} name
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * @param {string[]} properties
   */
  function handleChangeAnyOf(name, event, properties) {
    const { checked, name: subName, value, type } = event.target;
    const subValue = type === 'checkbox' ? checked : value;

    setForm((f) => {
      const currentValues = f[name];
      const newValue = { [subName]: subValue };

      if (currentValues === null || currentValues === undefined)
        return { ...f, [name]: [newValue] };

      if (properties.every((p) => p in currentValues))
        return { ...f, [name]: [...currentValues, newValue] };

      return {
        ...f,
        [name]: [
          ...currentValues.slice(0, currentValues.length - 2),
          { ...currentValues[currentValues.length - 1], ...newValue },
        ],
      };
    });
  }

  /** @type {React.FormEventHandler} */
  function handleSubmit(event) {
    event.preventDefault();

    onUploadClick(
      jsonToString(form, submission.formSchema),
      'application/json'
    );
  }

  /** @type {{ dictionary: Object; nodeTypes: string[] }} */
  const { dictionary, nodeTypes } = submission;
  const node = dictionary[nodeOption.value];
  const options = nodeTypes.map((type) => ({ label: type, value: type }));

  return (
    <div>
      <form className='submit-form__form'>
        <label>
          <input type='checkbox' checked={showForm} onChange={toggleForm} />
          Use Form Submission
        </label>
        {showForm && (
          <Select
            inputId='Node type'
            name='nodeType'
            options={options}
            value={nodeOption}
            onChange={({ label, value }) => {
              setNodeOption({ label, value });
              setForm({ type: value });
            }}
            className='submit-form__select'
            theme={overrideSelectTheme}
          />
        )}
      </form>
      {showForm && nodeOption.value !== '' && (
        <div>
          <h5> Properties: </h5>
          <span className='submit-form__required-notification'>
            {' '}
            * Denotes Required Property{' '}
          </span>
          <br />
          <SubmitNodeForm
            node={node}
            form={form}
            properties={Object.keys(node.properties).filter(
              (p) => node.systemProperties.indexOf(p) < 0
            )}
            requireds={node.required ?? []}
            onChange={handleChange}
            onChangeEnum={handleChangeEnum}
            onChangeAnyOf={handleChangeAnyOf}
            onUpdateFormSchema={onUpdateFormSchema}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}

SubmitForm.propTypes = {
  onUpdateFormSchema: PropTypes.func.isRequired,
  onUploadClick: PropTypes.func.isRequired,
  submission: PropTypes.object.isRequired,
};

export default SubmitForm;
