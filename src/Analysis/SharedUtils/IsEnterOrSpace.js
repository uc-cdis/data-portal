const isEnterOrSpace = (event) => event.key === 'Enter'
  || event.key === ' '
  || event.key === 'Spacebar'
  || event.keycode === '32'
  || event.keycode === '13';

  export default isEnterOrSpace;
