import { cohortMiddlewarePath } from './localconf';

export const getAllSources = async () => {
  // eslint-disable-next-line no-console
  const sources = await fetch(`${cohortMiddlewarePath}sources`).catch((err) => console.error('Error: ', err));
  return sources ? sources.json() : [];
};

export const getCohortJsonByName = async (sourceName) => {
  // eslint-disable-next-line no-console
  const cohortJson = await fetch(`${cohortMiddlewarePath}cohort-data/${sourceName}`).catch((err) => console.error('Error: ', err));
  return cohortJson ? cohortJson.json() : [];
};

export const getCohortCsvByName = async (sourceName) => {
  // eslint-disable-next-line no-console
  const cohortCsv = await fetch(`${cohortMiddlewarePath}cohort-data/${sourceName}?format=csv`).catch((err) => console.error('Error: ', err));
  return cohortCsv ? cohortCsv.text() : '';
};
