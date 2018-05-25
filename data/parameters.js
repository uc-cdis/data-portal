const commonNames = {
  acct: 'ACCOuNT',
  bhc: 'BRAIN',
  bpa: 'BloodPAC',
  edc: 'Environmental',
  genomel: 'Genomel',
  gdc: 'Jamboree',
  gtex: 'Data Common Pilot',
  kf: 'KidsFirst',
  ndh: 'NIAID',
  default: 'Generic',
};

const params = {
  acct: {
    components: {
      appName: 'ACCOuNT Data Commons Portal',
      navigation: {
        title: 'ACCOuNT Data Hub',
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
    },
  },
  bhc: {
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
          heading: 'Data Commons Hub',
          text: 'The Brain Health Data Commons supports the management, analysis and sharing of brain health data for the research community and ' +
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
            body: `The ${commonNames.bhc} Data Hub define the data in a general way. Please study the dictionary before you start browsing.`,
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
        title: 'BRAIN Data Hub',
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
    },
  },
  bpa: {
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
          heading: 'Data Commons Hub',
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
            body: 'The BloodPAC Data Hub define the data in a general way. Please study the dictionary before you start browsing.',
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
        title: 'BloodPAC Data Hub',
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
    },
  },
  edc: {
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
          text: 'The Environmental Data Commons supports the management, analysis and sharing of environmental data for the research community and aims to accelerate discoveries in environmental science and development of technologies for monitoring and studying the environment. The data hub supports cross-project analyses by harmonizing data from different projects through the collaborative development of a data dictionary, providing an API for data queries and download, and providing a cloud-based analysis workspace with rich tools and resources.',
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
    },
  },
  genomel: {
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
          heading: 'Genomel Data Hub',
          text: 'The GenoMEL data commons supports the management, analysis and sharing of human melanoma data for the research community and aims to accelerate discovery and development of therapies, vaccines, diagnostic tests, and other technologies for the treatment and prevention of melanoma. The data hub supports cross-project analyses by harmonizing data from different projects through the collaborative development of a data dictionary, providing an API for data queries and download, and providing a cloud-based analysis workspace with rich tools and resources.',
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
        title: 'Genomel Data Hub',
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
  },
  gdc: {
    components: {
      appName: 'GDC Jamboree Portal',
      navigation: {
        title: 'Jamboree',
        items: [
          { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
        ],
      },
    },
  },
  gtex: {
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
      appName: 'NIH Data Commons Consortium Pilot Phase\nGTEx & TOPMed Data Portal',
      index: {
        introduction: {
          heading: 'Data Commons Pilot',
          text: 'The Data Commons Pilot supports the management, analysis and sharing of human disease data for the research community ' +
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
            body: 'The Data Commons Pilot define the data in a general way. Please study the dictionary before you start browsing.',
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
        title: 'DCP Data Hub',
        items: [
          { icon: 'dictionary', link: '/DD', color: '#a2a2a2', name: 'Dictionary' },
          { icon: 'exploration', link: '#hostname#shiny/', color: '#a2a2a2', name: 'Exploration' },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'Query' },
          { icon: 'workspace', link: '#hostname#workspace/', color: '#a2a2a2', name: 'Workspace' },
          { icon: 'profile', link: '/identity', color: '#a2a2a2', name: 'Profile' },
        ],
      },
    },
  },
  kf: {
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
      appName: 'Gabriella Miller Kids First Pediatric Data Coordinating Center Portal',
      index: {
        introduction: {
          heading: 'Kids First Data Common',
          text: 'The Kids First data commons supports the management, analysis and sharing of data for ' +
          'the pediatric oncology research community and aims to accelerate discovery and development of therapies, diagnostic tests, ' +
          'and other technologies for the treatment and prevention of cancer in children. ' +
          'The data commons supports cross-project analyses by harmonizing data from different projects through ' +
          'the collaborative development of a data dictionary, providing an API for data queries and download, ' +
          'and providing a cloud-based analysis workspace with rich tools and resources.',
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: 'The Data Commons Pilot define the data in a general way. Please study the dictionary before you start browsing.',
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
        title: 'KidFirst Data hub',
        items: [
          { icon: 'dictionary', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
          { icon: 'exploration', link: '/files', color: '#a2a2a2', name: 'exploration' },
          { icon: 'query', link: '/query', color: '#a2a2a2', name: 'query' },
          { icon: 'workspace', link: '#hostname#jupyter/', color: '#a2a2a2', name: 'workspace' },
          { icon: 'profile', link: '/identity', color: '#a2a2a2', name: 'profile' },
        ],
      },
    },
  },
  ndh: {
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
        {
          graphql: '_summary_socio_demographic_count',
          name: 'Socio-demographic record',
          plural: 'Socio-demographic records',
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
      appName: 'NIAID Data Hub Portal',
      index: {
        introduction: {
          heading: 'NIAID Data Commons Hub',
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
    },
  },
  va: {
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
		  body: `The VA Data Portal defines the data in a general way. Please study the dictionary before you start browsing.`,
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
  },
  default: {
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
          heading: 'Data Commons Hub',
          text: `The ${commonNames.default} Data Hub supports the management, analysis and sharing of data for the research community.`,
          link: '/submission',
        },
        buttons: [
          {
            name: 'Define Data Field',
            icon: 'data-field-define',
            body: `The ${commonNames.default} Data Hub define the data in a general way. Please study the dictionary before you start browsing.`,
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
        ],
      },
      navigation: {
        title: 'Generic Data Hub',
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
    },
  },
};

module.exports = {
  params,
};
