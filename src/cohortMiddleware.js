import { cohortMiddlewarePath } from './localconf';

export const getAllSources = async () => {
    const sources = await fetch(`${cohortMiddlewarePath}sources`)
    return sources.json();
}

export const getCohortJsonByName = async (sourceName) => {
    const cohortJson = await fetch(`${cohortMiddlewarePath}cohort-data/${sourceName}`);
    return cohortJson.json();
}

export const getCohortCsvByName = async (sourceName) => {
    const cohortCsv = await fetch(`${cohortMiddlewarePath}cohort-data/${sourceName}?format=csv`)
    return cohortCsv.text();
}
