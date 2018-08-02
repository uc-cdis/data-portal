// needed to mute errors in console for tests
const muteError = (callback) => {
  setTimeout(callback, 0);
};

global.requestAnimationFrame = muteError;
