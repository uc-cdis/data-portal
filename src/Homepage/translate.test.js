import Translator from './translate.js';

describe('the translator', () => {
  it('Caches a default translator', () => {
    expect(Translator.getTranslator()).toBe(Translator.getTranslator());
  });

  it('Does not modify words for \'experiment dictionary\' apps', () => {
    const expHelper = Translator.getTranslator('default');
    expect(expHelper.translate('Experiments')).toBe('Experiments');
  });

  it('Translates words for \'study dictionary\' apps', () => {
    const expHelper = Translator.getTranslator('bhc');
    expect(expHelper.translate('Experiments')).toBe('Studies');
    expect(expHelper.translate('experimentFred')).toBe('studyFred');
  });
});
