import React from 'react';

const getFieldClassName = (label?: string) => (label ? 'discovery-modal__field discovery-modal__field--with_label' : 'discovery-modal__field');
const label = (text: string) => (text ? <b className='discovery-modal__fieldlabel'>{text}</b> : <div />);

export { getFieldClassName, label };
