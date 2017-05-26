export * from './localconf.js';
var csrftoken = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'x-csrf-token': csrftoken};
