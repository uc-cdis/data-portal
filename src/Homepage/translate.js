import { app, dev } from '../localconf.js';

let singleton;

/**
 * Basic app and locality aware translation
 */
export default class Translator {
  constructor(appName, language) {
    this._appName = appName;
    this._language = language;
    this._mode = (appName === 'bhc' || (appName === 'bpa' && !dev)) ? 'study' : 'exp';
  }

  /**
   * Super simple for now - just to support Experiment vs Study apps
   * @param {String} word 
   * @return {String} translation
   */
  translate(word) {
    if (this._mode === 'exp') {
      return word;
    }
    return word.replace(/^Experiments/, 'Studies',
    ).replace(/^experiments/, 'studies',
    ).replace(/^Experiment/, 'Study',
    ).replace(/^experiment/, 'study',
    );
  }


  /**
   * Little factory
   */
  static getTranslator(appName = app, language = navigator.language) {
    if (appName === singleton._appName && language === singleton._language) {
      return singleton;
    }
    return new Translator(appName, language);
  }
}

singleton = new Translator(app, navigator.language);
