const DELAY_TIME = 250;

// Utility function to call other function with a delay for loading
// example: DelayExecution(myFunction, 'parameter1', 'parameter2');
const DelayExecution = (fn, ...args) => {
  setTimeout(() => {
    fn(...args);
  }, DELAY_TIME);
};

export default DelayExecution;
