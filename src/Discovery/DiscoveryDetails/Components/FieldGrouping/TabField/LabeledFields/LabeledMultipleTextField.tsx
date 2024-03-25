import React from 'react';
import { getFieldClassName } from './LabelingUtils';

const LabeledMultipleTextField = (labelText: string, fieldsText: string[]) => (fieldsText.length ? (
  <div>
    <h1 style={{ color: 'red' }}>LabeledMultipleTextField!</h1>
    <div className={getFieldClassName(labelText)} key='root'>
      {labelText
        ? <b className='discovery-modal__fieldlabel'>{labelText}</b> : <div />}
      <span className={'discovery-modal__fieldtext'}>{fieldsText[0]}</span>
    </div>
    {[
      // unlabeled subsequent fields
      ...fieldsText.slice(1).map((text, i) => (
        <div className={getFieldClassName(labelText)} key={i}>
          <div />
          <span className={'discovery-modal__fieldtext'}>{text}</span>
        </div>
      )),
    ]}
  </div>
) : null);

export default LabeledMultipleTextField;
