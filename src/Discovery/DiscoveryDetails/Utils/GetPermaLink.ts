import { basename } from '../../../localconf';

function GetPermaLink(uid: string) {
  const pagePath = `/discovery/${encodeURIComponent(uid)}/`;
  const permalink = `${basename === '/' ? '' : basename}${pagePath}`;
  return permalink;
}

export default GetPermaLink;
