// This file has code written by Craig to talk to prod MDS's
// Will be deleted in favor of using the aggregate MDS.

const commons = [
  {
    MDS_URL: 'https://gen3.datacommons.io/mds/metadata',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'GDC',
    POPULATE_GUID: false,
    OFFSET: 3,
  },
  {
    MDS_URL: 'https://staging.gen3.biodatacatalyst.nhlbi.nih.gov/mds/metadata',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'BDC',
    POPULATE_GUID: false,
    OFFSET: 0,
  },
  {
    MDS_URL: 'https://internalstaging.theanvil.io/mds/metadata',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'AnVIL',
    POPULATE_GUID: true,
    OFFSET: 0,
  },
];

const loadStudiesFromNamedMDSDeprecated = async (MDS_URL: string, GUID_TYPE: string,
  LIMIT: number, STUDY_DATA_FIELD: string,
  COMMON: string, populateGUI:boolean = false, offsetInput:number = 0): Promise<any[]> => {
  try {
    let offset = offsetInput;
    let allStudies = [];

    // request up to LIMIT studies from MDS at a time.
    let shouldContinue = true;
    while (shouldContinue) {
      const url = `${MDS_URL}?data=True&_guid_type=${GUID_TYPE}&limit=${LIMIT}&offset=${offset}`;
      // It's OK to disable no-await-in-loop rule here -- it's telling us to refactor
      // using Promise.all() so that we can fire multiple requests at one.
      // But we WANT to delay sending the next request to MDS until we know we need it.
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url);
      if (res.status !== 200) {
        throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
      }
      // eslint-disable-next-line no-await-in-loop
      const jsonResponse = await res.json();

      const studies = Object.values(jsonResponse).map((entry, index) => {
        const x = entry[STUDY_DATA_FIELD];
        x.commons = COMMON;
        x.frontend_uid = `${COMMON}_${index}`;
        if (populateGUI && x.study_id) {
          // need to do this as in case MDS does not have _unique_id
          x._unique_id = x.study_id;
        }

        if (COMMON === 'GDC') { // hacky hacky
          x.name = x.short_name;
          if (x.dbgap_accession_number) {
            x.study_id = x.dbgap_accession_number;
          } else if (x._unique_id && !x.study_id) {
            // It appears we have no choice here but to set:
            x.study_id = x._unique_id;
          }

          // Different GDC studies have different patient descriptors
          if (x.subjects_count) {
            x._subjects_count = x.subjects_count;
          } else if (x.cases_count) {
            x._subjects_count = x.cases_count;
          }
          x.study_description = x.description;
        }
        x._unique_id = `${COMMON}_${x._unique_id}_${index}`;
        x.tags.push(Object({ category: 'Commons', name: COMMON }));

        return x;
      },
      );

      allStudies = allStudies.concat(studies);
      const noMoreStudiesToLoad = studies.length < LIMIT;
      if (noMoreStudiesToLoad) {
        shouldContinue = false;
        return allStudies;
      }
      offset += LIMIT;
    }
    return allStudies;
  } catch (err) {
    throw new Error(`Request for study data failed: ${err}`);
  }
};

const loadStudiesFromMDSDDeprecated = async (): Promise<any[]> => {
  try {
    let joinedStudies = [];

    for (let k = 0; k < commons.length; k += 1) {
      const common = commons[k];
      // eslint-disable-next-line no-await-in-loop
      const studies = await loadStudiesFromNamedMDSDeprecated(
        common.MDS_URL,
        common.GUID_TYPE,
        common.LIMIT,
        common.STUDY_DATA_FIELD,
        common.COMMONS,
        common.POPULATE_GUID,
        common.OFFSET,
      );
      joinedStudies = joinedStudies.concat(studies);
    }
    return joinedStudies;
  } catch (err) {
    throw new Error(`Request for joined study data failed: ${err}`);
  }
};

export default loadStudiesFromMDSDDeprecated;
