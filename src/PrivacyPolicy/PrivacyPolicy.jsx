import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import Spinner from '../components/Spinner';
import { components } from '../params';
import './PrivacyPolicy.less';

const { privacyPolicy } = components;
const usePrivacyPolicyFile =
  privacyPolicy.file !== undefined && privacyPolicy.file !== '';

const md = new MarkdownIt();

function PrivacyPolicy() {
  const [text, setText] = useState('');
  useEffect(() => {
    if (usePrivacyPolicyFile)
      fetch(privacyPolicy.file)
        .then((response) => {
          if (response.ok) return response.text();
          throw Error(response.text);
        })
        .then((responseText) => setText(responseText))
        .catch(console.error);
  }, []);

  /* eslint-disable react/no-danger */
  if (usePrivacyPolicyFile) {
    return text === '' ? (
      <Spinner />
    ) : (
      <div className='privacy-policy'>
        <p dangerouslySetInnerHTML={{ __html: md.render(text) }} />
      </div>
    );
  }

  const history = useHistory();
  if (privacyPolicy.routeHref) {
    history.push(privacyPolicy.routeHref);
  }

  return null;
}

export default PrivacyPolicy;
