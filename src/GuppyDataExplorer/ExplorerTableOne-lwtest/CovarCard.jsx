import { useState } from 'react';
import PropTypes, { object } from 'prop-types';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleInputField from '../../components/SimpleInputField';
import ExplorerFilterDisplay from '../ExplorerFilterDisplay';
import Button from '../../gen3-ui-component/components/Button';
import { overrideSelectTheme } from '../../utils';
import Select from 'react-select';
import './index.css';



export default function CovarCard({ count, variate, covarList, setCovarList, selectableVaris, setSelectableVaris, updateBody, variList, setVariList}) {
  const [selectedVar, setSelectedVar] = useState(null)
  const [coVarOption, setcoVarOption] = useState(null)
  const [selectedCoVar, setSelectedCovar] = useState(null)
  const [checkedValue, setCheckedValue] = useState([])
  const [changedKeys, setChangedKeys] = useState([]);
  const removeCovar = () => {
    console.log(count)
    setCovarList(covarList.filter((_, index) => index !== count));
  };

  function ControlFormSelect({ label, ...selectProps }) {
    return (
      <SimpleInputField
        label={label}
        input={
          <Select
            {...selectProps}
            isClearable={false}
            theme={overrideSelectTheme}
            styles={{
              control: (provided, { isDisabled }) => ({
                ...provided,
                cursor: isDisabled ? 'not-allowed' : '',
                pointerEvents: 'auto',
              }),
              multiValue: (provided, { isDisabled }) => ({
                ...provided,
                backgroundColor: isDisabled
                  ? 'lightgrey'
                  : provided.backgroundColor,
                paddingRight: isDisabled ? '3px' : provided.paddingRight,
              }),
            }}
          />
        }
      />
    );
  }

  return (
    <div className='explorer-survival-analysis__filter-set-card'>
      <h2>Covariate {count+1}</h2>
      <ControlFormSelect
          inputId='allowed-consortium'
          label=' group '
          theme={overrideSelectTheme}
          options={Object.keys(selectableVaris).map((label)=> (
            { label:label,
            value:label
           }))}
          value = {selectedVar}
          onChange ={(e)=>{
            setSelectedVar(e)
          }}
      />
      { selectedVar!=null?(
          <ControlFormSelect
          inputId='allowed-consortium'
          label=' variable '
          theme={overrideSelectTheme}
          options={selectableVaris[selectedVar.value].map((e)=>(
            {label:e.name, value:e}
          ))}
          onChange = {(e)=>{
            setcoVarOption(e)
            setSelectedCovar(e.value)

            updateBody(e.value, "variable", count)
          }}
          value = {coVarOption}
            
      />
        ):null
      }

      {selectedCoVar!=null&&selectedCoVar.type=="categorical"?(
        <div className='covar_card_check_group'>
          <label>
                    Values:
                    {
                        selectedCoVar.values.map((k)=>{
                            return(
                                <label className = 'covar_card_check' key={k.toString()}>
                                    <input
                                        type="checkbox"
                                        value={k}
                                        onChange={(e)=>{
                                          var v = e.target.value;
                                          if(e.target.checked){                                            
                                            updateBody([...checkedValue,v],"value",count)
                                            updateBody([...changedKeys,v],"key",count)
                                            setCheckedValue((pre) => [...pre, v])
                                            setChangedKeys((pre) => [...pre, v])
                                          }
                                          else{
                                            const index = checkedValue.indexOf(v);
                                            updateBody(checkedValue.filter((item) => item !== v),"value",count)
                                            const newa = [...changedKeys]
                                            newa.splice(index,1)
                                            updateBody(newa,"key",count)
                                            setCheckedValue((pre)=>pre.filter((item) => item !== v)) 
                                            setChangedKeys((pre) => newa)                                           
                                          }                                          
                                        }}
                                    />
                                    {k}
                                </label>
                                    )
                            })
                    }

                </label>
                <label>
                    Keys:
                    {
                        checkedValue.map((k,i)=>{
                            return(
                                <label className = 'covar_card_check' key={k.toString()}>
                                    {k} =
                                    <input
                                        type="text"
                                        value={changedKeys[i]}
                                        onChange={(e) =>{
                                            var v = e.target.value;
                                            var update = [...changedKeys];
                                            update[i] = v;
                                            setChangedKeys(update)
                                            updateBody(update,"key",count)
                                          }
                                          

                                        }
                                    />
                                </label>
                            )
                        })
                    }
                </label>
                </div>
        ):null
      }
      
      <Button
          label='delete'
          buttonType='primary'
          onClick={removeCovar}
        />
    </div>
  );
}
