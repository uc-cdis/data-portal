import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories/index.jsx');
  require('../src/stories/buttons.jsx');
  require('../src/stories/charts.jsx');
  require('../src/stories/tables.jsx');
  require('../src/stories/portal.jsx');
}

configure(loadStories, module);
