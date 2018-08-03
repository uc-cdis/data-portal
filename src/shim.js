// needed to mute "TypeError: window.requestAnimationFrame is not a function"
const muteError = (callback) => {
  setTimeout(callback, 0);
};

global.requestAnimationFrame = muteError;
