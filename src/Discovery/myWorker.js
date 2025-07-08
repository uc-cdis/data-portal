// myWorker.js
function workerFunction() {
    const self = this;
    self.onmessage = function(e) {
        const exampleOfProcessedOutput = Number(e.data) * 2;
        console.log(exampleOfProcessedOutput)
        const output = `
          HELLO WORLD (from myWorker.js):
          Output: ${e.data*2}
          `
        self.postMessage(output);
    }
}
export default workerFunction;
