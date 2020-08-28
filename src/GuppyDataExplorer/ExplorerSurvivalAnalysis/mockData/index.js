import resultAll from './result/all.json';
import resultRace from './result/race.json';
import resultSex from './result/sex.json';
import resultRaceSex from './result/raceSex.json';
import resultSexRace from './result/sexRace.json';

export const factors = [
  {
    label: 'Sex',
    value: 'SEX',
  },
  {
    label: 'Race',
    value: 'RACE',
  },
];

const result = {
  all: resultAll,
  race: resultRace,
  sex: resultSex,
  race_sex: resultRaceSex,
  sex_race: resultSexRace,
};

export const fetchResult = ({ factorVariable, stratificationVariable }) =>
  Promise.resolve(
    result[
      factorVariable
        ? stratificationVariable
          ? `${factorVariable}_${stratificationVariable}`.toLowerCase()
          : factorVariable.toLowerCase()
        : 'all'
    ]
  );
