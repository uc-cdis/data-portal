import PropTypes from 'prop-types';
import { contactEmail } from '../../localconf';
import './Footer.css';
import { getDictionaryVersion } from '../../DataDictionary/utils';

/**
 * @param {Object} props
 * @param {string} [props.dataVersion]
 * @param {{ href: string; text: string; }[]} [props.links]
 * @param {{ alt: string; height: number; href: string; src: string; }[]} props.logos
 * @param {string} [props.portalVersion]
 * @param {{ file?: string; footerHref: string; routeHref?: string; text: string }} [props.privacyPolicy]
 */
function Footer({
  dataVersion,
  links,
  logos,
  portalVersion,
  privacyPolicy,
  survivalCurveVersion,
}) {
  const dictionaryVersion = getDictionaryVersion();
  return (
    <footer>
      <nav className='footer__nav' aria-label='Footer Navigation'>
        <div className='footer__version-info-area'>
          {dataVersion && (
            <div className='footer__version-info'>
              <span>Data Release Version:</span> {dataVersion}
            </div>
          )}
          {portalVersion && (
            <div className='footer__version-info'>
              <span>Portal Version:</span> {portalVersion}
            </div>
          )}
          {dictionaryVersion && (
            <div className='footer__version-info'>
              <span>Dictionary Version:</span> {dictionaryVersion}
            </div>
          )}
          {survivalCurveVersion && (
            <div className='footer__version-info'>
              <span>Survival Curve Version:</span> {survivalCurveVersion}
            </div>
          )}
          <div className='footer__version-info'>
            <span>Help:</span>{' '}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
        </div>
        <div className='footer__spacer-area' />
        {privacyPolicy?.text && (
          <div className='footer__privacy-policy-area'>
            <a
              className='h4-typo footer__privacy-policy'
              href={privacyPolicy.footerHref}
              target='_blank'
              rel='noopener noreferrer'
            >
              {privacyPolicy.text}
            </a>
          </div>
        )}
        <div className='footer__logo-area'>
          {logos.map(({ alt, height, href, src }, i) => (
            <a
              key={i}
              target='_blank'
              href={href}
              className='footer__icon'
              rel='noopener noreferrer'
            >
              <img
                className='footer__img'
                src={src}
                alt={alt}
                style={{ height: height ?? 60 }}
              />
            </a>
          ))}
        </div>
        <div className='footer__link-area'>
          {links?.map(({ href, text }) => (
            <a
              key={href}
              href={href}
              className='footer__link'
              target='_blank'
              rel='noopener noreferrer'
            >
              {text || href}
            </a>
          ))}
        </div>
      </nav>
    </footer>
  );
}

Footer.propTypes = {
  dataVersion: PropTypes.string,
  survivalCurveVersion: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.exact({
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ),
  logos: PropTypes.arrayOf(
    PropTypes.exact({
      alt: PropTypes.string.isRequired,
      height: PropTypes.number,
      href: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
    }),
  ).isRequired,
  portalVersion: PropTypes.string,
  privacyPolicy: PropTypes.exact({
    file: PropTypes.string,
    footerHref: PropTypes.string.isRequired,
    routeHref: PropTypes.string,
    text: PropTypes.string.isRequired,
  }),
};

export default Footer;
