import Translator from './translate.js';

describe( "the translator", function() {
  it( "Caches a default translator", function() {
    expect( Translator.getTranslator() ).toBe( Translator.getTranslator() );
  });

  it( "Does not modify words for 'experiment dictionary' apps", function() {
    const expHelper = Translator.getTranslator( "default" );
    expect( expHelper.translate( "Experiments" ) ).toBe( "Experiments" );
  });

  it( "Translates words for 'study dictionary' apps", function() {
    const expHelper = Translator.getTranslator( "bhc" );
    expect( expHelper.translate( "Experiments" ) ).toBe( "Studies" );
    expect( expHelper.translate( "experimentFred" ) ).toBe( "studyFred" );
  });
});