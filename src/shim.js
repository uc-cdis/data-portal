// needed to mute errors in console for tests
global.requestAnimationFrame = function(callback) {
 setTimeout(callback, 0);
};
