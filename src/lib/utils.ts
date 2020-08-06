require('dotenv').config();

export const getRecomendedBrowser: any = (currentBrowserName: string, currentOSName: string) => {
  let result = undefined;

  const browserName = typeof currentBrowserName === 'string' ? currentBrowserName.toLowerCase() : '';
  const osName = typeof currentOSName === 'string' ? currentOSName.toLowerCase() : '';

  switch (true) {
    case osName === 'ios' && browserName !== 'safari' && browserName !== 'ios':
      result = {
        name: 'Safari',
        logo: `${process.env.REACT_APP_PUBLIC_URL}/safari-logo.png`,
        link: undefined,
      };
      break;
    case osName === 'mac os' && browserName !== 'chrome':
      result = {
        name: 'Chrome',
        logo: `${process.env.REACT_APP_PUBLIC_URL}/chrome-logo.png`,
        link: 'https://www.google.com/intl/es/chrome/',
      };
      break;
    case osName === 'android os' && browserName !== 'chrome':
      result = {
        name: 'Chrome',
        logo: `${process.env.REACT_APP_PUBLIC_URL}/chrome-logo.png`,
        link: 'https://play.google.com/store/apps/details?id=com.android.chrome',
      };
      break;
    case osName === 'linux':
      result = {
        name: 'Chrome',
        logo: `${process.env.REACT_APP_PUBLIC_URL}/chrome-logo.png`,
        link: 'https://www.google.com/intl/es/chrome/',
      };
      break;
    case osName.indexOf('windows') !== -1 && browserName !== 'chrome':
      result = {
        name: 'Chrome',
        logo: `${process.env.REACT_APP_PUBLIC_URL}/chrome-logo.png`,
        link: 'https://www.google.com/intl/es/chrome/',
      };
      break;
    default:
      break;
  }

  return result;
};

export const isBrowserSupported: any = (currentBrowserName: string, currentOSName: string) => {
  let result = true;

  const browserName = typeof currentBrowserName === 'string' ? currentBrowserName.toLowerCase() : '';
  const osName = typeof currentOSName === 'string' ? currentOSName.toLowerCase() : '';

  const iosBrowsersNotSupported = ['crios', 'fxios', 'edge-ios'];

  const androidBrowsersNotSupported = ['edge'];

  const windowsBrowsersNotSupported = ['edge'];

  switch (true) {
    case osName.indexOf('ios') !== -1 &&
      iosBrowsersNotSupported.findIndex(notBrowser => notBrowser === browserName) !== -1:
    case osName.indexOf('android') !== -1 &&
      androidBrowsersNotSupported.findIndex(notBrowser => notBrowser === browserName) !== -1:
    case osName.indexOf('windows') !== -1 &&
      windowsBrowsersNotSupported.findIndex(notBrowser => notBrowser === browserName) !== -1:
      result = false;
      break;
    default:
      break;
  }

  return result;
};

export const identityParser = (identity: string) => {
  const participant = identity.split('-');
  const name = participant[0];
  const role = participant[participant.length - 1];

  return {
    name,
    role,
  };
};
