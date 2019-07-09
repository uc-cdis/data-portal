import showdown from 'showdown';

const loadText = () => {
  // ... = fetch('/custom/privacy-policy.md')
  if (true) {
    const contents = '# Test markdown'
    const converter = new showdown.Converter();
    const html = converter.makeHtml(contents);
    return html
  } else {
    return null
  }
}

const privacyPolicy = (state = {}, action) => {
  if (action.type == 'LOAD_PRIVACY_POLICY') {
    return { ...state, asdf: loadText() };
  }
  return state;
}

export default privacyPolicy;
