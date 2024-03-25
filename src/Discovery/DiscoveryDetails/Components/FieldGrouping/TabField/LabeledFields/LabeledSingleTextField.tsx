import React from 'react';
import { getFieldClassName, label } from './LabelingUtils';

const LabeledSingleTextField = (labelText: string, fieldText: string) => (
  <div className={getFieldClassName(labelText)}>
    {label(labelText)}
    <span className={'discovery-modal__fieldtext'}>{fieldText}</span>
  </div>
);
export default LabeledSingleTextField;
