import { asyncSetInterval } from './utils';


test('Test asyncSetInterval', (done) => {
  let callCount = 0;

  // callback takes 100ms to run
  const callback = function () {
    return new Promise(((resolve, reject) => {
      setTimeout(() => {
        callCount++;
        console.log(`callCount is: ${callCount}`);
        resolve('ok');
      }, 150);
    }));
  };

  const id = asyncSetInterval(callback, 50);
  expect(id).toBeDefined();
  console.log(`Got interval id: ${id}`);

  // after 250ms the callback should have executed twice
  const tid = setTimeout(() => {
    console.log(`After delay call count is: ${callCount}`);
    clearInterval(id);
    expect(callCount).toBe(2);
    done();
  }, 400);

  // console.log( "Got tid: " + tid );

  // run callback every 20ms
  // console.log( "Launching asyncSetInterval" );
});
