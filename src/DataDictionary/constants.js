export let subHeader = "This is a user-friendly interface for accessing the Data Dictionary";
import { app } from '../localconf.js';

if (app === 'edc') {
  subHeader = "The data dictionary viewer is a user-friendly interface for accessing the Environmental Data Commons Data Dictionary.";
}
else if (app === 'bpa') {
  subHeader = "The BPA data dictionary viewer is a user-friendly interface for accessing the BPA Data Dictionary.";
}
else if (app === 'bhc') {
  subHeader = "The data dictionary viewer is a user-friendly interface for accessing the Data Dictionary used by the Brain Commons.";
}
