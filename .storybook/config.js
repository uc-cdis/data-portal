import { configure } from '@storybook/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

function loadStories() {
  const req = require.context('../src/stories', true, /\.jsx?$/);
  req.keys().forEach((fname) => req(fname));

  library.add(faAngleUp, faAngleDown);
}

configure(loadStories, module);
