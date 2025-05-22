import React from 'react';
import { rest } from 'msw';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { components } from '../params';
import ReduxPrivacyPolicy from './ReduxPrivacyPolicy';

const data = `An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and \`monospace\`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺`;

const reducer = (state = { privacyPolicy: '' }, action) => {
  if (action.type === 'LOAD_PRIVACY_POLICY') {
    return { privacyPolicy: action.value };
  }
  return state;
};

const mockStore = createStore(reducer);

export default {
  title: 'PrivacyPolicy',
  component: ReduxPrivacyPolicy,
  parameters: {
    msw: [
      rest.get(components.privacyPolicy.file, (req, res, ctx) => res(ctx.status(200), ctx.body(data))),
    ],
  },
};

const MockTemplate = () => (
  <div className='privacy-policy'>
    <Provider store={mockStore}>
      <ReduxPrivacyPolicy />
    </Provider>
  </div>
);

export const MockedReduxPrivacyPolicy = MockTemplate.bind({});
