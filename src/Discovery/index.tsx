import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Discovery from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { hostname, discoveryConfig, useArboristUI } from '../localconf';

const COMMONS = [
  {
    MDS_URL: 'https://gen3.datacommons.io/mds/metadata?data=True',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'Genomic Data Commons',
    FILTER: "&gen3_discovery.commons=Genomic Data Commons",
    OFFSET: 0,
  },
  {
    MDS_URL: 'https://gen3.datacommons.io/mds/metadata?data=True',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'Cancer Imaging Data Commons',
    FILTER: "&gen3_discovery.commons=Cancer Imaging Data Commons",
    OFFSET: 0,
  },
  {
    MDS_URL: 'https://gen3.datacommons.io/mds/metadata?data=True',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'Proteomic Data Commons',
    FILTER: "&gen3_discovery.commons=Proteomic Data Commons",
    OFFSET: 0,
  },
  {
    MDS_URL: 'https://staging.gen3.biodatacatalyst.nhlbi.nih.gov/mds/metadata?data=True',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'BDC',
    FILTER: '',
    OFFSET: 0,
  },
  {
    MDS_URL: 'https://internalstaging.theanvil.io/mds/metadata?data=True',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'AnVIL',
    FILTER: '',
    OFFSET: 0,
  }

];

const loadStudiesFromNamedMDS = async (MDS_URL: string, GUID_TYPE: string,
  LIMIT: number, STUDY_DATA_FIELD: string,
  COMMON: string, FILTER:string = '', offset:number = 0): Promise<any[]> => {
  try {
    let allStudies = [];

    // request up to LIMIT studies from MDS at a time.
    let shouldContinue = true;
    while (shouldContinue) {
      const url = `${MDS_URL}&_guid_type=${GUID_TYPE}&limit=${LIMIT}&offset=${offset}${FILTER}`;

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

        if (FILTER !== '') { // hacky hacky
          const commonName = x.commons;
          x.name = x.short_name;
          if (x.commons === "Proteomic Data Commons") {
            x.study_id = x._unique_id;
            x._subjects_count = x.cases_count;
          }
          if (x.commons === 'Genomic Data Commons') {
            x.study_id = x.dbgap_accession_number;
            x._subjects_count = x.subjects_count;
          }
          if (x.commons === 'Cancer Imaging Data Commons') {
            x.study_id = x.dbgap_accession_number;
            x._subjects_count = x.subjects_count;
          }

          x.study_description = x.description;
          x._unique_id = `${commonName}_${x._unique_id}_${index}`;
          x.tags.push(Object({category : 'Commons',name: commonName }));
          x.commons = commonName;
          // console.log(commonName, x);

          return x; // leave early
        }
        x.commons = COMMON;
        x._unique_id = `${COMMON}_${x._unique_id}_${index}`;
        x.tags.push(Object({category : 'Commons',name: COMMON }));
        return x;
      },
      );
      // console.log(studies);
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

const loadStudiesFromMDS = async (commons: Object[]): Promise<any[]> => {
  try {
    let joinedStudies = [];

    for (const common of commons) {
      const studies = await loadStudiesFromNamedMDS(
        common['MDS_URL'],
        common['GUID_TYPE'],
        common['LIMIT'],
        common['STUDY_DATA_FIELD'],
        common['COMMONS'],
          common['FILTER'],
          common['OFFSET'],
      );
      joinedStudies = joinedStudies.concat(studies);
    }
    return joinedStudies;
  } catch (err) {
    throw new Error(`Request for joined study data failed: ${err}`);
  }
};

const DiscoveryWithMDSBackend: React.FC<{
    userAuthMapping: any,
    config: DiscoveryConfig,
}> = (props) => {
  const [studies, setStudies] = useState(null);

  if (!discoveryConfig) {
    throw new Error('Could not find configuration for Discovery page. Check the portal config.');
  }

  useEffect(() => {
    loadStudiesFromMDS(COMMONS).then((rawStudies) => {
      if (props.config.features.authorization.enabled) {
        // mark studies as accessible or inaccessible to user
        const authzField = props.config.minimalFieldMapping.authzField;
        // useArboristUI=true is required for userHasMethodForServiceOnResource
        if (!useArboristUI) {
          throw new Error('Arborist UI must be enabled for the Discovery page to work if authorization is enabled in the Discovery page. Set `useArboristUI: true` in the portal config.');
        }
        const studiesWithAccessibleField = rawStudies.map(study => ({
          ...study,
          __accessible: userHasMethodForServiceOnResource('read', '*', study[authzField], props.userAuthMapping),
        }));
        setStudies(studiesWithAccessibleField);
      } else {
        setStudies(rawStudies);
      }
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error encountered while loading studies: ', err);
    });
  }, []);

  return (<Discovery
    studies={studies === null ? [] : studies}
    {...props}
  />);
};

const mapStateToProps = state => ({
  userAuthMapping: state.userAuthMapping,
  config: discoveryConfig,
});

export default connect(mapStateToProps)(DiscoveryWithMDSBackend);
