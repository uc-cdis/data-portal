import React, { useEffect } from 'react';
import workerCode from './myWorker.js';

const WorkerComponent = () => {
  useEffect(() => {
    const workerCodeString = '(' + workerCode + ')();';
    const blob = new Blob([workerCodeString], { type: 'application/javascript' });
    const workerURL = URL.createObjectURL(blob);
    const worker = new Worker(workerURL);
    // Handle messages from the worker
    worker.onmessage = (event) => {
      console.log('Message from worker:', event.data);
    };
    // Send a message to the worker
    worker.postMessage(10); // Example input
    // Clean up the worker on component unmount
    return () => {
      worker.terminate(); // Terminate the worker
      URL.revokeObjectURL(workerURL); // Revoke the Blob URL
    };
  }, []);

  return <div>Check the console for messages from the worker.</div>;
};

export default WorkerComponent;
