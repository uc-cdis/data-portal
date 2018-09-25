const commonNames = {
  acct: 'ACCOuNT',
  bhc: 'Brain',
  bpa: 'BloodPAC',
  dcf: 'National Cancer Institute Data Commons Framework',
  edc: 'Environmental',
  genomel: 'Genomel',
  gdc: 'Jamboree',
  gtex: 'Data Commons Pilot & Data STAGE',
  kf: 'Kids First',
  kfDcfInterop: 'Pediatric Cancer Commons Pilot',
  ndh: 'NIAID',
  default: 'Generic',
};

const params = {
  acct: {
    gaTrackingId: 'UA-119127212-11',
    graphql: {
      boardCounts: [
        {
          graphql: '_subject_count',
          name: 'Subject',
          plural: 'Subjects',
        },
        {
          graphql: '_study_count',
          name: 'Study',
          plural: 'Studies',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_subject_count',
          name: 'Subject',
        },
        {
          graphql: '_study_count',
          name: 'Study',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'ACCOuNT Data Commons Portal',
      index: {
        introduction: {
          heading: 'ACCOuNT Data Commons',
          text: 'The ACCOuNT Data Commons supports the mission of the African American Cardiovascular Pharmacogenomics Consortium (ACCOuNT), thereby allowing others in the African American pharmacogenomics scientific community to easily access and use the findings of the various projects and "accounting" for African American pharmacogenomics in precision medicine. The commons is part of the ACCOuNT Data Harmonization and Analysis Core.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The ACCOuNT Data Commons define the data in a general way. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '/files',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',

          },
          {
            name: 'Analyze Data',
            icon: 'data-analyze',
            body: 'Analyze your selected cases using Jupyter Notebooks in our secure cloud environment',
            link: '#hostname#workspace/',
            label: 'Run analysis',
          },
        ],
      },
      navigation: {
        title: 'ACCOuNT Data Commons',
        items: [
          {
            icon: 'dictionary',
            link: '/DD',
            color: '#a2a2a2',
            name: 'Dictionary',
          },
          {
            icon: 'exploration',
            link: '/files',
            color: '#a2a2a2',
            name: 'Exploration',
          },
          {
            icon: 'query', link: '/query', color: '#a2a2a2', name: 'query',
          },
          {
            icon: 'workspace',
            link: '#hostname#workspace/',
            color: '#a2a2a2',
            name: 'Workspace',
          },
          {
            icon: 'profile',
            link: '/identity',
            color: '#a2a2a2',
            name: 'Profile',
          },
        ],
      },
      login: {
        title: 'ACCOuNT Data Commons',
        subTitle: 'search, compare, and download data',
        text: 'This website provides a centralized, cloud-based discovery portal for African American pharmacogenomics data and aims to accelerate discovery of novel genetic variants in African Americans related to clinically actionable cardiovascular phenotypes.',
        contact: 'If you have any questions about access or the registration process, please contact support@datacommons.io',
      },
    },
    featureFlags: {
      explorer: false,
    },
  },
  bhc: {
    gaTrackingId: 'UA-119127212-4',
    graphql: {
      boardCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
          plural: 'Cases',
        },
        {
          graphql: '_study_count',
          name: 'Study',
          plural: 'Studies',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
        },
        {
          graphql: '_study_count',
          name: 'Study',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'The Brain Commons Portal',
      index: {
        introduction: {
          heading: 'Brain Commons',
          text: 'The Brain Commons supports the management, analysis and sharing of brain health data for the research community and ' +
          'aims to accelerate discovery and development of therapies, diagnostic tests, ' +
          'and other technologies for treatment and prevention of diseases impacting the brain. ' +
          'The data commons supports cross-project analyses by harmonizing data from different projects through the collaborative development of a data dictionary, ' +
          'providing an API for data queries and download, and providing a cloud-based analysis workspace with rich tools and resources.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: `The ${commonNames.bhc} Commons define the data in a general way. Please study the dictionary before you start browsing.`,
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '#hostname#shiny/',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',

          },
          {
            name: 'Analyze Data',
            icon: 'data-analyze',
            body: 'Analyze your selected cases using Jupyter Notebooks in our secure cloud environment',
            link: '#hostname#workspace/',
            label: 'Run analysis',
          },
        ],
      },
      navigation: {
        title: 'Brain Commons',
        items: [
          {
            icon: 'dictionary',
            link: '/DD',
            color: '#a2a2a2',
            name: 'Dictionary',
          },
          {
            icon: 'exploration',
            link: '#hostname#shiny/',
            color: '#a2a2a2',
            name: 'Exploration',
          },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'Query' },
          {
            icon: 'files',
            link: '/files',
            color: '#a2a2a2',
            name: 'Files',
          },
          {
            icon: 'workspace',
            link: '#hostname#workspace/',
            color: '#a2a2a2',
            name: 'Workspace',
          },
          {
            icon: 'profile',
            link: '/identity',
            color: '#a2a2a2',
            name: 'Profile',
          },
        ],
      },
      login: {
        title: 'Brain Commons',
        subTitle: 'search, compare, and download data',
        text: 'This website provides a centralized, cloud-based discovery portal for the brain health research community and aims to accelerate discovery and development of therapies, diagnostic tests, and other technologies for the treatment and prevention of diseases impacting the brain.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'support@datacommons.io',
      },
    },
    featureFlags: {
      explorer: true,
    },
    arrangerConfig: {
      charts: {
        project_id: {
          chartType: 'count',
          title: 'Projects',
        },
        node_id: {
          chartType: 'count',
          title: 'Cases',
        },
        primary_diagnosis: {
          chartType: 'stackedBar',
          title: 'Primary Diagnosis',
        },
        gender: {
          chartType: 'pie',
          title: 'Gender',
        },
        race: {
          chartType: 'bar',
          title: 'Race',
        },
        ethnicity: {
          chartType: 'bar',
          title: 'Ethnicity',
        },
      },
      filters: {
        tabs: [{
          title: 'Case',
          fields: [
            'race',
            'ethnicity',
            'gender',
            'demopd_ageassess_age_at_pd',
          ],
        },
        {
          title: 'Medical History',
          fields: [
            'alcohol_use_score',
            'ASPREG_regular_aspirin',
            'childhood_trauma_score',
            'childhood_trauma_diagnosis',
            'depression_diagnosis',
            'depression_severity',
            'hinj_ever_had_a_head_injury_or_concussion',
            'IBUREG_regular_ibuprofen_based_non_aspirin',
            'lrrk2sub_does_subject_carry_lrrk2_mutation',
            'mriyn_mri_completed',
            'NP1DPRS_depressed_moods',
            'primary_diagnosis',
            'tbi_diagnosis',
            'total_tbi',
          ],
        }],
      },
      projectId: 'search',
      graphqlField: 'case',
      index: '',
    },
  },
  bpa: {
    gaTrackingId: 'UA-119127212-2',
    graphql: {
      boardCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
          plural: 'Cases',
        },
        {
          graphql: '_study_count',
          name: 'Study',
          plural: 'Studies',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
        },
        {
          graphql: '_study_count',
          name: 'Study',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'BloodPAC Metadata Submission Portal',
      index: {
        introduction: {
          heading: 'BloodPAC Data Commons',
          text: 'The Blood Profiling Atlas in Cancer (BloodPAC) supports the management, ' +
          'analysis and sharing of liquid biopsy data for the oncology research community and aims to accelerate discovery and development of therapies, ' +
          'diagnostic tests, and other technologies for cancer treatment and prevention. ' +
          'The data commons supports cross-project analyses by harmonizing data from different projects through the collaborative development of a data dictionary, ' +
          'providing an API for data queries and download, ' +
          'and providing a cloud-based analysis workspace with rich tools and resources.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The BloodPAC Data Commons define the data in a general way. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Submit Data',
            icon: 'data-submit',
            body: 'Submit Data based on the dictionary.',
            link: '/submission',
            label: 'Submit data',
          },
          {
            name: 'Explore Data',
            icon: 'data-files',
            body: 'The File page gives you insights and a clear overview of data.',
            link: '/files',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Getting metadata and other clinical variables exposed by API in our secure cloud environment.',
            link: '/query',
            label: 'Query data',

          },
        ],
      },
      navigation: {
        title: 'BloodPAC Data Commons',
        items: [
          { icon: 'dictionary', link: '/DD', color: '#a2a2a2', name: 'Dictionary' },
          {
            icon: 'files',
            link: '/files',
            color: '#daa520',
            name: 'Files',
          },
          {
            icon: 'query',
            link: '/query',
            color: '#a2a2a2',
            name: 'Query',
          },
          {
            icon: 'profile',
            link: '/identity',
            color: '#a2a2a2',
            name: 'Profile',
          },
        ],
      },
      topBar: {
        items: [
          { icon: 'upload-white', link: '/submission', name: 'Data Submission' },
          { link: 'https://www.synapse.org/#!Synapse:syn8011461/wiki/411591', name: 'Documentation' },
        ],
      },
      login: {
        title: 'BloodPAC Data Commons',
        subTitle: 'search, compare, and download data',
        text: 'This website combines liquid biopsy data from academic, government, and industry partners and aims to accelerate discovery and development of therapies, diagnostic tests, and other technologies for the treatment and prevention of cancer.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'bpa-support@datacommons.io',
      },
    },
    featureFlags: {
      explorer: false,
    },
  },
  dcf: {
    gaTrackingId: 'undefined',
    graphql: {
      boardCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
          plural: 'Cases',
        },
        {
          graphql: '_experiment_count',
          name: 'Experiment',
          plural: 'Experiments',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
        },
        {
          graphql: '_experiment_count',
          name: 'Experiment',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'National Cancer Institute Data Commons Framework',
      index: {
        introduction: {
          heading: 'Data Commons',
          text: 'The National Cancer Institute Data Commons Framework supports the management, analysis and sharing of data for the research community.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The National Cancer Institute Data Commons Framework defines the data in a general way. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '#hostname#shiny/',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',
          },
          {
            name: 'Submit Data',
            icon: 'data-submit',
            body: 'Submit Data based on the dictionary.',
            link: '/submission',
            label: 'Submit data',
          },
        ],
      },
      navigation: {
        title: 'National Cancer Institute Data Commons Framework',
        items: [
          {
            icon: 'dictionary',
            link: '/DD',
            color: '#a2a2a2',
            name: 'Dictionary',
          },
          {
            icon: 'exploration',
            link: '#hostname#shiny/',
            color: '#a2a2a2',
            name: 'Exploration',
          },
          { icon: 'files', link: '/files', color: '#a2a2a2', name: 'Files' },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'Query' },
          { icon: 'workspace', link: '#hostname#workspace/', color: '#a2a2a2', name: 'Workspace' },
          {
            icon: 'profile',
            link: '/identity',
            color: '#a2a2a2',
            name: 'Profile',
          },
        ],
      },
      topBar: {
        items: [
          { icon: 'upload-white', link: '/submission', name: 'Data Submission' },
          { link: 'https://uc-cdis.github.io/gen3-user-doc/user-guide/guide-overview', name: 'Documentation' },
        ],
      },
      login: {
        title: 'National Cancer Institute Data Commons Framework',
        subTitle: 'search, compare, and download data',
        text: 'This website supports the management, analysis and sharing of human disease data for the research community and aims to advance basic understanding of the genetic basis of complex traits and accelerate discovery and development of therapies, diagnostic tests, and other technologies for diseases like cancer.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'support@datacommons.io',
      },
    },
    featureFlags: {
      explorer: false,
    },
  },
  edc: {
    gaTrackingId: 'UA-119127212-7',
    graphql: {
      boardCounts: [
        {
          graphql: '_satellite_count',
          name: 'Satellite',
          plural: 'Satellites',
        },
        {
          graphql: '_radar_count',
          name: 'Radar',
          plural: 'Radars',
        },
        {
          graphql: '_weather_station_count',
          name: 'Weather station',
          plural: 'Weather stations',
        },
      ],
      chartCounts: [
        {
          graphql: '_satellite_count',
          name: 'Satellite',
        },
        {
          graphql: '_radar_count',
          name: 'Radar',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'Environmental Data Commons Portal',
      index: {
        introduction: {
          heading: 'Environmental Data Commons',
          text: 'The Environmental Data Commons supports the management, analysis and sharing of environmental data for the research community and aims to accelerate discoveries in environmental science and development of technologies for monitoring and studying the environment. The data commons supports cross-project analyses by harmonizing data from different projects through the collaborative development of a data dictionary, providing an API for data queries and download, and providing a cloud-based analysis workspace with rich tools and resources.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The data are defined in a generic way by the dictionary. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '#hostname#shiny/',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',

          },
          {
            name: 'Analyze Data',
            icon: 'data-analyze',
            body: 'Analyze your selected cases using Jupyter Notebooks in our secure cloud environment',
            link: '#hostname#workspace/',
            label: 'Run analysis',
          },
        ],
      },
      navigation: {
        title: 'Environmental Data Commons',
        items: [
          {
            icon: 'dictionary',
            link: '/DD',
            color: '#a2a2a2',
            name: 'Dictionary',
          },
          {
            icon: 'files',
            link: '/files',
            color: '#a2a2a2',
            name: 'Files',
          },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'query' },
          {
            icon: 'workspace',
            link: '#hostname#workspace/',
            color: '#a2a2a2',
            name: 'Workspace',
          },
          {
            icon: 'profile',
            link: '/identity',
            color: '#a2a2a2',
            name: 'Profile',
          },
        ],
      },
      login: {
        title: 'Environmental Data Commons',
        subTitle: 'search, compare, and download data',
        text: 'This website provides a centralized, cloud-based portal for the open redistribution and analysis of environmental datasets and satellite imagery from OCC stakeholders like NASA and NOAA and aims to support the earth science research community as well as human assisted disaster relief.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'support@datacommons.io',
      },
    },
    featureFlags: {
      explorer: false,
    },
  },
  genomel: {
    gaTrackingId: 'UA-119127212-12',
    graphql: {
      boardCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
          plural: 'Cases',
        },
        {
          graphql: '_sample_count',
          name: 'Sample',
          plural: 'Samples',
        },
        {
          graphql: '_family_count',
          name: 'Family',
          plural: 'Families',
        },
      ],
      chartCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
        },
        {
          graphql: '_sample_count',
          name: 'Sample',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'Genomel Metadata Submission Portal',
      index: {
        introduction: {
          heading: 'Genomel Data Commons',
          text: 'The GenoMEL data commons supports the management, analysis and sharing of human melanoma data for the research community and aims to accelerate discovery and development of therapies, vaccines, diagnostic tests, and other technologies for the treatment and prevention of melanoma. The data commons supports cross-project analyses by harmonizing data from different projects through the collaborative development of a data dictionary, providing an API for data queries and download, and providing a cloud-based analysis workspace with rich tools and resources.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The data are defined in a generic way by the dictionary. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '#hostname#shiny/',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',

          },
          {
            name: 'Analyze Data',
            icon: 'data-analyze',
            body: 'Analyze your selected cases using Jupyter Notebooks in our secure cloud environment',
            link: '#hostname#workspace/',
            label: 'Run analysis',
          },
        ],
      },
      navigation: {
        title: 'Genomel Data Commons',
        items: [
          {
            icon: 'dictionary',
            link: '/DD',
            color: '#a2a2a2',
            name: 'Dictionary',
          },
          {
            icon: 'files',
            link: '/files',
            color: '#a2a2a2',
            name: 'Files',
          },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'query' },
          {
            icon: 'profile',
            link: '/identity',
            color: '#a2a2a2',
            name: 'Profile',
          },
        ],
      },
    },
    featureFlags: {
      explorer: false,
    },
  },
  gdc: {
    components: {
      appName: 'GDC Jamboree Portal',
      buttons: [
        {
          name: 'Define Data Field',
          icon: 'data-field-define',
          body: `The ${commonNames.default} Data Commons define the data in a general way. Please study the dictionary before you start browsing.`,
          link: '/DD',
          label: 'Learn more',
        },
        {
          name: 'Explore Data',
          icon: 'data-explore',
          body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
          link: '#hostname#shiny/',
          label: 'Explore data',
        },
        {
          name: 'Access Data',
          icon: 'data-access',
          body: 'Use our selected tool to filter out the data you need.',
          link: '/query',
          label: 'Query data',
        },
        {
          name: 'Submit Data',
          icon: 'data-submit',
          body: 'Submit Data based on the dictionary.',
          link: '/submission',
          label: 'Submit data',
        },
      ],
      navigation: {
        title: 'Jamboree',
        items: [
          { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
        ],
      },
    },
    featureFlags: {
      explorer: false,
    },
  },
  gtex: {
    gaTrackingId: 'UA-119127212-5',
    graphql: {
      boardCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
          plural: 'Cases',
        },
        {
          graphql: '_study_count',
          name: 'Study',
          plural: 'Studies',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
        },
        {
          graphql: '_study_count',
          name: 'Study',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'NIH Data Commons Consortium Pilot Phase\nNHLBI Data STAGE\nGTEx & TOPMed Data Portal',
      index: {
        introduction: {
          heading: 'Data Commons Pilot & Data STAGE',
          text: 'The Data Commons Pilot & Data STAGE supports the management, analysis and sharing of human disease data for the research community ' +
          'and aims to advance basic understanding of the genetic basis of complex traits and accelerate discovery and development of therapies, ' +
          'diagnostic tests, and other technologies for diseases like cancer. ' +
          'The data commons supports cross-project analyses by harmonizing data from different projects through the collaborative development of a data dictionary, ' +
          'providing an API for data queries and download, and providing a cloud-based analysis workspace with rich tools and resources.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The Data Commons Pilot & Data STAGE define the data in a general way. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '/explorer',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',

          },
          {
            name: 'Analyze Data',
            icon: 'data-analyze',
            body: 'Analyze your selected cases using Jupyter Notebooks in our secure cloud environment',
            link: '#hostname#workspace/',
            label: 'Run analysis',
          },
        ],
      },
      navigation: {
        title: 'DCP & Data STAGE',
        items: [
          { icon: 'dictionary', link: '/DD', color: '#a2a2a2', name: 'Dictionary' },
          { icon: 'exploration', link: '/explorer', color: '#a2a2a2', name: 'Exploration' },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'Query' },
          { icon: 'workspace', link: '#hostname#workspace/', color: '#a2a2a2', name: 'Workspace' },
          { icon: 'profile', link: '/identity', color: '#a2a2a2', name: 'Profile' },
        ],
      },
      login: {
        title: 'Data Commons Pilot & Data STAGE',
        subTitle: 'search, compare, and download data',
        text: 'This website supports the management, analysis and sharing of human disease data for the research community and aims to advance basic understanding of the genetic basis of complex traits and accelerate discovery and development of therapies, diagnostic tests, and other technologies for diseases like cancer.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'support@datacommons.io',
      },
    },
    featureFlags: {
      explorer: true,
    },
    arrangerConfig: {
      charts: {
        project_id: {
          chartType: 'count',
          title: 'Projects',
        },
        node_id: {
          chartType: 'count',
          title: 'Cases',
        },
        gender: {
          chartType: 'pie',
          title: 'Gender',
        },
        race: {
          chartType: 'bar',
          title: 'Race',
        },
      },
      filters: {
        tabs: [{
          title: 'Family History',
          fields: [
            'diabetes',
            'hypertension',
            'cerebrovascular_disease',
            'chronic_respiratory_disease',
            'coronary_artery_disease',
            'asthma',
            'cabg_presence',
            'copd',
            'emphysema',
            'heart_failure',
            'myocardial_infarction',
            'stroke',
            'hypertension_meds',
          ],
        },
        {
          title: 'Diagnosis',
          fields: [
            'diastolic_blood_pressure',
            'systolic_blood_pressure',
          ],
        },
        {
          title: 'Case',
          fields: [
            'project_id',
            'consent_codes',
            'race',
            'ethnicity',
            'gender',
            'bmi',
            'age_at_index',
          ],
        }],
      },
      projectId: 'search',
      graphqlField: 'case',
      index: '',
      table: {
        referenceId: 'submitter_id',
        buttons: [
          {
            enabled: true,
            type: 'data',
            title: 'Download Clinical',
            leftIcon: 'clinical',
            rightIcon: 'download',
            fileName: 'clinical.json',
          },
          {
            enabled: false,
            type: 'manifest',
            title: 'Download Manifest',
            leftIcon: 'datafile',
            rightIcon: 'download',
            fileName: 'manifest.json',
          },
          {
            enabled: true,
            type: 'export',
            title: 'Export to Saturn',
            rightIcon: 'upload',
          },
        ],
      },
    },
  },
  ibdgc: {
    graphql: {
      boardCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
          plural: 'Cases',
        },
        {
          graphql: '_study_count',
          name: 'Study',
          plural: 'Studies',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
        },
        {
          graphql: '_study_count',
          name: 'Study',
        },
      ],
      projectDetails: 'boardCounts',
    },
  },
  kf: {
    gaTrackingId: 'UA-119127212-6',
    graphql: {
      boardCounts: [
        {
          graphql: '_participant_count',
          name: 'Participant',
          plural: 'Participants',
        },
        {
          graphql: '_family_relationship_count',
          name: 'Family relationship',
          plural: 'Family relationships',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_participant_count',
          name: 'Case',
        },
        {
          graphql: '_family_relationship_count',
          name: 'Sample',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'Kids First Data Catalog Portal',
      index: {
        introduction: {
          heading: 'Kids First Data Catalog',
          text: 'The Kids First Data Catalog supports the Kids First Data Resource Center by providing ' +
          'digital object services that allow interoperability between data commons, including ' +
          'authentication and authorization for controlled access data. For more information about the ' +
          'overall Kids First Data Resource Center see https://kidsfirstdrc.org.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The Data Catalog defines the data in a general way. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '#hostname#shiny',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',

          },
          {
            name: 'Analyze Data',
            icon: 'data-analyze',
            body: 'Analyze your selected cases using Jupyter Notebooks in our secure cloud environment',
            link: '#hostname#workspace/',
            label: 'Run analysis',
          },
        ],
      },
      navigation: {
        title: 'Kids First Data Catalog',
        items: [
          { icon: 'dictionary', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
          { icon: 'exploration', link: '/files', color: '#a2a2a2', name: 'exploration' },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'query' },
          { icon: 'profile', link: '/identity', color: '#a2a2a2', name: 'profile' },
        ],
      },
      login: {
        title: 'Kids First Data Catalog',
        subTitle: 'search, compare, and download data',
        text: 'The Kids First Data Catalog supports the Kids First Data Resource Center by providing a digital object services that allow interoperability between data commons, including authentication and authorization for controlled access data. For more information about the overall Kids First Data Resource Center see https://kidsfirstdrc.org.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'support@kidsfirstdrc.org',
      },
    },
    featureFlags: {
      explorer: true,
    },
    arrangerConfig: {
      charts: {
        project_id: {
          chartType: 'count',
          title: 'Projects',
        },
        node_id: {
          chartType: 'count',
          title: 'Cases',
        },
        ethnicity: {
          chartType: 'stackedBar',
          title: 'Ethnicity',
        },
        gender: {
          chartType: 'pie',
          title: 'Gender',
        },
        race: {
          chartType: 'bar',
          title: 'Race',
        },
      },
      filters: {
        tabs: [{
          title: 'Participant',
          fields: [
            'project_id',
            'consent_type',
            'gender',
            'race',
            'ethnicity',
          ],
        }],
      },
      projectId: 'search',
      graphqlField: 'participant',
      index: '',
    },
  },
  kfDcfInterop: {
    // TODO - new GA tracking id?
    gaTrackingId: 'UA-119127212-6',
    graphql: {
      boardCounts: [
        {
          graphql: '_participant_count',
          name: 'Participant',
          plural: 'Participants',
        },
        {
          graphql: '_family_count',
          name: 'Family',
          plural: 'Families',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_participant_count',
          name: 'Participant',
        },
        {
          graphql: '_family_count',
          name: 'Family',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'Pediatric Cancer Commons Pilot',
      index: {
        introduction: {
          heading: 'Pediatric Cancer Commons Pilot',
          text: 'The Pediatric Cancer Commons Pilot is a Trusted Partner of the NIH supported by Gen 3.' +
          'Gen3 is an open source Data Commons platform (https://gen3.org/) supporting a number of ' +
          'large-scale NIH- and non-NIH Commons including the NCI\'s Genomic Data Commons, NHLBI\'s Data ' +
          'Stage, the NIH Data Commons Pilot, and the Bloodpac Data Commons. As such the Pediatric Cancer ' +
          'Commons Pilot also supports the Kids First Data Resource Center by providing digital object services ' +
          'that allow interoperability between existing and future Gen3 data commons, including authentication ' +
          'and authorization for controlled access data.' +
          'For more information about the overall Kids First Data Resource Center and associated tools/portals' +
          'see https://kidsfirstdrc.org.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The Pediatric Cancer Commons Pilot defines the data in a general way. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '#hostname#shiny',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',

          },
          {
            name: 'Analyze Data',
            icon: 'data-analyze',
            body: 'Analyze your selected cases using Jupyter Notebooks in our secure cloud environment',
            link: '#hostname#workspace/',
            label: 'Run analysis',
          },
        ],
      },
      navigation: {
        title: 'Pediatric Cancer Commons Pilot',
        items: [
          { icon: 'dictionary', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
          { icon: 'exploration', link: '/files', color: '#a2a2a2', name: 'exploration' },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'query' },
          { icon: 'profile', link: '/identity', color: '#a2a2a2', name: 'profile' },
        ],
      },
      login: {
        title: 'Pediatric Cancer Commons Pilot',
        subTitle: 'search, compare, and download data',
        text: 'The Pediatric Cancer Commons Pilot is a Trusted Partner of the NIH powered by Gen3. Gen3 is an open source Data Commons platform (https://gen3.org/) supporting a number of large-scale NIH- and non-NIH Commons including the NCI\'s Genomic Data Commons, NHLBI\'s Data Stage, the NIH Data Commons Pilot, and the Bloodpac Data Commons. As such the Gen3 Data Catalog supports the Kids First Data Resource Center by providing digital object services that allow interoperability between existing and future Gen3 data commons, including authentication and authorization for controlled access data. For more information about the overall Kids First Data Resource Center and associated tools/portals see https://kidsfirstdrc.org.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'support@kidsfirstdrc.org',
      },
    },
    featureFlags: {
      explorer: true,
    },
    arrangerConfig: {
      charts: {
        project_id: {
          chartType: 'count',
          title: 'Projects',
        },
        node_id: {
          chartType: 'count',
          title: 'Cases',
        },
        ethnicity: {
          chartType: 'stackedBar',
          title: 'Ethnicity',
        },
        gender: {
          chartType: 'pie',
          title: 'Gender',
        },
        race: {
          chartType: 'bar',
          title: 'Race',
        },
      },
      filters: {
        tabs: [{
          title: 'Participant',
          fields: [
            'project_id',
            'consent_type',
            'gender',
            'race',
            'ethnicity',
          ],
        }],
      },
      projectId: 'search',
      graphqlField: 'participant',
      index: '',
    },
  },
  'ncrdc-demo': {
    gaTrackingId: 'UA-119127212-9',
    graphql: {
      boardCounts: [
        {
          graphql: '_subject_count',
          name: 'Subject',
          plural: 'Subjects',
        },
        {
          graphql: '_study_count',
          name: 'Study',
          plural: 'Studies',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_subject_count',
          name: 'Subject',
        },
        {
          graphql: '_study_count',
          name: 'Study',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'DCF Sandbox',
      buttons: [
        {
          name: 'Define Data Field',
          icon: 'data-field-define',
          body: `The ${commonNames.default} Data Commons define the data in a general way. Please study the dictionary before you start browsing.`,
          link: '/DD',
          label: 'Learn more',
        },
        {
          name: 'Explore Data',
          icon: 'data-explore',
          body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
          link: '#hostname#shiny/',
          label: 'Explore data',
        },
        {
          name: 'Access Data',
          icon: 'data-access',
          body: 'Use our selected tool to filter out the data you need.',
          link: '/query',
          label: 'Query data',
        },
        {
          name: 'Submit Data',
          icon: 'data-submit',
          body: 'Submit Data based on the dictionary.',
          link: '/submission',
          label: 'Submit data',
        },
      ],
      navigation: {
        title: 'DCF Sandbox',
        items: [
          {
            icon: 'dictionary',
            link: '/DD',
            color: '#a2a2a2',
            name: 'Dictionary',
          },
          {
            icon: 'exploration',
            link: '/files',
            color: '#a2a2a2',
            name: 'Exploration',
          },
          {
            icon: 'query', link: '/query', color: '#a2a2a2', name: 'query',
          },
          {
            icon: 'profile',
            link: '/identity',
            color: '#a2a2a2',
            name: 'Profile',
          },
        ],
      },
      login: {
        title: 'DCF Sandbox',
        subTitle: 'explore, analyze, and share research data',
        text: 'The Data Common Frameworks (DCF) supports the management, analysis and sharing of many different types of biomedical data for the research community with the goal of accelerating research in the molecular basis for disease and matching targeted therapies that factor in each patient\'s unique biology.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'support@datacommons.io',
      },
    },
    featureFlags: {
      explorer: false,
    },
  },
  ndh: {
    gaTrackingId: 'UA-119127212-1',
    graphql: {
      boardCounts: [
        {
          graphql: '_subject_count',
          name: 'Subject',
          plural: 'Subjects',
        },
        {
          graphql: '_study_count',
          name: 'Study',
          plural: 'Studies',
        },
        {
          graphql: '_summary_lab_result_count',
          name: 'Lab record',
          plural: 'Lab records',
        },
      ],
      chartCounts: [
        {
          graphql: '_subject_count',
          name: 'Subject',
        },
        {
          graphql: '_study_count',
          name: 'Study',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'NIAID Data Hub',
      index: {
        introduction: {
          heading: 'NIAID Data Hub',
          text: 'The NIAID Data Hub supports the management, analysis and sharing of immunologic data ' +
          'for the research community and aims to accelerate discovery and development of therapies, ' +
          'vaccines, diagnostic tests, and other technologies for the treatment and prevention of infectious, immunologic, and allergic diseases. ' +
          'The data hub supports cross-project analyses by harmonizing data from different projects through ' +
          'the collaborative development of a data dictionary, providing an API for data queries and download, ' +
          'and providing a cloud-based analysis workspace with rich tools and resources.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The NIAID Data Hub define the data in a general way. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '#hostname#shiny',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',

          },
          {
            name: 'Analyze Data',
            icon: 'data-analyze',
            body: 'Analyze your selected cases using Jupyter Notebooks in our secure cloud environment',
            link: '#hostname#workspace/',
            label: 'Run analysis',
          },
        ],
      },
      navigation: {
        title: 'NIAID Data Hub',
        items: [
          { icon: 'dictionary', link: '/DD', color: '#a2a2a2', name: 'Dictionary' },
          { icon: 'exploration', link: '#hostname#shiny/', color: '#a2a2a2', name: 'Exploration' },
          { icon: 'files', link: '/files', color: '#a2a2a2', name: 'Files' },
          { icon: 'analysis', link: '/analysis', color: '#a2a2a2', name: 'Simulation' },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'Query' },
          { icon: 'workspace', link: '#hostname#workspace/', color: '#a2a2a2', name: 'Workspace' },
          { icon: 'profile', link: '/identity', color: '#a2a2a2', name: 'Profile' },
        ],
      },
      login: {
        title: 'NIAID Data Hub',
        subTitle: 'search, compare, and download data',
        text: 'The website combines government datasets from 3 divisions of NIAID to create clean, easy to navigate visualizations for data-driven discovery within Allergy and Infectious Diseases.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'support@datacommons.io',
      },
    },
    featureFlags: {
      explorer: false,
    },
  },
  va: {
    gaTrackingId: 'UA-119127212-10',
    graphql: {
      boardCounts: [
        {
          graphql: '_data_collection_count',
          name: 'Data Collection',
          plural: 'Data Collections',
        },
        {
          graphql: '_clinical_supplement_count',
          name: 'Clinical Supplement',
          plural: 'Clinical Supplements',
        },
        {
          graphql: '_submitted_unaligned_reads_count',
          name: 'Submitted Unaligned Reads',
          plural: 'Submitted Unaligned Reads Files',
        },
        {
          graphql: '_image_exam_file_count',
          name: 'Image Exam File',
          plural: 'Image Exam Files',
        },
      ],
      chartCounts: [
        {
          graphql: '_data_collection_count',
          name: 'Data Collection',
        },
        {
          graphql: '_clinical_supplement_count',
          name: 'Clinical Supplement',
        },
        {
          graphql: '_submitted_unaligned_reads_count',
          name: 'Submitted Unaligned Reads',
        },
        {
          graphql: '_image_exam_file_count',
          name: 'Image Exam File',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'The VA Precision Oncology Data Portal',
      index: {
        introduction: {
          heading: 'VA Data Portal',
          text: 'The VA Data Commons supports the management, analysis and sharing of US military veteran oncologic data for the research community' +
          'and aims to accelerate discovery and development of therapies, diagnostic tests, ' +
          'and other technologies for precision oncology. The data commons supports cross-' +
          'project analyses by harmonizing data from different projects through the collaborative ' +
          'development of a data dictionary, providing an API for data queries and download, and ' +
          'providing a cloud-based analysis workspace with rich tools and resources.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The VA Data Portal defines the data in a general way. Please study the dictionary before you start browsing.',
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'View/Submit Data',
            icon: 'data-submit',
            body: 'View or submit data to a project.',
            link: '/submission',
            label: 'Submit data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',

          },
        ],
      },
      navigation: {
        title: 'VA Data Portal',
        items: [
          {
            icon: 'dictionary',
            link: '/DD',
            color: '#a2a2a2',
            name: 'Dictionary',
          },
          { icon: 'files', link: '/files', color: '#a2a2a2', name: 'Files' },
          {
            icon: 'query',
            link: '/query',
            color: '#a2a2a2',
            name: 'Query',
          },
          {
            icon: 'profile',
            link: '/identity',
            color: '#a2a2a2',
            name: 'Profile',
          },
        ],
      },
    },
    featureFlags: {
      explorer: false,
    },
  },
  default: {
    gaTrackingId: 'undefined',
    graphql: {
      boardCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
          plural: 'Cases',
        },
        {
          graphql: '_experiment_count',
          name: 'Experiment',
          plural: 'Experiments',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
          plural: 'Aliquots',
        },
      ],
      chartCounts: [
        {
          graphql: '_case_count',
          name: 'Case',
        },
        {
          graphql: '_experiment_count',
          name: 'Experiment',
        },
        {
          graphql: '_aliquot_count',
          name: 'Aliquot',
        },
      ],
      projectDetails: 'boardCounts',
    },
    components: {
      appName: 'Generic Data Commons Portal',
      index: {
        introduction: {
          heading: 'Data Commons',
          text: `The ${commonNames.default} Data Commons supports the management, analysis and sharing of data for the research community.`,
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: `The ${commonNames.default} Data Commons define the data in a general way. Please study the dictionary before you start browsing.`,
            link: '/DD',
            label: 'Learn more',
          },
          {
            name: 'Explore Data',
            icon: 'data-explore',
            body: 'The Exploration Page gives you insights and a clear overview under selected factors.',
            link: '/explorer',
            label: 'Explore data',
          },
          {
            name: 'Access Data',
            icon: 'data-access',
            body: 'Use our selected tool to filter out the data you need.',
            link: '/query',
            label: 'Query data',
          },
          {
            name: 'Submit Data',
            icon: 'data-submit',
            body: 'Submit Data based on the dictionary.',
            link: '/submission',
            label: 'Submit data',
          },
        ],
      },
      navigation: {
        title: 'Generic Data Commons',
        items: [
          {
            icon: 'dictionary',
            link: '/DD',
            color: '#a2a2a2',
            name: 'Dictionary',
          },
          {
            icon: 'exploration',
            link: '/explorer',
            color: '#a2a2a2',
            name: 'Exploration',
          },
          { icon: 'files', link: '/files', color: '#a2a2a2', name: 'Files' },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'Query' },
          { icon: 'workspace', link: '#hostname#workspace/', color: '#a2a2a2', name: 'Workspace' },
          {
            icon: 'profile',
            link: '/identity',
            color: '#a2a2a2',
            name: 'Profile',
          },
        ],
      },
      topBar: {
        items: [
          { icon: 'upload-white', link: '/submission', name: 'Data Submission' },
          { link: 'https://uc-cdis.github.io/gen3-user-doc/user-guide/guide-overview', name: 'Documentation' },
        ],
      },
      login: {
        title: 'Generic Data Commons',
        subTitle: 'search, compare, and download data',
        text: 'This website supports the management, analysis and sharing of human disease data for the research community and aims to advance basic understanding of the genetic basis of complex traits and accelerate discovery and development of therapies, diagnostic tests, and other technologies for diseases like cancer.',
        contact: 'If you have any questions about access or the registration process, please contact ',
        email: 'support@datacommons.io',
      },
    },
    featureFlags: {
      explorer: true,
    },
    arrangerConfig: {
      charts: {
        project: {
          chartType: 'count',
          title: 'Projects',
        },
        study: {
          chartType: 'count',
          title: 'Studies',
        },
        file_type: {
          chartType: 'count',
          title: 'File Types',
        },
        ethnicity: {
          chartType: 'stackedBar',
          title: 'Ethnicity',
        },
        gender: {
          chartType: 'pie',
          title: 'Gender',
        },
        race: {
          chartType: 'pie',
          title: 'Race',
        },
        vital_status: {
          chartType: 'bar',
          title: 'Vital Status',
        },
      },
      filters: {
        tabs: [{
          title: 'Project',
          fields: [
            'project',
            'study',
          ],
        },
        {
          title: 'Subject',
          fields: [
            'race',
            'ethnicity',
            'gender',
            'vital_status',
          ],
        },
        {
          title: 'File',
          fields: [
            'file_type',
          ],
        }],
      },
      projectId: 'search',
      graphqlField: 'subject',
      index: '',
      manifestMapping: {
        fileIndexType: 'file',
        fileIdField: 'uuid',
        fileReferenceIdField: 'subject_id',
      },
      table: {
        buttons: [
          {
            enabled: true,
            type: 'data',
            title: 'Download Clinical',
            leftIcon: 'clinical',
            rightIcon: 'download',
            fileName: 'clinical.json',
          },
          {
            enabled: false,
            type: 'manifest',
            title: 'Download Manifest',
            leftIcon: 'datafile',
            rightIcon: 'download',
            fileName: 'manifest.json',
          },
        ],
      },
    },
  },
};

module.exports = {
  params,
};
