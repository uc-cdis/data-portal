import { app, dev } from '../localconf';

let singleton;

/**
 * Basic app and locality aware translation
 */
export default class Translator {
  constructor(appName, language) {
    this.appName = appName;
    this.language = language;
    this.mode = (appName === 'bhc' || (appName === 'bpa' && !dev)) ? 'study' : 'exp';
    if (appName === 'kf') {
      this.mode = 'trio';
    }
  }

  /**
   * Super simple for now - just to support Experiment vs Study apps
   * @param {String} word 
   * @return {String} translation
   */
  translate(word) {
    if (this.mode === 'study') {
      return word.replace(/^Experiments/, 'Studies',
      ).replace(/^experiments/, 'studies',
      ).replace(/^Experiment/, 'Study',
      ).replace(/^experiment/, 'study',
      );
    } else if (this.mode === 'trio') {
      return word.replace(/^Experiments/, 'Trios',
      ).replace(/^experiments/, 'trios',
      ).replace(/^Experiment/, 'Trio',
      ).replace(/^experiment/, 'trio',
      );
    }
    return word;
  }


  /**
   * Little factory
   */
  static getTranslator(appName = app, language = navigator.language) {
    if (appName === singleton.appName && language === singleton.language) {
      return singleton;
    }
    return new Translator(appName, language);
  }
}

singleton = new Translator(app, navigator.language);
