const dict = {
  _definitions: {
    UUID: {
      pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
      term: {
        description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
        termDef: {
          cde_id: 'C54100',
          cde_version: null,
          source: 'NCIt',
          term: 'Universally Unique Identifier',
          term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
        },
      },
      type: 'string',
    },
    data_bundle_state: {
      default: 'submitted',
      description: 'State of a data bundle.',
      enum: [
        'submitted',
        'validated',
        'error',
        'released',
        'suppressed',
        'redacted',
      ],
    },
    data_file_error_type: {
      enum: [
        'file_size',
        'file_format',
        'md5sum',
      ],
      term: {
        description: 'Type of error for the data file object.\n',
      },
    },
    data_file_properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      error_type: {
        enum: [
          'file_size',
          'file_format',
          'md5sum',
        ],
        term: {
          description: 'Type of error for the data file object.\n',
        },
      },
      file_name: {
        term: {
          description: 'The name (or part of a name) of a file (of any type).\n',
        },
        type: 'string',
      },
      file_size: {
        term: {
          description: 'The size of the data file (object) in bytes.\n',
        },
        type: 'number',
      },
      file_state: {
        default: 'registered',
        enum: [
          'registered',
          'uploading',
          'uploaded',
          'validating',
          'validated',
          'submitted',
          'processing',
          'processed',
          'released',
          'error',
        ],
        term: {
          description: 'The current state of the data file object.\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      md5sum: {
        term: {
          description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      state_comment: {
        description: 'Optional comment about why the file is in the current state, mainly for invalid state.\n',
        type: 'string',
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    datetime: {
      oneOf: [
        {
          format: 'date-time',
          type: 'string',
        },
        {
          type: 'null',
        },
      ],
      term: {
        description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
      },
    },
    file_format: {
      term: {
        $ref: '_terms.yaml#/file_format',
      },
      type: 'string',
    },
    file_name: {
      term: {
        description: 'The name (or part of a name) of a file (of any type).\n',
      },
      type: 'string',
    },
    file_size: {
      term: {
        description: 'The size of the data file (object) in bytes.\n',
      },
      type: 'number',
    },
    file_state: {
      default: 'registered',
      enum: [
        'registered',
        'uploading',
        'uploaded',
        'validating',
        'validated',
        'submitted',
        'processing',
        'processed',
        'released',
        'error',
      ],
      term: {
        description: 'The current state of the data file object.\n',
      },
    },
    foreign_key: {
      additionalProperties: true,
      properties: {
        id: {
          pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
          term: {
            description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
            termDef: {
              cde_id: 'C54100',
              cde_version: null,
              source: 'NCIt',
              term: 'Universally Unique Identifier',
              term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
            },
          },
          type: 'string',
        },
        submitter_id: {
          type: 'string',
        },
      },
      type: 'object',
    },
    id: '_definitions',
    md5sum: {
      term: {
        description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
      },
      type: 'string',
    },
    parent_uuids: {
      items: {
        $ref: '#/UUID',
      },
      minItems: 1,
      type: 'array',
      uniqueItems: true,
    },
    project_id: {
      term: {
        description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
      },
      type: 'string',
    },
    qc_metrics_state: {
      enum: [
        'FAIL',
        'PASS',
        'WARN',
      ],
      term: {
        description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
        termDef: {
          cde_id: null,
          cde_version: null,
          source: 'FastQC',
          term: 'QC Metric State',
          term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
        },
      },
    },
    release_state: {
      default: 'unreleased',
      description: 'Release state of an entity.',
      enum: [
        'unreleased',
        'released',
        'redacted',
      ],
    },
    state: {
      default: 'validated',
      downloadable: [
        'uploaded',
        'md5summed',
        'validating',
        'validated',
        'error',
        'invalid',
        'released',
      ],
      oneOf: [
        {
          enum: [
            'uploading',
            'uploaded',
            'md5summing',
            'md5summed',
            'validating',
            'error',
            'invalid',
            'suppressed',
            'redacted',
            'live',
          ],
        },
        {
          enum: [
            'validated',
            'submitted',
            'released',
          ],
        },
      ],
      public: [
        'live',
      ],
      term: {
        description: 'The current state of the object.\n',
      },
    },
    to_many: {
      anyOf: [
        {
          items: {
            additionalProperties: true,
            minItems: 1,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
          type: 'array',
        },
        {
          additionalProperties: true,
          properties: {
            id: {
              pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
              term: {
                description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                termDef: {
                  cde_id: 'C54100',
                  cde_version: null,
                  source: 'NCIt',
                  term: 'Universally Unique Identifier',
                  term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                },
              },
              type: 'string',
            },
            submitter_id: {
              type: 'string',
            },
          },
          type: 'object',
        },
      ],
    },
    to_one: {
      anyOf: [
        {
          items: {
            additionalProperties: true,
            maxItems: 1,
            minItems: 1,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
          type: 'array',
        },
        {
          additionalProperties: true,
          properties: {
            id: {
              pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
              term: {
                description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                termDef: {
                  cde_id: 'C54100',
                  cde_version: null,
                  source: 'NCIt',
                  term: 'Universally Unique Identifier',
                  term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                },
              },
              type: 'string',
            },
            submitter_id: {
              type: 'string',
            },
          },
          type: 'object',
        },
      ],
    },
    workflow_properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      workflow_end_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      workflow_link: {
        description: 'Link to Github hash for the CWL workflow used.',
        type: 'string',
      },
      workflow_start_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      workflow_version: {
        description: 'Major version for a GDC workflow.',
        type: 'string',
      },
    },
  },
  _terms: {
    '28s_16s_ribosomal_rna_ratio': {
      description: 'The 28S/18S ribosomal RNA band ratio used to assess the quality of total RNA.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: '28s/18s Ribosomal RNA Ratio',
        term_url: null,
      },
    },
    RIN: {
      description: 'A numerical assessment of the integrity of RNA based on the entire electrophoretic trace of the RNA sample including the presence or absence of degradation products.\n',
      termDef: {
        cde_id: 5278775,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Biospecimen RNA Integrity Number Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5278775&version=1.0',
      },
    },
    UUID: {
      description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
      termDef: {
        cde_id: 'C54100',
        cde_version: null,
        source: 'NCIt',
        term: 'Universally Unique Identifier',
        term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
      },
    },
    a260_a280_ratio: {
      description: 'Numeric value that represents the sample ratio of nucleic acid absorbance at 260 nm and 280 nm, used to determine a measure of DNA purity.\n',
      termDef: {
        cde_id: 5432595,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Nucleic Acid Absorbance at 260 And Absorbance at 280 DNA Purity Ratio Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432595&version=1.0',
      },
    },
    adapter_name: {
      description: 'Name of the sequencing adapter.\n',
    },
    adapter_sequence: {
      description: 'Base sequence of the sequencing adapter.\n',
    },
    age_at_diagnosis: {
      description: 'Age at the time of diagnosis expressed in number of days since birth.\n',
      termDef: {
        cde_id: 3225640,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Patient Diagnosis Age Day Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3225640&version=2.0',
      },
    },
    ajcc_clinical_m: {
      description: 'Extent of the distant metastasis for the cancer based on evidence obtained from clinical assessment parameters determined prior to treatment.\n',
      termDef: {
        cde_id: 3440331,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Neoplasm American Joint Committee on Cancer Clinical Distant Metastasis M Stage',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3440331&version=1.0',
      },
    },
    ajcc_clinical_n: {
      description: 'Extent of the regional lymph node involvement for the cancer based on evidence obtained from clinical assessment parameters determined prior to treatment.\n',
      termDef: {
        cde_id: 3440330,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Neoplasm American Joint Committee on Cancer Clinical Regional Lymph Node N Stage',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3440330&version=1.0',
      },
    },
    ajcc_clinical_stage: {
      description: 'Stage group determined from clinical information on the tumor (T), regional node (N) and metastases (M) and by grouping cases with similar prognosis for cancer.\n',
      termDef: {
        cde_id: 3440332,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Neoplasm American Joint Committee on Cancer Clinical Group Stage',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3440332&version=1.0',
      },
    },
    ajcc_clinical_t: {
      description: 'Extent of the primary cancer based on evidence obtained from clinical assessment parameters determined prior to treatment.\n',
      termDef: {
        cde_id: 3440328,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Neoplasm American Joint Committee on Cancer Clinical Primary Tumor T Stage',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3440328&version=1.0',
      },
    },
    ajcc_pathologic_m: {
      description: 'Code to represent the defined absence or presence of distant spread or metastases (M) to locations via vascular channels or lymphatics beyond the regional lymph nodes, using criteria established by the American Joint Committee on Cancer (AJCC).\n',
      termDef: {
        cde_id: 3045439,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'American Joint Committee on Cancer Metastasis Stage Code',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3045439&version=1.0',
      },
    },
    ajcc_pathologic_n: {
      description: 'The codes that represent the stage of cancer based on the nodes present (N stage) according to criteria based on multiple editions of the AJCC\'s Cancer Staging Manual.\n',
      termDef: {
        cde_id: 3203106,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Neoplasm Disease Lymph Node Stage American Joint Committee on Cancer Code',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3203106&version=1.0',
      },
    },
    ajcc_pathologic_stage: {
      description: 'The extent of a cancer, especially whether the disease has spread from the original site to other parts of the body based on AJCC staging criteria.\n',
      termDef: {
        cde_id: 3203222,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Neoplasm Disease Stage American Joint Committee on Cancer Code',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3203222&version=1.0',
      },
    },
    ajcc_pathologic_t: {
      description: 'Code of pathological T (primary tumor) to define the size or contiguous extension of the primary tumor (T), using staging criteria from the American Joint Committee on Cancer (AJCC).\n',
      termDef: {
        cde_id: 3045435,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'American Joint Committee on Cancer Tumor Stage Code',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3045435&version=1.0',
      },
    },
    alcohol_history: {
      description: 'A response to a question that asks whether the participant has consumed at least 12 drinks of any kind of alcoholic beverage in their lifetime.\n',
      termDef: {
        cde_id: 2201918,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Alcohol Lifetime History Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2201918&version=1.0',
      },
    },
    alcohol_intensity: {
      description: 'Category to describe the patient\'s current level of alcohol use as self-reported by the patient.\n',
      termDef: {
        cde_id: 3457767,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Person Self-Report Alcoholic Beverage Exposure Category',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3457767&version=1.0',
      },
    },
    aliquot_quantity: {
      description: 'The quantity in micrograms (ug) of the aliquot(s) derived from the analyte(s) shipped for sequencing and characterization.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Biospecimen Aliquot Quantity',
        term_url: null,
      },
    },
    aliquot_volume: {
      description: 'The volume in microliters (ml) of the aliquot(s) derived from the analyte(s) shipped for sequencing and characterization.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Biospecimen Aliquot Volume',
        term_url: null,
      },
    },
    amount: {
      description: 'Weight in grams or volume in mL.\n',
    },
    analyte_quantity: {
      description: 'The quantity in micrograms (ug) of the analyte(s) derived from the analyte(s) shipped for sequencing and characterization.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Biospecimen Analyte Quantity',
        term_url: null,
      },
    },
    analyte_type: {
      description: 'Text term that represents the kind of molecular specimen analyte.\n',
      termDef: {
        cde_id: 2513915,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Molecular Specimen Type Text Name',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2513915&version=2.0',
      },
    },
    analyte_type_id: {
      description: 'A single letter code used to identify a type of molecular analyte.\n',
      termDef: {
        cde_id: 5432508,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Molecular Analyte Identification Code',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432508&version=1.0',
      },
    },
    analyte_volume: {
      description: 'The volume in microliters (ml) of the analyte(s) derived from the analyte(s) shipped for sequencing and characterization.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Biospecimen Analyte Volume',
        term_url: null,
      },
    },
    ann_arbor_b_symptoms: {
      description: 'Text term to signify whether lymphoma B-symptoms are present as noted in the patient\'s medical record.\n',
      termDef: {
        cde_id: 2902402,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Lymphoma B-Symptoms Medical Record Documented Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2902402&version=1.0',
      },
    },
    ann_arbor_clinical_stage: {
      description: 'The classification of the clinically confirmed anatomic disease extent of lymphoma (Hodgkin\'s and Non-Hodgkins) based on the Ann Arbor Staging System.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Ann Arbor Clinical Stage',
        term_url: null,
      },
    },
    ann_arbor_extranodal_involvement: {
      description: 'Indicator that identifies whether a patient with malignant lymphoma has lymphomatous involvement of an extranodal site.\n',
      termDef: {
        cde_id: 3364582,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Lymphomatous Extranodal Site Involvement Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3364582&version=1.0',
      },
    },
    ann_arbor_pathologic_stage: {
      description: 'The classification of the pathologically confirmed anatomic disease extent of lymphoma (Hodgkin\'s and Non-Hodgkins) based on the Ann Arbor Staging System.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Ann Arbor Pathologic Stage',
        term_url: null,
      },
    },
    ann_arbor_tumor_stage: {
      description: 'The classification of the anatomic disease extent of lymphoma (Hodgkin\'s and Non-Hodgkins) based on the Ann Arbor Staging System.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Ann Arbor Tumor Stage',
        term_url: null,
      },
    },
    base_caller_name: {
      description: 'Name of the base caller.\n',
    },
    base_caller_version: {
      description: 'Version of the base caller.\n',
    },
    biomarker_name: {
      description: 'The name of the biomarker being tested for this specimen and set of test results.\n',
      termDef: {
        cde_id: 5473,
        cde_version: 11.0,
        source: 'caDSR',
        term: 'Biomarker Name',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5473&version=2.31',
      },
    },
    biomarker_result: {
      description: 'Text term to define the results of genetic testing.\n',
      termDef: {
        cde_id: 3234680,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Laboratory Procedure Genetic Abnormality Test Result Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3234680&version=1.0',
      },
    },
    biomarker_test_method: {
      description: 'Text descriptor of a molecular analysis method used for an individual.\n',
      termDef: {
        cde_id: 3121575,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Disease Detection Molecular Analysis Method Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3121575&version=1.0',
      },
    },
    biospecimen_anatomic_site: {
      description: 'Text term that represents the name of the primary disease site of the submitted tumor sample.\n',
      termDef: {
        cde_id: 4742851,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Submitted Tumor Sample Primary Anatomic Site',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4742851&version=1.0',
      },
    },
    bmi: {
      description: 'The body mass divided by the square of the body height expressed in units of kg/m^2.\n',
      termDef: {
        cde_id: 4973892,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Body Mass Index (BMI)',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4973892&version=1.0',
      },
    },
    burkitt_lymphoma_clinical_variant: {
      description: 'Burkitt\'s lymphoma categorization based on clinical features that differ from other forms of the same disease.\n',
      termDef: {
        cde_id: 3770421,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Burkitt Lymphoma Clinical Variant Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3770421&version=1.0',
      },
    },
    cause_of_death: {
      description: 'Text term to identify the cause of death for a patient.\n',
      termDef: {
        cde_id: 2554674,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Patient Death Reason',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2554674&version=3.0',
      },
    },
    cea_level_preoperative: {
      description: 'Numeric value of the Carcinoembryonic antigen or CEA at the time before surgery. [Manually- curated]\n',
      termDef: {
        cde_id: 2716510,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Preoperative Carcinoembryonic Antigen Result Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2716510&version=1.0',
      },
    },
    cigarettes_per_day: {
      description: 'The average number of cigarettes smoked per day.\n',
      termDef: {
        cde_id: 2001716,
        cde_version: 4.0,
        source: 'caDSR',
        term: 'Smoking Use Average Number',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2001716&version=4.0',
      },
    },
    circumferential_resection_margin: {
      description: 'A value in millimeters indicating the measured length between a malignant lesion of the colon or rectum and the nearest radial (or circumferential) border of tissue removed during cancer surgery.\n',
      termDef: {
        cde_id: 64202,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Colorectal Surgical Margin Circumferential Distance Measurement',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=64202&version=3.0',
      },
    },
    classification_of_tumor: {
      description: 'Text that describes the kind of disease present in the tumor specimen as related to a specific timepoint.\n',
      termDef: {
        cde_id: 3288124,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tumor Tissue Disease Description Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3288124&version=1.0',
      },
    },
    colon_polyps_history: {
      description: 'Yes/No indicator to describe if the subject had a previous history of colon polyps as noted in the history/physical or previous endoscopic report (s).\n',
      termDef: {
        cde_id: 3107197,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Colon Carcinoma Polyp Occurrence Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3107197&version=1.0',
      },
    },
    composition: {
      description: 'Text term that represents the cellular composition of the sample.\n',
      termDef: {
        cde_id: 5432591,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Biospecimen Cellular Composition Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432591&version=1.0',
      },
    },
    concentration: {
      description: 'Numeric value that represents the concentration of an analyte or aliquot extracted from the sample or sample portion, measured in milligrams per milliliter.\n',
      termDef: {
        cde_id: 5432594,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Biospecimen Analyte or Aliquot Extracted Concentration Milligram per Milliliter Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432594&version=1.0',
      },
    },
    creation_datetime: {
      description: 'The datetime of portion creation encoded as seconds from epoch.\n',
      termDef: {
        cde_id: 5432592,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Biospecimen Portion Creation Seconds Date/Time',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432592&version=1.0',
      },
    },
    current_weight: {
      description: 'Numeric value that represents the current weight of the sample, measured  in milligrams.\n',
      termDef: {
        cde_id: 5432606,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Current Weight Milligram Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432606&version=1.0',
      },
    },
    data_category: {
      description: 'Broad categorization of the contents of the data file.\n',
    },
    data_file_error_type: {
      description: 'Type of error for the data file object.\n',
    },
    data_format: {
      description: 'Format of the data files.\n',
    },
    data_type: {
      description: 'Specific content type of the data file.\n',
    },
    datetime: {
      description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
    },
    days_to_birth: {
      description: 'Time interval from a person\'s date of birth to the date of initial pathologic diagnosis, represented as a calculated negative number of days.\n',
      termDef: {
        cde_id: 3008233,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Person Birth Date Less Initial Pathologic Diagnosis Date Calculated Day Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3008233&version=1.0',
      },
    },
    days_to_collection: {
      description: 'Time interval from the date of biospecimen collection to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
      termDef: {
        cde_id: 3008340,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Biospecimen Collection Date Less Initial Pathologic Diagnosis Date Calculated Day Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3008340&version=1.0',
      },
    },
    days_to_death: {
      description: 'Time interval from a person\'s date of death to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
      termDef: {
        cde_id: 3165475,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Death Less Initial Pathologic Diagnosis Date Calculated Day Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3165475&version=1.0',
      },
    },
    days_to_hiv_diagnosis: {
      description: 'Time interval from the date of the initial pathologic diagnosis to the date of human immunodeficiency diagnosis, represented as a calculated number of days.\n',
      termDef: {
        cde_id: 4618491,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Human Immunodeficiency Virus Diagnosis Subtract Initial Pathologic Diagnosis Time Duration Day Calculation Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4618491&version=1.0',
      },
    },
    days_to_last_follow_up: {
      description: 'Time interval from the date of last follow up to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
      termDef: {
        cde_id: 3008273,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Last Communication Contact Less Initial Pathologic Diagnosis Date Calculated Day Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3008273&version=1.0',
      },
    },
    days_to_last_known_disease_status: {
      description: 'Time interval from the date of last follow up to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
      termDef: {
        cde_id: 3008273,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Last Communication Contact Less Initial Pathologic Diagnosis Date Calculated Day Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3008273&version=1.0',
      },
    },
    days_to_new_event: {
      description: 'Time interval from the date of new tumor event including progression, recurrence and new primary malignacies to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
      termDef: {
        cde_id: 3392464,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'New Tumor Event Less Initial Pathologic Diagnosis Date Calculated Day Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3392464&version=1.0',
      },
    },
    days_to_recurrence: {
      description: 'Time interval from the date of new tumor event including progression, recurrence and new primary malignancies to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
      termDef: {
        cde_id: 3392464,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'New Tumor Event Less Initial Pathologic Diagnosis Date Calculated Day Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3392464&version=1.0',
      },
    },
    days_to_sample_procurement: {
      description: 'The number of days from the date the patient was diagnosed to the date of the procedure that produced the sample.\n',
    },
    days_to_treatment: {
      description: 'Number of days from date of initial pathologic diagnosis that treatment began.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Days to Treatment Start',
        term_url: null,
      },
    },
    days_to_treatment_end: {
      description: 'Time interval from the date of the initial pathologic diagnosis to the date of treatment end, represented as a calculated number of days.\n',
      termDef: {
        cde_id: 5102431,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Treatment End Subtract First Pathologic Diagnosis Day Calculation Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5102431&version=1.0',
      },
    },
    days_to_treatment_start: {
      description: 'Time interval from the date of the initial pathologic diagnosis to the start of treatment, represented as a calculated number of days.\n',
      termDef: {
        cde_id: 5102411,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Treatment Start Subtract First Pathologic Diagnosis Time Day Calculation Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5102411&version=1.0',
      },
    },
    diagnosis_pathologically_confirmed: {
      description: 'The histologic description of tissue or cells confirmed by a pathology review of frozen or formalin fixed slide(s) completed after the diagnostic pathology review of the tumor sample used to extract analyte(s).\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Post-Diagnostic Pathology Review Confirmation',
        term_url: null,
      },
    },
    dlco_ref_predictive_percent: {
      description: 'The value, as a percentage of predicted lung volume, measuring the amount of carbon monoxide detected in a patient\'s lungs.\n',
      termDef: {
        cde_id: 2180255,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Lung Carbon Monoxide Diffusing Capability Test Assessment Predictive Value Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2180255&version=1.0',
      },
    },
    encoding: {
      description: 'Version of ASCII encoding of quality values found in the file.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: 'FastQC',
        term: 'Encoding',
        term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/1%20Basic%20Statistics.html',
      },
    },
    estrogen_receptor_percent_positive_ihc: {
      description: 'Classification to represent ER Positive results expressed as a percentage value.\n',
      termDef: {
        cde_id: 3128341,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'ER Level Cell Percentage Category',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3128341&version=1.0',
      },
    },
    estrogen_receptor_result_ihc: {
      description: 'Text term to represent the overall result of Estrogen Receptor (ER) testing.\n',
      termDef: {
        cde_id: 2957359,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Breast Carcinoma Estrogen Receptor Status',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2957359&version=2.0',
      },
    },
    ethnicity: {
      description: 'An individual\'s self-described social and cultural grouping, specifically whether an individual describes themselves as Hispanic or Latino. The provided values are based on the categories defined by the U.S. Office of Management and Business and used by the U.S. Census Bureau.\n',
      termDef: {
        cde_id: 2192217,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Ethnic Group Category Text',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2192217&version=2.0',
      },
    },
    experiment_name: {
      description: 'Submitter-defined name for the experiment.\n',
    },
    experimental_strategy: {
      description: 'The sequencing strategy used to generate the data file.\n',
    },
    fastq_name: {
      description: 'Names of FASTQs.\n',
    },
    fev1_fvc_post_bronch_percent: {
      description: 'Percentage value to represent result of Forced Expiratory Volume in 1 second (FEV1) divided by the Forced Vital Capacity (FVC) post-bronchodilator.\n',
      termDef: {
        cde_id: 3302956,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Post Bronchodilator FEV1/FVC Percent Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3302956&version=1.0',
      },
    },
    fev1_fvc_pre_bronch_percent: {
      description: 'Percentage value to represent result of Forced Expiratory Volume in 1 second (FEV1) divided by the Forced Vital Capacity (FVC) pre-bronchodilator.\n',
      termDef: {
        cde_id: 3302955,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Pre Bronchodilator FEV1/FVC Percent Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3302955&version=1.0',
      },
    },
    fev1_ref_post_bronch_percent: {
      description: 'The percentage comparison to a normal value reference range of the volume of air that a patient can forcibly exhale from the lungs in one second post-bronchodilator.\n',
      termDef: {
        cde_id: 3302948,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Post Bronchodilator Lung Forced Expiratory Volume 1 Test Lab Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3302948&version=1.0',
      },
    },
    fev1_ref_pre_bronch_percent: {
      description: 'The percentage comparison to a normal value reference range of the volume of air that a patient can forcibly exhale from the lungs in one second pre-bronchodilator.\n',
      termDef: {
        cde_id: 3302947,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Pre Bronchodilator Lung Forced Expiratory Volume 1 Test Lab Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3302947&version=1.0',
      },
    },
    figo_stage: {
      description: 'The extent of a cervical or endometrial cancer within the body, especially whether the disease has spread from the original site to other parts of the body, as described by the International Federation of Gynecology and Obstetrics (FIGO) stages.\n',
      termDef: {
        cde_id: 3225684,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Gynecologic Tumor Grouping Cervical Endometrial FIGO 2009 Stage',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3225684&version=1.0',
      },
    },
    file_name: {
      description: 'The name (or part of a name) of a file (of any type).\n',
    },
    file_size: {
      description: 'The size of the data file (object) in bytes.\n',
    },
    file_state: {
      description: 'The current state of the data file object.\n',
    },
    flow_cell_barcode: {
      description: 'Flow Cell Barcode.\n',
    },
    freezing_method: {
      description: 'Text term that represents the method used for freezing the sample.\n',
      termDef: {
        cde_id: 5432607,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Freezing Method Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432607&version=1.0',
      },
    },
    gender: {
      description: 'Text designations that identify gender. Gender is described as the assemblage of properties that distinguish people on the basis of their societal roles. [Explanatory Comment 1: Identification of gender is based upon self-report and may come from a form, questionnaire, interview, etc.]\n',
      termDef: {
        cde_id: 2200604,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Person Gender Text Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2200604&version=3.0',
      },
    },
    height: {
      description: 'The height of the patient in centimeters.\n',
      termDef: {
        cde_id: 649,
        cde_version: 4.1,
        source: 'caDSR',
        term: 'Patient Height Measurement',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=649&version=4.1',
      },
    },
    her2_erbb2_percent_positive_ihc: {
      description: 'Classification to represent the number of positive HER2/ERBB2 cells in a specimen or sample.\n',
      termDef: {
        cde_id: 3086980,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'HER2 ERBB Positive Finding Cell Percentage Category',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3086980&version=1.0',
      },
    },
    her2_erbb2_result_fish: {
      description: 'the type of outcome for HER2 as determined by an in situ hybridization (ISH) assay.\n',
      termDef: {
        cde_id: 2854089,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Laboratory Procedure HER2/neu in situ Hybridization Outcome Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2854089&version=1.0',
      },
    },
    her2_erbb2_result_ihc: {
      description: 'Text term to signify the result of the medical procedure that involves testing a sample of blood or tissue for HER2 by histochemical localization of immunoreactive substances using labeled antibodies as reagents.\n',
      termDef: {
        cde_id: 2957563,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Laboratory Procedure HER2/neu Immunohistochemistry Receptor Status',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2957563&version=2.0',
      },
    },
    hiv_positive: {
      description: 'Text term to signify whether a physician has diagnosed HIV infection in a patient.\n',
      termDef: {
        cde_id: 4030799,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Physician Diagnosed HIV Infection Personal Medical History Yes No Not Applicable Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4030799&version=1.0',
      },
    },
    hpv_positive_type: {
      description: 'Text classification to represent the strain or type of human papillomavirus identified in an individual.\n',
      termDef: {
        cde_id: 2922649,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Human Papillomavirus Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2922649&version=1.0',
      },
    },
    hpv_status: {
      description: 'The findings of the oncogenic HPV.\n',
      termDef: {
        cde_id: 2230033,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Oncogenic Human Papillomavirus Result Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2230033&version=1.0',
      },
    },
    id: '_terms',
    includes_spike_ins: {
      description: 'Spike-in included?\n',
    },
    initial_weight: {
      description: 'Numeric value that represents the initial weight of the sample, measured in milligrams.\n',
      termDef: {
        cde_id: 5432605,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Initial Weight Milligram Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432605&version=1.0',
      },
    },
    instrument_model: {
      description: 'Numeric value that represents the sample dimension that is greater than the shortest dimension and less than the longest dimension, measured in millimeters.\n',
      termDef: {
        cde_id: 5432604,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Intermediate Dimension Millimeter Measurement',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432604&version=1.0',
      },
    },
    intermediate_dimension: {
      description: 'Intermediate dimension of the sample, in millimeters.\n',
    },
    is_ffpe: {
      description: 'Indicator to signify whether or not the tissue sample was fixed in formalin and embedded in paraffin (FFPE).\n',
      termDef: {
        cde_id: 4170557,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Specimen Processing Formalin Fixed Paraffin Embedded Tissue Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4170557&version=1.0',
      },
    },
    is_paired_end: {
      description: 'Are the reads paired end?\n',
    },
    last_known_disease_status: {
      description: 'Text term that describes the last known state or condition of an individual\'s neoplasm.\n',
      termDef: {
        cde_id: 5424231,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Person Last Known Neoplasm Status',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2759550&version=1.0',
      },
    },
    laterality: {
      description: 'For tumors in paired organs, designates the side on which the cancer originates.\n',
      termDef: {
        cde_id: 827,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Primary Tumor Laterality',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=827&version=3.0',
      },
    },
    ldh_level_at_diagnosis: {
      description: 'The 2 decimal place numeric laboratory value measured, assigned or computed related to the assessment of lactate dehydrogenase in a specimen.\n',
      termDef: {
        cde_id: 2798766,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Laboratory Procedure Lactate Dehydrogenase Result Integer::2 Decimal Place Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2798766&version=1.0',
      },
    },
    ldh_normal_range_upper: {
      description: 'The top value of the range of statistical characteristics that are supposed to represent accepted standard, non-pathological pattern for lactate dehydrogenase (units not specified).\n',
      termDef: {
        cde_id: 2597015,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Laboratory Procedure Lactate Dehydrogenase Result Upper Limit of Normal Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2597015&version=1.0',
      },
    },
    library_name: {
      description: 'Name of the library.\n',
    },
    library_preparation_kit_catalog_number: {
      description: 'Catalog of Library Preparation Kit\n',
    },
    library_preparation_kit_name: {
      description: 'Name of Library Preparation Kit\n',
    },
    library_preparation_kit_vendor: {
      description: 'Vendor of Library Preparation Kit\n',
    },
    library_preparation_kit_version: {
      description: 'Version of Library Preparation Kit\n',
    },
    library_selection: {
      description: 'Library Selection Method\n',
    },
    library_strand: {
      description: 'Library stranded-ness.\n',
    },
    library_strategy: {
      description: 'Library strategy.\n',
    },
    longest_dimension: {
      description: 'Numeric value that represents the longest dimension of the sample, measured in millimeters.\n',
      termDef: {
        cde_id: 5432602,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Longest Dimension Millimeter Measurement',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432602&version=1.0',
      },
    },
    lymph_nodes_positive: {
      description: 'The number of lymph nodes involved with disease as determined by pathologic examination.\n',
      termDef: {
        cde_id: 89,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Lymph Node(s) Positive Number',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=89&version=3.0',
      },
    },
    lymphatic_invasion_present: {
      description: 'A yes/no indicator to ask if small or thin-walled vessel invasion is present, indicating lymphatic involvement\n',
      termDef: {
        cde_id: 64171,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Lymphatic/Small vessel Invasion Ind',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=64171&version=3.0',
      },
    },
    md5sum: {
      description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
    },
    method_of_diagnosis: {
      description: 'The method used to initially the patient\'s diagnosis.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Method of Diagnosis',
        term_url: null,
      },
    },
    method_of_sample_procurement: {
      description: 'The method used to procure the sample used to extract analyte(s).\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Method of Sample Procurement',
        term_url: null,
      },
    },
    microsatellite_instability_abnormal: {
      description: 'The yes/no indicator to signify the status of a tumor for microsatellite instability.\n',
      termDef: {
        cde_id: 3123142,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Microsatellite Instability Occurrence Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3123142&version=1.0',
      },
    },
    morphology: {
      description: 'The third edition of the International Classification of Diseases for Oncology, published in 2000 used principally in tumor and cancer registries for coding the site (topography) and the histology (morphology) of neoplasms. The study of the structure of the cells and their arrangement to constitute tissues and, finally, the association among these to form organs. In pathology, the microscopic process of identifying normal and abnormal morphologic characteristics in tissues, by employing various cytochemical and immunocytochemical stains. A system of numbered categories for representation of data.\n',
      termDef: {
        cde_id: 3226275,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'International Classification of Diseases for Oncology, Third Edition ICD-O-3 Histology Code',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3226275&version=1.0',
      },
    },
    new_event_anatomic_site: {
      description: 'Text term to specify the anatomic location of the return of tumor after treatment.\n',
      termDef: {
        cde_id: 3108271,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'New Neoplasm Event Occurrence Anatomic Site',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3108271&version=2.0',
      },
    },
    new_event_type: {
      description: 'Text term to identify a new tumor event.\n',
      termDef: {
        cde_id: 3119721,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'New Neoplasm Event Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3119721&version=1.0',
      },
    },
    normal_tumor_genotype_snp_match: {
      description: 'Text term that represents whether or not the genotype of the normal tumor matches or if the data is not available.\n',
      termDef: {
        cde_id: 4588156,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Normal Tumor Genotype Match Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4588156&version=1.0',
      },
    },
    number_proliferating_cells: {
      description: 'Numeric value that represents the count of proliferating cells determined during pathologic review of the sample slide(s).\n',
      termDef: {
        cde_id: 5432636,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Pathology Review Slide Proliferating Cell Count',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432636&version=1.0',
      },
    },
    oct_embedded: {
      description: 'Indicator of whether or not the sample was embedded in Optimal Cutting Temperature (OCT) compound.\n',
      termDef: {
        cde_id: 5432538,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Optimal Cutting Temperature Compound Embedding Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432538&version=1.0',
      },
    },
    pack_years_smoked: {
      description: 'Numeric computed value to represent lifetime tobacco exposure defined as number of cigarettes smoked per day x number of years smoked divided by 20.\n',
      termDef: {
        cde_id: 2955385,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Person Cigarette Smoking History Pack Year Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2955385&version=1.0',
      },
    },
    percent_eosinophil_infiltration: {
      description: 'Numeric value to represent the percentage of infiltration by eosinophils in a tumor sample or specimen.\n',
      termDef: {
        cde_id: 2897700,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Specimen Eosinophilia Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897700&version=2.0',
      },
    },
    percent_gc_content: {
      description: 'The overall %GC of all bases in all sequences.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: 'FastQC',
        term: '%GC',
        term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/1%20Basic%20Statistics.html',
      },
    },
    percent_granulocyte_infiltration: {
      description: 'Numeric value to represent the percentage of infiltration by granulocytes in a tumor sample or specimen.\n',
      termDef: {
        cde_id: 2897705,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Specimen Granulocyte Infiltration Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897705&version=2.0',
      },
    },
    percent_inflam_infiltration: {
      description: 'Numeric value to represent local response to cellular injury, marked by capillary dilatation, edema and leukocyte infiltration; clinically, inflammation is manifest by reddness, heat, pain, swelling and loss of function, with the need to heal damaged tissue.\n',
      termDef: {
        cde_id: 2897695,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Specimen Inflammation Change Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897695&version=1.0',
      },
    },
    percent_lymphocyte_infiltration: {
      description: 'Numeric value to represent the percentage of infiltration by lymphocytes in a solid tissue normal sample or specimen.\n',
      termDef: {
        cde_id: 2897710,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Specimen Lymphocyte Infiltration Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897710&version=2.0',
      },
    },
    percent_monocyte_infiltration: {
      description: 'Numeric value to represent the percentage of monocyte infiltration in a sample or specimen.\n',
      termDef: {
        cde_id: 5455535,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Specimen Monocyte Infiltration Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5455535&version=1.0',
      },
    },
    percent_necrosis: {
      description: 'Numeric value to represent the percentage of cell death in a malignant tumor sample or specimen.\n',
      termDef: {
        cde_id: 2841237,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Malignant Neoplasm Necrosis Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841237&version=1.0',
      },
    },
    percent_neutrophil_infiltration: {
      description: 'Numeric value to represent the percentage of infiltration by neutrophils in a tumor sample or specimen.\n',
      termDef: {
        cde_id: 2841267,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Malignant Neoplasm Neutrophil Infiltration Percentage Cell Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841267&version=1.0',
      },
    },
    percent_normal_cells: {
      description: 'Numeric value to represent the percentage of normal cell content in a malignant tumor sample or specimen.\n',
      termDef: {
        cde_id: 2841233,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Malignant Neoplasm Normal Cell Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841233&version=1.0',
      },
    },
    percent_stromal_cells: {
      description: 'Numeric value to represent the percentage of reactive cells that are present in a malignant tumor sample or specimen but are not malignant such as fibroblasts, vascular structures, etc.\n',
      termDef: {
        cde_id: 2841241,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Malignant Neoplasm Stromal Cell Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841241&version=1.0',
      },
    },
    percent_tumor_cells: {
      description: 'Numeric value that represents the percentage of infiltration by granulocytes in a sample.\n',
      termDef: {
        cde_id: 5432686,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Specimen Tumor Cell Percentage Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432686&version=1.0',
      },
    },
    percent_tumor_nuclei: {
      description: 'Numeric value to represent the percentage of tumor nuclei in a malignant neoplasm sample or specimen.\n',
      termDef: {
        cde_id: 2841225,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Malignant Neoplasm Neoplasm Nucleus Percentage Cell Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841225&version=1.0',
      },
    },
    perineural_invasion_present: {
      description: 'a yes/no indicator to ask if perineural invasion or infiltration of tumor or cancer is present.\n',
      termDef: {
        cde_id: 64181,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Tumor Perineural Invasion Ind',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=64181&version=3.0',
      },
    },
    platform: {
      description: 'Name of the platform used to obtain data.\n',
    },
    portion_number: {
      description: 'Numeric value that represents the sequential number assigned to a portion of the sample.\n',
      termDef: {
        cde_id: 5432711,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Biospecimen Portion Sequence Number',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432711&version=1.0',
      },
    },
    portion_weight: {
      description: 'Numeric value that represents the sample portion weight, measured in milligrams.\n',
      termDef: {
        cde_id: 5432593,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Biospecimen Portion Weight Milligram Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432593&version=1.0',
      },
    },
    preservation_method: {
      description: 'Text term that represents the method used to preserve the sample.\n',
      termDef: {
        cde_id: 5432521,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Preservation Method Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432521&version=1.0',
      },
    },
    primary_diagnosis: {
      description: 'Text term for the structural pattern of cancer cells used to define a microscopic diagnosis.\n',
      termDef: {
        cde_id: 3081934,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Neoplasm Histologic Type Name',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3081934&version=3.0',
      },
    },
    prior_malignancy: {
      description: 'Text term to describe the patient\'s history of prior cancer diagnosis and the spatial location of any previous cancer occurrence.\n',
      termDef: {
        cde_id: 3382736,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Prior Cancer Diagnosis Occurrence Description Text',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3382736&version=2.0',
      },
    },
    prior_treatment: {
      description: 'A yes/no/unknown/not applicable indicator related to the administration of therapeutic agents received before the body specimen was collected.\n',
      termDef: {
        cde_id: 4231463,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Therapeutic Procedure Prior Specimen Collection Administered Yes No Unknown Not Applicable Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4231463&version=1.0',
      },
    },
    progesterone_receptor_percent_positive_ihc: {
      description: 'Classification to represent Progesterone Receptor Positive results expressed as a percentage value.\n',
      termDef: {
        cde_id: 3128342,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Progesterone Receptor Level Cell Percentage Category',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3128342&version=1.0',
      },
    },
    progesterone_receptor_result_ihc: {
      description: 'Text term to represent the overall result of Progresterone Receptor (PR) testing.\n',
      termDef: {
        cde_id: 2957357,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Breast Carcinoma Progesterone Receptor Status',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2957357&version=2.0',
      },
    },
    progression_or_recurrence: {
      description: 'Yes/No/Unknown indicator to identify whether a patient has had a new tumor event after initial treatment.\n',
      termDef: {
        cde_id: 3121376,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'New Neoplasm Event Post Initial Therapy Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3121376&version=1.0',
      },
    },
    project_id: {
      description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
    },
    qc_metric_state: {
      description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: 'FastQC',
        term: 'QC Metric State',
        term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
      },
    },
    race: {
      description: 'An arbitrary classification of a taxonomic group that is a division of a species. It usually arises as a consequence of geographical isolation within a species and is characterized by shared heredity, physical attributes and behavior, and in the case of humans, by common history, nationality, or geographic distribution. The provided values are based on the categories defined by the U.S. Office of Management and Business and used by the U.S. Census Bureau.\n',
      termDef: {
        cde_id: 2192199,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Race Category Text',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2192199&version=1.0',
      },
    },
    read_group_name: {
      description: 'The name of the read group.\n',
    },
    read_length: {
      description: 'The length of the reads.\n',
    },
    relationship_age_at_diagnosis: {
      description: 'The age (in years) when the patient\'s relative was first diagnosed.\n',
      termDef: {
        cde_id: 5300571,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Relative Diagnosis Age Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5300571&version=1.0',
      },
    },
    relationship_type: {
      description: 'The subgroup that describes the state of connectedness between members of the unit of society organized around kinship ties.\n',
      termDef: {
        cde_id: 2690165,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Family Member Relationship Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2690165&version=2.0',
      },
    },
    relative_with_cancer_history: {
      description: 'Indicator to signify whether or not an individual\'s biological relative has been diagnosed with another type of cancer.\n',
      termDef: {
        cde_id: 3901752,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Other Cancer Biological Relative History Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3901752&version=1.0',
      },
    },
    residual_disease: {
      description: 'Text terms to describe the status of a tissue margin following surgical resection.\n',
      termDef: {
        cde_id: 2608702,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Surgical Margin Resection Status',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2608702&version=1.0',
      },
    },
    sample_type: {
      description: 'Text term to describe the source of a biospecimen used for a laboratory test.\n',
      termDef: {
        cde_id: 3111302,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Specimen Type Collection Biospecimen Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3111302&version=2.0',
      },
    },
    sample_type_id: {
      description: 'The accompanying sample type id for the sample type.\n',
    },
    section_location: {
      description: 'Tissue source of the slide.\n',
    },
    sequencing_center: {
      description: 'Name of the center that provided the sequence files.\n',
    },
    shortest_dimension: {
      description: 'Numeric value that represents the shortest dimension of the sample, measured in millimeters.\n',
      termDef: {
        cde_id: 5432603,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Short Dimension Millimeter Measurement',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432603&version=1.0',
      },
    },
    site_of_resection_or_biopsy: {
      description: 'The third edition of the International Classification of Diseases for Oncology, published in 2000, used principally in tumor and cancer registries for coding the site (topography) and the histology (morphology) of neoplasms. The description of an anatomical region or of a body part. Named locations of, or within, the body. A system of numbered categories for representation of data.\n',
      termDef: {
        cde_id: 3226281,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'International Classification of Diseases for Oncology, Third Edition ICD-O-3 Site Code',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3226281&version=1.0',
      },
    },
    size_selection_range: {
      description: 'Range of size selection.\n',
    },
    smoking_history: {
      description: 'Category describing current smoking status and smoking history as self-reported by a patient.\n',
      termDef: {
        cde_id: 2181650,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Smoking History',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2181650&version=1.0',
      },
    },
    smoking_intensity: {
      description: 'Numeric computed value to represent lifetime tobacco exposure defined as number of cigarettes smoked per day x number of years smoked divided by 20\n',
      termDef: {
        cde_id: 2955385,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Person Cigarette Smoking History Pack Year Value',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2955385&version=1.0',
      },
    },
    source_center: {
      description: 'Name of the center that provided the item.\n',
    },
    spectrophotometer_method: {
      description: 'Name of the method used to determine the concentration of purified nucleic acid within a solution.\n',
      termDef: {
        cde_id: 3008378,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Purification Nucleic Acid Solution Concentration Determination Method Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3008378&version=1.0',
      },
    },
    spike_ins_concentration: {
      description: 'Spike in concentration.\n',
    },
    spike_ins_fasta: {
      description: 'Name of the FASTA file that contains the spike-in sequences.\n',
    },
    state: {
      description: 'The current state of the object.\n',
    },
    target_capture_kit_catalog_number: {
      description: 'Catalog of Target Capture Kit.\n',
    },
    target_capture_kit_name: {
      description: 'Name of Target Capture Kit.\n',
    },
    target_capture_kit_target_region: {
      description: 'Target Capture Kit BED file.\n',
    },
    target_capture_kit_vendor: {
      description: 'Vendor of Target Capture Kit.\n',
    },
    target_capture_kit_version: {
      description: 'Version of Target Capture Kit.\n',
    },
    therapeutic_agents: {
      description: 'Text identification of the individual agent(s) used as part of a prior treatment regimen.\n',
      termDef: {
        cde_id: 2975232,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Prior Therapy Regimen Text',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2975232&version=1.0',
      },
    },
    time_between_clamping_and_freezing: {
      description: 'Numeric representation of the elapsed time between the surgical clamping of blood supply and freezing of the sample, measured in minutes.\n',
      termDef: {
        cde_id: 5432611,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Clamping and Freezing Elapsed Minute Time',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432611&version=1.0',
      },
    },
    time_between_excision_and_freezing: {
      description: 'Numeric representation of the elapsed time between the excision and freezing of the sample, measured in minutes.\n',
      termDef: {
        cde_id: 5432612,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Excision and Freezing Elapsed Minute Time',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432612&version=1.0',
      },
    },
    tissue_or_organ_of_origin: {
      description: 'Text term that describes the anatomic site of the tumor or disease.\n',
      termDef: {
        cde_id: 3427536,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Tumor Disease Anatomic Site',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3427536&version=3.0',
      },
    },
    tissue_type: {
      description: 'Text term that represents a description of the kind of tissue collected with respect to disease status or proximity to tumor tissue.\n',
      termDef: {
        cde_id: 5432687,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tissue Sample Description Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432687&version=1.0',
      },
    },
    to_trim_adapter_sequence: {
      description: 'Does the user suggest adapter trimming?\n',
    },
    tobacco_smoking_onset_year: {
      description: 'The year in which the participant began smoking.\n',
      termDef: {
        cde_id: 2228604,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Started Smoking Year',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2228604&version=1.0',
      },
    },
    tobacco_smoking_quit_year: {
      description: 'The year in which the participant quit smoking.\n',
      termDef: {
        cde_id: 2228610,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Stopped Smoking Year',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2228610&version=1.0',
      },
    },
    tobacco_smoking_status: {
      description: 'Category describing current smoking status and smoking history as self-reported by a patient.\n',
      termDef: {
        cde_id: 2181650,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Patient Smoking History Category',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2181650&version=1.0',
      },
    },
    total_sequences: {
      description: 'A count of the total number of sequences processed.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: 'FastQC',
        term: 'Total Sequences',
        term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/1%20Basic%20Statistics.html',
      },
    },
    treatment_anatomic_site: {
      description: 'The anatomic site or field targeted by a treatment regimen or single agent therapy.\n',
      termDef: {
        cde_id: null,
        cde_version: null,
        source: null,
        term: 'Treatment Anatomic Site',
        term_url: null,
      },
    },
    treatment_intent_type: {
      description: 'Text term to identify the reason for the administration of a treatment regimen. [Manually-curated]\n',
      termDef: {
        cde_id: 2793511,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Treatment Regimen Intent Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2793511&version=1.0',
      },
    },
    treatment_or_therapy: {
      description: 'A yes/no/unknown/not applicable indicator related to the administration of therapeutic agents received before the body specimen was collected.\n',
      termDef: {
        cde_id: 4231463,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Therapeutic Procedure Prior Specimen Collection Administered Yes No Unknown Not Applicable Indicator',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4231463&version=1.0',
      },
    },
    treatment_outcome: {
      description: 'Text term that describes the patient\u00bfs final outcome after the treatment was administered.\n',
      termDef: {
        cde_id: 5102383,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Treatment Outcome Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5102383&version=1.0',
      },
    },
    treatment_type: {
      description: 'Text term that describes the kind of treatment administered.\n',
      termDef: {
        cde_id: 5102381,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Treatment Method Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5102381&version=1.0',
      },
    },
    tumor_code: {
      description: 'Diagnostic tumor code of the tissue sample source.\n',
    },
    tumor_code_id: {
      description: 'BCR-defined id code for the tumor sample.\n',
    },
    tumor_descriptor: {
      description: 'Text that describes the kind of disease present in the tumor specimen as related to a specific timepoint.\n',
      termDef: {
        cde_id: 3288124,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Tumor Tissue Disease Description Type',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3288124&version=1.0',
      },
    },
    tumor_grade: {
      description: 'Numeric value to express the degree of abnormality of cancer cells, a measure of differentiation and aggressiveness.\n',
      termDef: {
        cde_id: 2785839,
        cde_version: 2.0,
        source: 'caDSR',
        term: 'Neoplasm Histologic Grade',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2785839&version=2.0',
      },
    },
    tumor_stage: {
      description: 'The extent of a cancer in the body. Staging is usually based on the size of the tumor, whether lymph nodes contain cancer, and whether the cancer has spread from the original site to other parts of the body. The accepted values for tumor_stage depend on the tumor site, type, and accepted staging system. These items should accompany the tumor_stage value as associated metadata.\n',
      termDef: {
        cde_id: 'C16899',
        cde_version: null,
        source: 'NCIt',
        term: 'Tumor Stage',
        term_url: 'https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=NCI%20Thesaurus&code=C16899',
      },
    },
    vascular_invasion_present: {
      description: 'The yes/no indicator to ask if large vessel or venous invasion was detected by surgery or presence in a tumor specimen.\n',
      termDef: {
        cde_id: 64358,
        cde_version: 3.0,
        source: 'caDSR',
        term: 'Tumor Vascular Invasion Ind-3',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=64358&version=3.0',
      },
    },
    vital_status: {
      description: 'The survival state of the person registered on the protocol.\n',
      termDef: {
        cde_id: 5,
        cde_version: 5.0,
        source: 'caDSR',
        term: 'Patient Vital Status',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5&version=5.0',
      },
    },
    weight: {
      description: 'The weight of the patient measured in kilograms.\n',
      termDef: {
        cde_id: 651,
        cde_version: 4.0,
        source: 'caDSR',
        term: 'Patient Weight Measurement',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=651&version=4.0',
      },
    },
    well_number: {
      description: 'Numeric value that represents the the well location within a plate for the analyte or aliquot from the sample.\n',
      termDef: {
        cde_id: 5432613,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Biospecimen Analyte or Aliquot Plate Well Number',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432613&version=1.0',
      },
    },
    workflow_type: {
      description: 'Generic name for the workflow used to analyze a data set.\n',
    },
    year_of_birth: {
      description: 'Numeric value to represent the calendar year in which an individual was born.\n',
      termDef: {
        cde_id: 2896954,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Year Birth Date Number',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2896954&version=1.0',
      },
    },
    year_of_death: {
      description: 'Numeric value to represent the year of the death of an individual.\n',
      termDef: {
        cde_id: 2897030,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Year Death Number',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897030&version=1.0',
      },
    },
    year_of_diagnosis: {
      description: 'Numeric value to represent the year of an individual\'s initial pathologic diagnosis of cancer.\n',
      termDef: {
        cde_id: 2896960,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Year of initial pathologic diagnosis',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2896960&version=1.0',
      },
    },
    years_smoked: {
      description: 'Numeric value (or unknown) to represent the number of years a person has been smoking.\n',
      termDef: {
        cde_id: 3137957,
        cde_version: 1.0,
        source: 'caDSR',
        term: 'Person Smoking Duration Year Count',
        term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3137957&version=1.0',
      },
    },
  },
  acknowledgement: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'administrative',
    description: 'Acknowledgement of an individual involved in a project.',
    id: 'acknowledgement',
    links: [
      {
        backref: 'acknowledgements',
        label: 'contribute_to',
        multiplicity: 'many_to_many',
        name: 'projects',
        required: true,
        target_type: 'project',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      acknowledgee: {
        description: 'The indvidiual or group being acknowledged by the project.',
        type: 'string',
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      project_id: {
        type: 'string',
      },
      projects: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'acknowledgement',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'projects',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Acknowledgement',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  aligned_reads_index: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'index_file',
    description: 'Data file containing the index for a set of aligned reads.',
    id: 'aligned_reads_index',
    links: [
      {
        backref: 'aligned_reads_indexes',
        label: 'derived_from',
        multiplicity: 'one_to_one',
        name: 'submitted_aligned_reads_files',
        required: true,
        target_type: 'submitted_aligned_reads',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      data_category: {
        enum: [
          'Sequencing Data',
          'Sequencing Reads',
          'Raw Sequencing Data',
        ],
        term: {
          description: 'Broad categorization of the contents of the data file.\n',
        },
      },
      data_format: {
        enum: [
          'BAI',
        ],
        term: {
          description: 'Format of the data files.\n',
        },
      },
      data_type: {
        enum: [
          'Aligned Reads Index',
        ],
        term: {
          description: 'Specific content type of the data file.\n',
        },
      },
      error_type: {
        enum: [
          'file_size',
          'file_format',
          'md5sum',
        ],
        term: {
          description: 'Type of error for the data file object.\n',
        },
      },
      file_name: {
        term: {
          description: 'The name (or part of a name) of a file (of any type).\n',
        },
        type: 'string',
      },
      file_size: {
        term: {
          description: 'The size of the data file (object) in bytes.\n',
        },
        type: 'number',
      },
      file_state: {
        default: 'registered',
        enum: [
          'registered',
          'uploading',
          'uploaded',
          'validating',
          'validated',
          'submitted',
          'processing',
          'processed',
          'released',
          'error',
        ],
        term: {
          description: 'The current state of the data file object.\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      md5sum: {
        term: {
          description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      state_comment: {
        description: 'Optional comment about why the file is in the current state, mainly for invalid state.\n',
        type: 'string',
      },
      submitted_aligned_reads_files: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'aligned_reads_index',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'file_name',
      'file_size',
      'md5sum',
      'data_category',
      'data_type',
      'data_format',
      'submitted_aligned_reads_files',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
      'file_state',
      'error_type',
    ],
    title: 'Aligned Reads Index',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  aliquot: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'biospecimen',
    constraints: null,
    description: 'Pertaining to a portion of the whole; any one of two or more samples of something, of the same volume or weight.\n',
    id: 'aliquot',
    links: [
      {
        backref: 'aliquots',
        label: 'derived_from',
        multiplicity: 'many_to_many',
        name: 'samples',
        required: true,
        target_type: 'sample',
      },
    ],
    program: '*',
    project: '*',
    properties: {
      aliquot_concentration: {
        description: 'Concentration for the aliquot. Must also specify aliquot_concentration_unit',
        type: 'number',
      },
      aliquot_concentration_unit: {
        description: 'The unit of measurement for the concentration.',
        type: 'string',
      },
      aliquot_quantity: {
        term: {
          description: 'The quantity in micrograms (ug) of the aliquot(s) derived from the analyte(s) shipped for sequencing and characterization.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: null,
            term: 'Biospecimen Aliquot Quantity',
            term_url: null,
          },
        },
        type: 'number',
      },
      aliquot_volume: {
        term: {
          description: 'The volume in microliters (ml) of the aliquot(s) derived from the analyte(s) shipped for sequencing and characterization.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: null,
            term: 'Biospecimen Aliquot Volume',
            term_url: null,
          },
        },
        type: 'number',
      },
      amount: {
        term: {
          description: 'Weight in grams or volume in mL.\n',
        },
        type: 'number',
      },
      analyte_type: {
        term: {
          description: 'Text term that represents the kind of molecular specimen analyte.\n',
          termDef: {
            cde_id: 2513915,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Molecular Specimen Type Text Name',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2513915&version=2.0',
          },
        },
        type: 'string',
      },
      analyte_type_id: {
        enum: [
          'D',
          'E',
          'G',
          'H',
          'R',
          'S',
          'T',
          'W',
          'X',
          'Y',
        ],
        term: {
          description: 'A single letter code used to identify a type of molecular analyte.\n',
          termDef: {
            cde_id: 5432508,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Molecular Analyte Identification Code',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432508&version=1.0',
          },
        },
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      ctDNA_method: {
        type: 'string',
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      samples: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      source_center: {
        term: {
          description: 'Name of the center that provided the item.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        description: 'The legacy barcode used before prior to the use UUIDs. For TCGA this is bcraliquotbarcode.\n',
        type: [
          'string',
          'null',
        ],
      },
      type: {
        type: 'string',
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'samples',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Aliquot',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: [],
  },
  assay_result: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'notation',
    description: 'Information pertaining to processed results obtained from an assay. \n',
    id: 'assay_result',
    links: [
      {
        exclusive: true,
        required: true,
        subgroup: [
          {
            backref: 'assay_results',
            label: 'data_from',
            multiplicity: 'many_to_many',
            name: 'read_groups',
            required: false,
            target_type: 'read_group',
          },
          {
            backref: 'assay_results',
            label: 'data_from',
            multiplicity: 'many_to_many',
            name: 'aliquots',
            required: false,
            target_type: 'aliquot',
          },
          {
            backref: 'assay_results',
            label: 'data_from',
            multiplicity: 'many_to_many',
            name: 'slides',
            required: false,
            target_type: 'slide',
          },
        ],
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      WT_copies: {
        description: 'WT DNA absolute coppies in the ctDNA. Requires copies_unit.',
        type: 'integer',
      },
      aliquots: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      assay_instrument: {
        description: 'The specific instrument type used to perform the assay.',
        type: 'string',
      },
      assay_instrument_model: {
        description: 'The specific model of instrument used to perform the assay.',
        type: 'string',
      },
      assay_kit_name: {
        description: 'Name of the assay kit used.',
        type: 'string',
      },
      assay_kit_vendor: {
        description: 'Vendor that provided the assay kit.',
        type: 'string',
      },
      assay_kit_version: {
        description: 'Version of the assay kit used.',
        type: 'string',
      },
      assay_method: {
        description: 'General methodology used to perform the assay (e.g. PCR, Sequencing).',
        type: 'string',
      },
      assay_technology: {
        description: 'The type of technology used to perform the assay.',
        type: 'string',
      },
      copies_unit: {
        description: 'The units for the copies measured (e.g. copies/xxx uL plasma).',
        type: 'string',
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      ctc_feature_name: {
        description: 'Name of the CTC feature that is captured in the assay. Requires ctc_feature_value.',
        type: 'string',
      },
      ctc_feature_value: {
        description: 'Numeric value for the CTC feature.',
        type: 'number',
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      mutant_copies: {
        description: 'Mutant DNA absolute copies in the ctDNA. Requires copies_unit.',
        type: 'integer',
      },
      mutant_fraction_percent: {
        description: 'Percent of the target that is identified as mutant.',
        type: 'number',
      },
      mutation_result: {
        description: 'Observed mutation type.',
        type: 'string',
      },
      project_id: {
        type: 'string',
      },
      read_depth: {
        description: 'The read depth of the assay.',
        type: 'integer',
      },
      read_groups: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      slides: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      target_gene: {
        description: 'Gene of interest for the assay.',
        type: 'string',
      },
      target_location: {
        description: 'Genomic or amino acid change targeted by the assay.',
        type: 'string',
      },
      type: {
        enum: [
          'assay_result',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
    ],
    title: 'Assay Result',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  case: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'administrative',
    description: 'The collection of all data related to a specific subject in the context of a specific experiment. \n',
    id: 'case',
    links: [
      {
        backref: 'cases',
        label: 'member_of',
        multiplicity: 'many_to_one',
        name: 'experiments',
        required: true,
        target_type: 'experiment',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      disease_type: {
        description: 'Name of the disease for the case.',
        type: 'string',
      },
      experiments: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      primary_site: {
        description: 'Primary site for the case.',
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        type: 'string',
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'experiments',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
    ],
    title: 'Case',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  clinical_test: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'clinical',
    description: 'Metadata concerning any clinical tests used in relation to a case diagnosis. \n',
    id: 'clinical_test',
    links: [
      {
        backref: 'clinical_tests',
        label: 'performed_for',
        multiplicity: 'many_to_one',
        name: 'cases',
        required: true,
        target_type: 'case',
      },
      {
        backref: 'clinical_tests',
        label: 'relates_to',
        multiplicity: 'many_to_many',
        name: 'diagnoses',
        required: false,
        target_type: 'diagnosis',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      biomarker_name: {
        term: {
          description: 'The name of the biomarker being tested for this specimen and set of test results.\n',
          termDef: {
            cde_id: 5473,
            cde_version: 11.0,
            source: 'caDSR',
            term: 'Biomarker Name',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5473&version=2.31',
          },
        },
        type: 'string',
      },
      biomarker_result: {
        enum: [
          'Amplification',
          'Gain',
          'Loss',
          'Normal',
          'Other',
          'Translocation',
          'Not Reported',
          'Not Allowed To Collect',
          'Pending',
        ],
        term: {
          description: 'Text term to define the results of genetic testing.\n',
          termDef: {
            cde_id: 3234680,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Laboratory Procedure Genetic Abnormality Test Result Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3234680&version=1.0',
          },
        },
      },
      biomarker_test_method: {
        enum: [
          'Cytogenetics',
          'FISH',
          'IHC',
          'Karyotype',
          'NGS',
          'Nuclear Staining',
          'Other',
          'RT-PCR',
          'Southern',
          'Not Reported',
          'Not Allowed To Collect',
          'Pending',
        ],
        term: {
          description: 'Text descriptor of a molecular analysis method used for an individual.\n',
          termDef: {
            cde_id: 3121575,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Disease Detection Molecular Analysis Method Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3121575&version=1.0',
          },
        },
      },
      cases: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      cea_level_preoperative: {
        term: {
          description: 'Numeric value of the Carcinoembryonic antigen or CEA at the time before surgery. [Manually- curated]\n',
          termDef: {
            cde_id: 2716510,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Preoperative Carcinoembryonic Antigen Result Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2716510&version=1.0',
          },
        },
        type: 'number',
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      diagnoses: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      dlco_ref_predictive_percent: {
        term: {
          description: 'The value, as a percentage of predicted lung volume, measuring the amount of carbon monoxide detected in a patient\'s lungs.\n',
          termDef: {
            cde_id: 2180255,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Lung Carbon Monoxide Diffusing Capability Test Assessment Predictive Value Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2180255&version=1.0',
          },
        },
        type: 'number',
      },
      estrogen_receptor_percent_positive_ihc: {
        enum: [
          '<1%',
          '1-10%',
          '11-20%',
          '21-30%',
          '31-40%',
          '41-50%',
          '51-60%',
          '61-70%',
          '71-80%',
          '81-90%',
          '91-100%',
        ],
        term: {
          description: 'Classification to represent ER Positive results expressed as a percentage value.\n',
          termDef: {
            cde_id: 3128341,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'ER Level Cell Percentage Category',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3128341&version=1.0',
          },
        },
      },
      estrogen_receptor_result_ihc: {
        enum: [
          'Negative',
          'Not Performed',
          'Positive',
          'Unknown',
        ],
        term: {
          description: 'Text term to represent the overall result of Estrogen Receptor (ER) testing.\n',
          termDef: {
            cde_id: 2957359,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Breast Carcinoma Estrogen Receptor Status',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2957359&version=2.0',
          },
        },
      },
      fev1_fvc_post_bronch_percent: {
        term: {
          description: 'Percentage value to represent result of Forced Expiratory Volume in 1 second (FEV1) divided by the Forced Vital Capacity (FVC) post-bronchodilator.\n',
          termDef: {
            cde_id: 3302956,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Post Bronchodilator FEV1/FVC Percent Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3302956&version=1.0',
          },
        },
        type: 'number',
      },
      fev1_fvc_pre_bronch_percent: {
        term: {
          description: 'Percentage value to represent result of Forced Expiratory Volume in 1 second (FEV1) divided by the Forced Vital Capacity (FVC) pre-bronchodilator.\n',
          termDef: {
            cde_id: 3302955,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Pre Bronchodilator FEV1/FVC Percent Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3302955&version=1.0',
          },
        },
        type: 'number',
      },
      fev1_ref_post_bronch_percent: {
        term: {
          description: 'The percentage comparison to a normal value reference range of the volume of air that a patient can forcibly exhale from the lungs in one second post-bronchodilator.\n',
          termDef: {
            cde_id: 3302948,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Post Bronchodilator Lung Forced Expiratory Volume 1 Test Lab Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3302948&version=1.0',
          },
        },
        type: 'number',
      },
      fev1_ref_pre_bronch_percent: {
        term: {
          description: 'The percentage comparison to a normal value reference range of the volume of air that a patient can forcibly exhale from the lungs in one second pre-bronchodilator.\n',
          termDef: {
            cde_id: 3302947,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Pre Bronchodilator Lung Forced Expiratory Volume 1 Test Lab Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3302947&version=1.0',
          },
        },
        type: 'number',
      },
      her2_erbb2_percent_positive_ihc: {
        enum: [
          '<1%',
          '1-10%',
          '11-20%',
          '21-30%',
          '31-40%',
          '41-50%',
          '51-60%',
          '61-70%',
          '71-80%',
          '81-90%',
          '91-100%',
        ],
        term: {
          description: 'Classification to represent the number of positive HER2/ERBB2 cells in a specimen or sample.\n',
          termDef: {
            cde_id: 3086980,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'HER2 ERBB Positive Finding Cell Percentage Category',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3086980&version=1.0',
          },
        },
      },
      her2_erbb2_result_fish: {
        enum: [
          'Negative',
          'Not Performed',
          'Positive',
          'Unknown',
        ],
        term: {
          description: 'the type of outcome for HER2 as determined by an in situ hybridization (ISH) assay.\n',
          termDef: {
            cde_id: 2854089,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Laboratory Procedure HER2/neu in situ Hybridization Outcome Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2854089&version=1.0',
          },
        },
      },
      her2_erbb2_result_ihc: {
        enum: [
          'Negative',
          'Not Performed',
          'Positive',
          'Unknown',
        ],
        term: {
          description: 'Text term to signify the result of the medical procedure that involves testing a sample of blood or tissue for HER2 by histochemical localization of immunoreactive substances using labeled antibodies as reagents.\n',
          termDef: {
            cde_id: 2957563,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Laboratory Procedure HER2/neu Immunohistochemistry Receptor Status',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2957563&version=2.0',
          },
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      ldh_level_at_diagnosis: {
        term: {
          description: 'The 2 decimal place numeric laboratory value measured, assigned or computed related to the assessment of lactate dehydrogenase in a specimen.\n',
          termDef: {
            cde_id: 2798766,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Laboratory Procedure Lactate Dehydrogenase Result Integer::2 Decimal Place Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2798766&version=1.0',
          },
        },
        type: 'number',
      },
      ldh_normal_range_upper: {
        term: {
          description: 'The top value of the range of statistical characteristics that are supposed to represent accepted standard, non-pathological pattern for lactate dehydrogenase (units not specified).\n',
          termDef: {
            cde_id: 2597015,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Laboratory Procedure Lactate Dehydrogenase Result Upper Limit of Normal Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2597015&version=1.0',
          },
        },
        type: 'number',
      },
      microsatellite_instability_abnormal: {
        enum: [
          'Yes',
          'No',
          'Unknown',
        ],
        term: {
          description: 'The yes/no indicator to signify the status of a tumor for microsatellite instability.\n',
          termDef: {
            cde_id: 3123142,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Microsatellite Instability Occurrence Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3123142&version=1.0',
          },
        },
      },
      progesterone_receptor_percent_positive_ihc: {
        enum: [
          '<1%',
          '1-10%',
          '11-20%',
          '21-30%',
          '31-40%',
          '41-50%',
          '51-60%',
          '61-70%',
          '71-80%',
          '81-90%',
          '91-100%',
        ],
        term: {
          description: 'Classification to represent Progesterone Receptor Positive results expressed as a percentage value.\n',
          termDef: {
            cde_id: 3128342,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Progesterone Receptor Level Cell Percentage Category',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3128342&version=1.0',
          },
        },
      },
      progesterone_receptor_result_ihc: {
        enum: [
          'Negative',
          'Not Performed',
          'Positive',
          'Unknown',
        ],
        term: {
          description: 'Text term to represent the overall result of Progresterone Receptor (PR) testing.\n',
          termDef: {
            cde_id: 2957357,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Breast Carcinoma Progesterone Receptor Status',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2957357&version=2.0',
          },
        },
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'clinical_test',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'biomarker_name',
      'biomarker_result',
      'biomarker_test_method',
      'cases',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
    ],
    title: 'Clinical Test',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  demographic: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'clinical',
    description: 'Data for the characterization of the patient by means of segementing the population (e.g., characterization by age, sex, or race).\n',
    id: 'demographic',
    links: [
      {
        backref: 'demographics',
        label: 'describes',
        multiplicity: 'one_to_one',
        name: 'cases',
        required: true,
        target_type: 'case',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    preferred: [
      'year_of_death',
    ],
    program: '*',
    project: '*',
    properties: {
      cases: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      ethnicity: {
        enum: [
          'hispanic or latino',
          'not hispanic or latino',
          'Unknown',
          'not reported',
          'not allowed to collect',
        ],
        term: {
          description: 'An individual\'s self-described social and cultural grouping, specifically whether an individual describes themselves as Hispanic or Latino. The provided values are based on the categories defined by the U.S. Office of Management and Business and used by the U.S. Census Bureau.\n',
          termDef: {
            cde_id: 2192217,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Ethnic Group Category Text',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2192217&version=2.0',
          },
        },
      },
      gender: {
        enum: [
          'female',
          'male',
          'unknown',
          'unspecified',
          'not reported',
        ],
        term: {
          description: 'Text designations that identify gender. Gender is described as the assemblage of properties that distinguish people on the basis of their societal roles. [Explanatory Comment 1: Identification of gender is based upon self-report and may come from a form, questionnaire, interview, etc.]\n',
          termDef: {
            cde_id: 2200604,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Person Gender Text Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2200604&version=3.0',
          },
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      race: {
        enum: [
          'white',
          'american indian or alaska native',
          'black or african american',
          'asian',
          'native hawaiian or other pacific islander',
          'other',
          'Unknown',
          'not reported',
          'not allowed to collect',
        ],
        term: {
          description: 'An arbitrary classification of a taxonomic group that is a division of a species. It usually arises as a consequence of geographical isolation within a species and is characterized by shared heredity, physical attributes and behavior, and in the case of humans, by common history, nationality, or geographic distribution. The provided values are based on the categories defined by the U.S. Office of Management and Business and used by the U.S. Census Bureau.\n',
          termDef: {
            cde_id: 2192199,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Race Category Text',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2192199&version=1.0',
          },
        },
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        type: 'string',
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      year_of_birth: {
        term: {
          description: 'Numeric value to represent the calendar year in which an individual was born.\n',
          termDef: {
            cde_id: 2896954,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Year Birth Date Number',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2896954&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      year_of_death: {
        term: {
          description: 'Numeric value to represent the year of the death of an individual.\n',
          termDef: {
            cde_id: 2897030,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Year Death Number',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897030&version=1.0',
          },
        },
        type: 'number',
      },
    },
    required: [
      'submitter_id',
      'cases',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Demographic',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  diagnosis: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'clinical',
    description: 'Data from the investigation, analysis and recognition of the presence and nature of disease, condition, or injury from expressed signs and symptoms; also, the scientific determination of any kind; the concise results of such an investigation.\n',
    id: 'diagnosis',
    links: [
      {
        backref: 'diagnoses',
        label: 'describes',
        multiplicity: 'many_to_one',
        name: 'cases',
        required: true,
        target_type: 'case',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    preferred: [
      'days_to_birth',
      'site_of_resection_or_biopsy',
    ],
    program: '*',
    project: '*',
    properties: {
      age_at_diagnosis: {
        maximum: 32872,
        minimum: 0,
        term: {
          description: 'Age at the time of diagnosis expressed in number of days since birth.\n',
          termDef: {
            cde_id: 3225640,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Patient Diagnosis Age Day Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3225640&version=2.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      ajcc_clinical_m: {
        enum: [
          'M0',
          'M1',
          'M1a',
          'M1b',
          'M1c',
          'MX',
          'cM0 (i+)',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Extent of the distant metastasis for the cancer based on evidence obtained from clinical assessment parameters determined prior to treatment.\n',
          termDef: {
            cde_id: 3440331,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Neoplasm American Joint Committee on Cancer Clinical Distant Metastasis M Stage',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3440331&version=1.0',
          },
        },
      },
      ajcc_clinical_n: {
        enum: [
          'N0',
          'N0 (i+)',
          'N0 (i-)',
          'N0 (mol+)',
          'N0 (mol-)',
          'N1',
          'N1a',
          'N1b',
          'N1bI',
          'N1bII',
          'N1bIII',
          'N1bIV',
          'N1c',
          'N1mi',
          'N2',
          'N2a',
          'N2b',
          'N2c',
          'N3',
          'N3a',
          'N3b',
          'N3c',
          'N4',
          'NX',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Extent of the regional lymph node involvement for the cancer based on evidence obtained from clinical assessment parameters determined prior to treatment.\n',
          termDef: {
            cde_id: 3440330,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Neoplasm American Joint Committee on Cancer Clinical Regional Lymph Node N Stage',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3440330&version=1.0',
          },
        },
      },
      ajcc_clinical_stage: {
        enum: [
          'Stage 0',
          'Stage 0a',
          'Stage 0is',
          'Stage I',
          'Stage IA',
          'Stage IA1',
          'Stage IA2',
          'Stage IB',
          'Stage IB Cervix',
          'Stage IB1',
          'Stage IB2',
          'Stage II',
          'Stage II Cervix',
          'Stage IIA',
          'Stage IIA Cervix',
          'Stage IIB',
          'Stage IIC',
          'Stage III',
          'Stage IIIA',
          'Stage IIIB',
          'Stage IIIC',
          'Stage IS',
          'Stage IV',
          'Stage IVA',
          'Stage IVB',
          'Stage IVC',
          'Stage Tis',
          'Stage X',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Stage group determined from clinical information on the tumor (T), regional node (N) and metastases (M) and by grouping cases with similar prognosis for cancer.\n',
          termDef: {
            cde_id: 3440332,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Neoplasm American Joint Committee on Cancer Clinical Group Stage',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3440332&version=1.0',
          },
        },
      },
      ajcc_clinical_t: {
        enum: [
          'T0',
          'T1',
          'T1a',
          'T1a1',
          'T1a2',
          'T1b',
          'T1b1',
          'T1b2',
          'T1c',
          'T1mi',
          'T2',
          'T2a',
          'T2a1',
          'T2a2',
          'T2b',
          'T2c',
          'T2d',
          'T3',
          'T3a',
          'T3b',
          'T3c',
          'T3d',
          'T4',
          'T4a',
          'T4b',
          'T4c',
          'T4d',
          'T4e',
          'TX',
          'Ta',
          'Tis',
          'Tis (DCIS)',
          'Tis (LCIS)',
          'Tis (Paget\'s)',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Extent of the primary cancer based on evidence obtained from clinical assessment parameters determined prior to treatment.\n',
          termDef: {
            cde_id: 3440328,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Neoplasm American Joint Committee on Cancer Clinical Primary Tumor T Stage',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3440328&version=1.0',
          },
        },
      },
      ajcc_pathologic_m: {
        enum: [
          'M0',
          'M1',
          'M1a',
          'M1b',
          'M1c',
          'M2',
          'MX',
          'cM0 (i+)',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Code to represent the defined absence or presence of distant spread or metastases (M) to locations via vascular channels or lymphatics beyond the regional lymph nodes, using criteria established by the American Joint Committee on Cancer (AJCC).\n',
          termDef: {
            cde_id: 3045439,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'American Joint Committee on Cancer Metastasis Stage Code',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3045439&version=1.0',
          },
        },
      },
      ajcc_pathologic_n: {
        enum: [
          'N0',
          'N0 (i+)',
          'N0 (i-)',
          'N0 (mol+)',
          'N0 (mol-)',
          'N1',
          'N1a',
          'N1b',
          'N1bI',
          'N1bII',
          'N1bIII',
          'N1bIV',
          'N1c',
          'N1mi',
          'N2',
          'N2a',
          'N2b',
          'N2c',
          'N3',
          'N3a',
          'N3b',
          'N3c',
          'N4',
          'NX',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'The codes that represent the stage of cancer based on the nodes present (N stage) according to criteria based on multiple editions of the AJCC\'s Cancer Staging Manual.\n',
          termDef: {
            cde_id: 3203106,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Neoplasm Disease Lymph Node Stage American Joint Committee on Cancer Code',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3203106&version=1.0',
          },
        },
      },
      ajcc_pathologic_stage: {
        enum: [
          'Stage 0',
          'Stage 0a',
          'Stage 0is',
          'Stage I',
          'Stage IA',
          'Stage IA1',
          'Stage IA2',
          'Stage IB',
          'Stage IB1',
          'Stage IB2',
          'Stage IC',
          'Stage II',
          'Stage IIA',
          'Stage IIA1',
          'Stage IIA2',
          'Stage IIB',
          'Stage IIC',
          'Stage III',
          'Stage IIIA',
          'Stage IIIB',
          'Stage IIIC',
          'Stage IV',
          'Stage IVA',
          'Stage IVB',
          'Stage IVC',
          'Stage Tis',
          'Stage X',
        ],
        term: {
          description: 'The extent of a cancer, especially whether the disease has spread from the original site to other parts of the body based on AJCC staging criteria.\n',
          termDef: {
            cde_id: 3203222,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Neoplasm Disease Stage American Joint Committee on Cancer Code',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3203222&version=1.0',
          },
        },
      },
      ajcc_pathologic_t: {
        enum: [
          'T0',
          'T1',
          'T1a',
          'T1a1',
          'T1a2',
          'T1b',
          'T1b1',
          'T1b2',
          'T1c',
          'T1mi',
          'T2',
          'T2a',
          'T2a1',
          'T2a2',
          'T2b',
          'T2c',
          'T2d',
          'T3',
          'T3a',
          'T3b',
          'T3c',
          'T3d',
          'T4',
          'T4a',
          'T4b',
          'T4c',
          'T4d',
          'T4e',
          'TX',
          'Ta',
          'Tis',
          'Tis (DCIS)',
          'Tis (LCIS)',
          'Tis (Paget\'s)',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Code of pathological T (primary tumor) to define the size or contiguous extension of the primary tumor (T), using staging criteria from the American Joint Committee on Cancer (AJCC).\n',
          termDef: {
            cde_id: 3045435,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'American Joint Committee on Cancer Tumor Stage Code',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3045435&version=1.0',
          },
        },
      },
      ann_arbor_b_symptoms: {
        enum: [
          'Yes',
          'No',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term to signify whether lymphoma B-symptoms are present as noted in the patient\'s medical record.\n',
          termDef: {
            cde_id: 2902402,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Lymphoma B-Symptoms Medical Record Documented Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2902402&version=1.0',
          },
        },
      },
      ann_arbor_clinical_stage: {
        enum: [
          'Stage I',
          'Stage II',
          'Stage III',
          'Stage IV',
        ],
        term: {
          description: 'The classification of the clinically confirmed anatomic disease extent of lymphoma (Hodgkin\'s and Non-Hodgkins) based on the Ann Arbor Staging System.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: null,
            term: 'Ann Arbor Clinical Stage',
            term_url: null,
          },
        },
      },
      ann_arbor_extranodal_involvement: {
        enum: [
          'Yes',
          'No',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Indicator that identifies whether a patient with malignant lymphoma has lymphomatous involvement of an extranodal site.\n',
          termDef: {
            cde_id: 3364582,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Lymphomatous Extranodal Site Involvement Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3364582&version=1.0',
          },
        },
      },
      ann_arbor_pathologic_stage: {
        enum: [
          'Stage I',
          'Stage II',
          'Stage III',
          'Stage IV',
        ],
        term: {
          description: 'The classification of the pathologically confirmed anatomic disease extent of lymphoma (Hodgkin\'s and Non-Hodgkins) based on the Ann Arbor Staging System.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: null,
            term: 'Ann Arbor Pathologic Stage',
            term_url: null,
          },
        },
      },
      burkitt_lymphoma_clinical_variant: {
        enum: [
          'Endemic',
          'Immunodeficiency-associated, adult',
          'Immunodeficiency-associated, pediatric',
          'Sporadic, adult',
          'Sporadic, pediatric',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Burkitt\'s lymphoma categorization based on clinical features that differ from other forms of the same disease.\n',
          termDef: {
            cde_id: 3770421,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Burkitt Lymphoma Clinical Variant Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3770421&version=1.0',
          },
        },
      },
      cases: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      cause_of_death: {
        enum: [
          'Cancer Related',
          'Not Cancer Related',
          'Unknown',
        ],
        term: {
          description: 'Text term to identify the cause of death for a patient.\n',
          termDef: {
            cde_id: 2554674,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Patient Death Reason',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2554674&version=3.0',
          },
        },
      },
      circumferential_resection_margin: {
        term: {
          description: 'A value in millimeters indicating the measured length between a malignant lesion of the colon or rectum and the nearest radial (or circumferential) border of tissue removed during cancer surgery.\n',
          termDef: {
            cde_id: 64202,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Colorectal Surgical Margin Circumferential Distance Measurement',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=64202&version=3.0',
          },
        },
        type: 'number',
      },
      classification_of_tumor: {
        enum: [
          'primary',
          'metastasis',
          'recurrence',
          'other',
          'Unknown',
          'not reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text that describes the kind of disease present in the tumor specimen as related to a specific timepoint.\n',
          termDef: {
            cde_id: 3288124,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tumor Tissue Disease Description Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3288124&version=1.0',
          },
        },
      },
      colon_polyps_history: {
        enum: [
          'Yes',
          'No',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Yes/No indicator to describe if the subject had a previous history of colon polyps as noted in the history/physical or previous endoscopic report (s).\n',
          termDef: {
            cde_id: 3107197,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Colon Carcinoma Polyp Occurrence Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3107197&version=1.0',
          },
        },
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      days_to_birth: {
        maximum: 0,
        minimum: -32872,
        term: {
          description: 'Time interval from a person\'s date of birth to the date of initial pathologic diagnosis, represented as a calculated negative number of days.\n',
          termDef: {
            cde_id: 3008233,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Person Birth Date Less Initial Pathologic Diagnosis Date Calculated Day Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3008233&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      days_to_death: {
        maximum: 32872,
        minimum: 0,
        term: {
          description: 'Time interval from a person\'s date of death to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
          termDef: {
            cde_id: 3165475,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Death Less Initial Pathologic Diagnosis Date Calculated Day Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3165475&version=1.0',
          },
        },
        type: 'number',
      },
      days_to_hiv_diagnosis: {
        term: {
          description: 'Time interval from the date of the initial pathologic diagnosis to the date of human immunodeficiency diagnosis, represented as a calculated number of days.\n',
          termDef: {
            cde_id: 4618491,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Human Immunodeficiency Virus Diagnosis Subtract Initial Pathologic Diagnosis Time Duration Day Calculation Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4618491&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      days_to_last_follow_up: {
        term: {
          description: 'Time interval from the date of last follow up to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
          termDef: {
            cde_id: 3008273,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Last Communication Contact Less Initial Pathologic Diagnosis Date Calculated Day Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3008273&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      days_to_last_known_disease_status: {
        term: {
          description: 'Time interval from the date of last follow up to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
          termDef: {
            cde_id: 3008273,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Last Communication Contact Less Initial Pathologic Diagnosis Date Calculated Day Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3008273&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      days_to_new_event: {
        term: {
          description: 'Time interval from the date of new tumor event including progression, recurrence and new primary malignacies to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
          termDef: {
            cde_id: 3392464,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'New Tumor Event Less Initial Pathologic Diagnosis Date Calculated Day Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3392464&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      days_to_recurrence: {
        term: {
          description: 'Time interval from the date of new tumor event including progression, recurrence and new primary malignancies to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
          termDef: {
            cde_id: 3392464,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'New Tumor Event Less Initial Pathologic Diagnosis Date Calculated Day Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3392464&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      figo_stage: {
        enum: [
          'Stage 0',
          'Stage I',
          'Stage IA',
          'Stage IA1',
          'Stage IA2',
          'Stage IB',
          'Stage IB1',
          'Stage IB2',
          'Stage IC',
          'Stage II',
          'Stage IIA',
          'Stage IIA1',
          'Stage IIA2',
          'Stage IIB',
          'Stage III',
          'Stage IIIA',
          'Stage IIIB',
          'Stage IIIC',
          'Stage IIIC1',
          'Stage IIIC2',
          'Stage IV',
          'Stage IVA',
          'Stage IVB',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'The extent of a cervical or endometrial cancer within the body, especially whether the disease has spread from the original site to other parts of the body, as described by the International Federation of Gynecology and Obstetrics (FIGO) stages.\n',
          termDef: {
            cde_id: 3225684,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Gynecologic Tumor Grouping Cervical Endometrial FIGO 2009 Stage',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3225684&version=1.0',
          },
        },
      },
      hiv_positive: {
        enum: [
          'Yes',
          'No',
          'Unknown',
        ],
        term: {
          description: 'Text term to signify whether a physician has diagnosed HIV infection in a patient.\n',
          termDef: {
            cde_id: 4030799,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Physician Diagnosed HIV Infection Personal Medical History Yes No Not Applicable Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4030799&version=1.0',
          },
        },
      },
      hpv_positive_type: {
        enum: [
          'HPV 16',
          'HPV 18',
          'Other HPV type(s)',
          'Unknown',
        ],
        term: {
          description: 'Text classification to represent the strain or type of human papillomavirus identified in an individual.\n',
          termDef: {
            cde_id: 2922649,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Human Papillomavirus Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2922649&version=1.0',
          },
        },
      },
      hpv_status: {
        enum: [
          'Negative',
          'Positive',
          'Unknown',
        ],
        term: {
          description: 'The findings of the oncogenic HPV.\n',
          termDef: {
            cde_id: 2230033,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Oncogenic Human Papillomavirus Result Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2230033&version=1.0',
          },
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      last_known_disease_status: {
        enum: [
          'Distant met recurrence/progression',
          'Loco-regional recurrence/progression',
          'Biochemical evidence of disease without structural correlate',
          'Tumor free',
          'Unknown tumor status',
          'With tumor',
          'not reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term that describes the last known state or condition of an individual\'s neoplasm.\n',
          termDef: {
            cde_id: 5424231,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Person Last Known Neoplasm Status',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2759550&version=1.0',
          },
        },
      },
      laterality: {
        enum: [
          'Bilateral',
          'Left',
          'Right',
          'Unknown',
        ],
        term: {
          description: 'For tumors in paired organs, designates the side on which the cancer originates.\n',
          termDef: {
            cde_id: 827,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Primary Tumor Laterality',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=827&version=3.0',
          },
        },
      },
      ldh_level_at_diagnosis: {
        term: {
          description: 'The 2 decimal place numeric laboratory value measured, assigned or computed related to the assessment of lactate dehydrogenase in a specimen.\n',
          termDef: {
            cde_id: 2798766,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Laboratory Procedure Lactate Dehydrogenase Result Integer::2 Decimal Place Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2798766&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      ldh_normal_range_upper: {
        term: {
          description: 'The top value of the range of statistical characteristics that are supposed to represent accepted standard, non-pathological pattern for lactate dehydrogenase (units not specified).\n',
          termDef: {
            cde_id: 2597015,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Laboratory Procedure Lactate Dehydrogenase Result Upper Limit of Normal Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2597015&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
      lymph_nodes_positive: {
        term: {
          description: 'The number of lymph nodes involved with disease as determined by pathologic examination.\n',
          termDef: {
            cde_id: 89,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Lymph Node(s) Positive Number',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=89&version=3.0',
          },
        },
        type: 'integer',
      },
      lymphatic_invasion_present: {
        enum: [
          'Yes',
          'No',
          'Unknown',
        ],
        term: {
          description: 'A yes/no indicator to ask if small or thin-walled vessel invasion is present, indicating lymphatic involvement\n',
          termDef: {
            cde_id: 64171,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Lymphatic/Small vessel Invasion Ind',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=64171&version=3.0',
          },
        },
      },
      method_of_diagnosis: {
        enum: [
          'Autopsy',
          'Biopsy',
          'Blood Draw',
          'Bone Marrow Aspirate',
          'Core Biopsy',
          'Cytology',
          'Debulking',
          'Diagnostic Imaging',
          'Excisional Biopsy',
          'Fine Needle Aspiration',
          'Incisional Biopsy',
          'Laparoscopy',
          'Laparotomy',
          'Other',
          'Surgical Resection',
          'Ultrasound Guided Biopsy',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'The method used to initially the patient\'s diagnosis.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: null,
            term: 'Method of Diagnosis',
            term_url: null,
          },
        },
      },
      morphology: {
        term: {
          description: 'The third edition of the International Classification of Diseases for Oncology, published in 2000 used principally in tumor and cancer registries for coding the site (topography) and the histology (morphology) of neoplasms. The study of the structure of the cells and their arrangement to constitute tissues and, finally, the association among these to form organs. In pathology, the microscopic process of identifying normal and abnormal morphologic characteristics in tissues, by employing various cytochemical and immunocytochemical stains. A system of numbered categories for representation of data.\n',
          termDef: {
            cde_id: 3226275,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'International Classification of Diseases for Oncology, Third Edition ICD-O-3 Histology Code',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3226275&version=1.0',
          },
        },
        type: 'string',
      },
      new_event_anatomic_site: {
        enum: [
          'Abdomen',
          'Adrenal',
          'Anus',
          'Appendix',
          'Ascites/Peritoneum',
          'Axillary lymph nodes',
          'Bladder',
          'Bone',
          'Bone Marrow',
          'Brain',
          'Breast',
          'Cervical lymph nodes',
          'Cervix',
          'Colon',
          'Conjunctiva',
          'Contralateral Pleura',
          'Distant Metastasis',
          'Epididymis',
          'Epidural',
          'Epitrochlear lymph nodes',
          'Esophagus',
          'Extremities',
          'Femoral lymph nodes',
          'Gallbladder',
          'Gastrointestinal/Abdominal',
          'Head & Neck',
          'Heart',
          'Hilar lymph nodes',
          'Hypopharynx',
          'Iliac Lymph Node',
          'Iliac-common lymph nodes',
          'Iliac-external lymph nodes',
          'Inguinal lymph nodes',
          'Intraocular',
          'Ipsilateral Chest Cavity',
          'Ipsilateral Chest Wall',
          'Ipsilateral Lymph Nodes',
          'Ipsilateral Pleura',
          'Kidney',
          'Large Intestine',
          'Larynx',
          'Leptomeninges',
          'Liver',
          'Lung',
          'Lymph Node Only',
          'Lymph Node(s)',
          'Mandible',
          'Maxilla',
          'Mediastinal Soft Tissue',
          'Mediastinal lymph nodes',
          'Mediastinal/Intra-thoracic',
          'Mesenteric lymph nodes',
          'Nasal Soft Tissue',
          'Nasopharynx',
          'No Known Extranodal Involvement',
          'Non-regional / Distant Lymph Nodes',
          'Not Applicable',
          'Occipital lymph nodes',
          'Oral Cavity',
          'Oropharynx',
          'Other',
          'Other Extranodal Site',
          'Other, specify',
          'Ovary',
          'Pancreas',
          'Paraaortic lymph nodes',
          'Parotid Gland',
          'Parotid lymph nodes',
          'Pelvis',
          'Peri-orbital Soft Tissue',
          'Pericardium',
          'Perihilar Lymph Node',
          'Peripheral Blood',
          'Peritoneal Surfaces',
          'Pleura/Pleural Effusion',
          'Popliteal lymph nodes',
          'Prostate',
          'Pulmonary',
          'Rectum',
          'Renal Pelvis',
          'Retroperitoneal lymph nodes',
          'Retroperitoneum',
          'Salivary Gland',
          'Sinus',
          'Skin',
          'Small Intestine',
          'Soft Tissue',
          'Splenic lymph nodes',
          'Stomach',
          'Submandibular lymph nodes',
          'Supraclavicular lymph nodes',
          'Testes',
          'Thyroid',
          'Trunk',
          'Tumor Bed',
          'Ureter',
          'Urethra',
          'Uterus',
          'Vulva',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term to specify the anatomic location of the return of tumor after treatment.\n',
          termDef: {
            cde_id: 3108271,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'New Neoplasm Event Occurrence Anatomic Site',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3108271&version=2.0',
          },
        },
      },
      new_event_type: {
        enum: [
          'Biochemical Evidence of Disease',
          'Both Locoregional and Distant Metastasis',
          'Distant Metastasis',
          'Extrahepatic Recurrence',
          'Intrahepatic Recurrence',
          'Intrapleural Progression',
          'Locoregional (Urothelial tumor event)',
          'Locoregional Disease',
          'Locoregional Recurrence',
          'Metachronous Testicular Tumor',
          'Metastatic',
          'New Primary Tumor',
          'New primary Melanoma',
          'No New Tumor Event',
          'Not Applicable',
          'Progression of Disease',
          'Recurrence',
          'Regional Lymph Node',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term to identify a new tumor event.\n',
          termDef: {
            cde_id: 3119721,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'New Neoplasm Event Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3119721&version=1.0',
          },
        },
      },
      perineural_invasion_present: {
        enum: [
          'Yes',
          'No',
          'Unknown',
        ],
        term: {
          description: 'a yes/no indicator to ask if perineural invasion or infiltration of tumor or cancer is present.\n',
          termDef: {
            cde_id: 64181,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Tumor Perineural Invasion Ind',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=64181&version=3.0',
          },
        },
      },
      primary_diagnosis: {
        term: {
          description: 'Text term for the structural pattern of cancer cells used to define a microscopic diagnosis.\n',
          termDef: {
            cde_id: 3081934,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Neoplasm Histologic Type Name',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3081934&version=3.0',
          },
        },
        type: 'string',
      },
      prior_malignancy: {
        enum: [
          'yes',
          'no',
          'unknown',
          'not reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term to describe the patient\'s history of prior cancer diagnosis and the spatial location of any previous cancer occurrence.\n',
          termDef: {
            cde_id: 3382736,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Prior Cancer Diagnosis Occurrence Description Text',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3382736&version=2.0',
          },
        },
      },
      prior_treatment: {
        enum: [
          'Yes',
          'No',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'A yes/no/unknown/not applicable indicator related to the administration of therapeutic agents received before the body specimen was collected.\n',
          termDef: {
            cde_id: 4231463,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Therapeutic Procedure Prior Specimen Collection Administered Yes No Unknown Not Applicable Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4231463&version=1.0',
          },
        },
      },
      progression_or_recurrence: {
        enum: [
          'yes',
          'no',
          'unknown',
          'not reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Yes/No/Unknown indicator to identify whether a patient has had a new tumor event after initial treatment.\n',
          termDef: {
            cde_id: 3121376,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'New Neoplasm Event Post Initial Therapy Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3121376&version=1.0',
          },
        },
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      residual_disease: {
        enum: [
          'R0',
          'R1',
          'R2',
          'RX',
        ],
        term: {
          description: 'Text terms to describe the status of a tissue margin following surgical resection.\n',
          termDef: {
            cde_id: 2608702,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Surgical Margin Resection Status',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2608702&version=1.0',
          },
        },
      },
      site_of_resection_or_biopsy: {
        term: {
          description: 'The third edition of the International Classification of Diseases for Oncology, published in 2000, used principally in tumor and cancer registries for coding the site (topography) and the histology (morphology) of neoplasms. The description of an anatomical region or of a body part. Named locations of, or within, the body. A system of numbered categories for representation of data.\n',
          termDef: {
            cde_id: 3226281,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'International Classification of Diseases for Oncology, Third Edition ICD-O-3 Site Code',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3226281&version=1.0',
          },
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      tissue_or_organ_of_origin: {
        term: {
          description: 'Text term that describes the anatomic site of the tumor or disease.\n',
          termDef: {
            cde_id: 3427536,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Tumor Disease Anatomic Site',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3427536&version=3.0',
          },
        },
        type: 'string',
      },
      tumor_grade: {
        term: {
          description: 'Numeric value to express the degree of abnormality of cancer cells, a measure of differentiation and aggressiveness.\n',
          termDef: {
            cde_id: 2785839,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Neoplasm Histologic Grade',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2785839&version=2.0',
          },
        },
        type: 'string',
      },
      tumor_stage: {
        term: {
          description: 'The extent of a cancer in the body. Staging is usually based on the size of the tumor, whether lymph nodes contain cancer, and whether the cancer has spread from the original site to other parts of the body. The accepted values for tumor_stage depend on the tumor site, type, and accepted staging system. These items should accompany the tumor_stage value as associated metadata.\n',
          termDef: {
            cde_id: 'C16899',
            cde_version: null,
            source: 'NCIt',
            term: 'Tumor Stage',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=NCI%20Thesaurus&code=C16899',
          },
        },
        type: 'string',
      },
      type: {
        type: 'string',
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      vascular_invasion_present: {
        enum: [
          'Yes',
          'No',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'The yes/no indicator to ask if large vessel or venous invasion was detected by surgery or presence in a tumor specimen.\n',
          termDef: {
            cde_id: 64358,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Tumor Vascular Invasion Ind-3',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=64358&version=3.0',
          },
        },
      },
      vital_status: {
        enum: [
          'alive',
          'dead',
          'lost to follow-up',
          'unknown',
          'not reported',
          'Not Allowed To Collect',
          'pending',
        ],
        term: {
          description: 'The survival state of the person registered on the protocol.\n',
          termDef: {
            cde_id: 5,
            cde_version: 5.0,
            source: 'caDSR',
            term: 'Patient Vital Status',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5&version=5.0',
          },
        },
      },
      year_of_diagnosis: {
        term: {
          description: 'Numeric value to represent the year of an individual\'s initial pathologic diagnosis of cancer.\n',
          termDef: {
            cde_id: 2896960,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Year of initial pathologic diagnosis',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2896960&version=1.0',
          },
        },
        type: [
          'number',
          'null',
        ],
      },
    },
    required: [
      'age_at_diagnosis',
      'days_to_last_follow_up',
      'vital_status',
      'primary_diagnosis',
      'morphology',
      'tissue_or_organ_of_origin',
      'site_of_resection_or_biopsy',
      'classification_of_tumor',
      'tumor_stage',
      'tumor_grade',
      'progression_or_recurrence',
      'days_to_recurrence',
      'days_to_last_known_disease_status',
      'last_known_disease_status',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Diagnosis',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  experiment: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'administrative',
    description: 'A coordinated set of actions and observations designed to generate data, with the ultimate goal of discovery or hypothesis testing.\n',
    id: 'experiment',
    links: [
      {
        backref: 'experiments',
        label: 'performed_for',
        multiplicity: 'many_to_one',
        name: 'projects',
        required: true,
        target_type: 'project',
      },
    ],
    namespace: 'http://bloodprofilingatlas.org/bpa/',
    program: '*',
    project: '*',
    properties: {
      associated_experiment: {
        description: 'The submitter_id for any experiment with which this experiment is associated, paired, or matched.',
        type: [
          'string',
        ],
      },
      copy_numbers_identified: {
        description: 'Are copy number variations identified in this experiment?',
        type: 'boolean',
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      data_description: {
        description: 'Brief description of the data being provided for this experiment.',
        type: 'string',
      },
      experimental_description: {
        description: 'A brief description of the experiment being performed.',
        type: [
          'string',
        ],
      },
      experimental_intent: {
        description: 'Summary of the goals the experiment is designed to discover.',
        type: [
          'string',
        ],
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      indels_identified: {
        description: 'Are indels identified in this experiment?',
        type: 'boolean',
      },
      marker_panel_description: {
        description: 'Brief description of the marker panel used in this experiment.',
        type: 'string',
      },
      number_experimental_group: {
        description: 'The number denoting this experiment\'s place within the group within the whole.',
        type: [
          'integer',
        ],
      },
      number_samples_per_experimental_group: {
        description: 'The number of samples contained within this experimental group.',
        type: [
          'integer',
        ],
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      projects: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      somatic_mutations_identified: {
        description: 'Are somatic mutations identified for this experiment?',
        type: 'boolean',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'experiment',
        ],
      },
      type_of_data: {
        description: 'Is the data raw or processed?',
        enum: [
          'Raw',
          'Processed',
        ],
      },
      type_of_sample: {
        description: 'String indicator identifying the types of samples as contrived or clinical.',
        type: [
          'string',
        ],
      },
      type_of_specimen: {
        description: 'Broad description of the specimens used in the experiment.',
        type: [
          'string',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'projects',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
    ],
    title: 'Experiment',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  experimental_analysis: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'notation',
    description: 'Information pertaining to processed results obtained from the experiment.\n',
    id: 'experimental_analysis',
    links: [
      {
        exclusive: true,
        required: true,
        subgroup: [
          {
            backref: 'experimental_analyses',
            label: 'data_from',
            multiplicity: 'many_to_many',
            name: 'read_groups',
            required: false,
            target_type: 'read_group',
          },
          {
            backref: 'experimental_analyses',
            label: 'data_from',
            multiplicity: 'many_to_many',
            name: 'experiments',
            required: false,
            target_type: 'experiment',
          },
        ],
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      experiments: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      llod: {
        description: 'The lower limit of detection. lowest quantity of a substance that can be distinguished from the absence of that substance (a blank value) within a stated confidence limit (generally 1%).\n',
        oneOf: [
          {
            enum: [
              'WT',
            ],
          },
          {
            type: 'number',
          },
        ],
        type: [
          'number',
          'string',
        ],
      },
      project_id: {
        type: 'string',
      },
      read_groups: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      sensitivity: {
        description: 'The true positive rate.',
        oneOf: [
          {
            enum: [
              'WT',
            ],
          },
          {
            type: 'number',
          },
        ],
        type: [
          'number',
          'string',
        ],
      },
      specificity: {
        description: 'The true negative rate.',
        oneOf: [
          {
            enum: [
              'WT',
            ],
          },
          {
            type: 'number',
          },
        ],
        type: [
          'number',
          'string',
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'experimental_analysis',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
    ],
    title: 'Experimental Analysis',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  experimental_metadata: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'metadata_file',
    description: 'Data file containing the metadata for the experiment performed.\n',
    id: 'experimental_metadata',
    links: [
      {
        backref: 'experiment_metadata_files',
        label: 'derived_from',
        multiplicity: 'many_to_many',
        name: 'experiments',
        required: false,
        target_type: 'experiment',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      data_category: {
        term: {
          description: 'Broad categorization of the contents of the data file.\n',
        },
        type: [
          'string',
        ],
      },
      data_format: {
        term: {
          description: 'Format of the data files.\n',
        },
        type: [
          'string',
        ],
      },
      data_type: {
        enum: [
          'Experimental Metadata',
        ],
        term: {
          description: 'Specific content type of the data file.\n',
        },
      },
      error_type: {
        enum: [
          'file_size',
          'file_format',
          'md5sum',
        ],
        term: {
          description: 'Type of error for the data file object.\n',
        },
      },
      experiments: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      file_name: {
        term: {
          description: 'The name (or part of a name) of a file (of any type).\n',
        },
        type: 'string',
      },
      file_size: {
        term: {
          description: 'The size of the data file (object) in bytes.\n',
        },
        type: 'number',
      },
      file_state: {
        default: 'registered',
        enum: [
          'registered',
          'uploading',
          'uploaded',
          'validating',
          'validated',
          'submitted',
          'processing',
          'processed',
          'released',
          'error',
        ],
        term: {
          description: 'The current state of the data file object.\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      md5sum: {
        term: {
          description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      state_comment: {
        description: 'Optional comment about why the file is in the current state, mainly for invalid state.\n',
        type: 'string',
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'experimental_metadata',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'file_name',
      'file_size',
      'md5sum',
      'data_category',
      'data_type',
      'data_format',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
      'file_state',
      'error_type',
    ],
    title: 'Experimental Metadata',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  exposure: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'clinical',
    description: 'Clinically relevant patient information not immediately resulting from genetic predispositions.\n',
    id: 'exposure',
    links: [
      {
        backref: 'exposures',
        label: 'describes',
        multiplicity: 'many_to_one',
        name: 'cases',
        required: true,
        target_type: 'case',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    preferred: [
      'cigarettes_per_day',
      'years_smoked',
    ],
    program: '*',
    project: '*',
    properties: {
      alcohol_history: {
        term: {
          description: 'A response to a question that asks whether the participant has consumed at least 12 drinks of any kind of alcoholic beverage in their lifetime.\n',
          termDef: {
            cde_id: 2201918,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Alcohol Lifetime History Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2201918&version=1.0',
          },
        },
        type: 'string',
      },
      alcohol_intensity: {
        term: {
          description: 'Category to describe the patient\'s current level of alcohol use as self-reported by the patient.\n',
          termDef: {
            cde_id: 3457767,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Person Self-Report Alcoholic Beverage Exposure Category',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3457767&version=1.0',
          },
        },
        type: 'string',
      },
      bmi: {
        term: {
          description: 'The body mass divided by the square of the body height expressed in units of kg/m^2.\n',
          termDef: {
            cde_id: 4973892,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Body Mass Index (BMI)',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4973892&version=1.0',
          },
        },
        type: 'number',
      },
      cases: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      cigarettes_per_day: {
        term: {
          description: 'The average number of cigarettes smoked per day.\n',
          termDef: {
            cde_id: 2001716,
            cde_version: 4.0,
            source: 'caDSR',
            term: 'Smoking Use Average Number',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2001716&version=4.0',
          },
        },
        type: 'number',
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      height: {
        term: {
          description: 'The height of the patient in centimeters.\n',
          termDef: {
            cde_id: 649,
            cde_version: 4.1,
            source: 'caDSR',
            term: 'Patient Height Measurement',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=649&version=4.1',
          },
        },
        type: 'number',
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      pack_years_smoked: {
        term: {
          description: 'Numeric computed value to represent lifetime tobacco exposure defined as number of cigarettes smoked per day x number of years smoked divided by 20.\n',
          termDef: {
            cde_id: 2955385,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Person Cigarette Smoking History Pack Year Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2955385&version=1.0',
          },
        },
        type: 'number',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      tobacco_smoking_onset_year: {
        term: {
          description: 'The year in which the participant began smoking.\n',
          termDef: {
            cde_id: 2228604,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Started Smoking Year',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2228604&version=1.0',
          },
        },
        type: 'integer',
      },
      tobacco_smoking_quit_year: {
        term: {
          description: 'The year in which the participant quit smoking.\n',
          termDef: {
            cde_id: 2228610,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Stopped Smoking Year',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2228610&version=1.0',
          },
        },
        type: 'integer',
      },
      tobacco_smoking_status: {
        enum: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Category describing current smoking status and smoking history as self-reported by a patient.\n',
          termDef: {
            cde_id: 2181650,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Patient Smoking History Category',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2181650&version=1.0',
          },
        },
      },
      type: {
        enum: [
          'exposure',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      weight: {
        term: {
          description: 'The weight of the patient measured in kilograms.\n',
          termDef: {
            cde_id: 651,
            cde_version: 4.0,
            source: 'caDSR',
            term: 'Patient Weight Measurement',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=651&version=4.0',
          },
        },
        type: 'number',
      },
      years_smoked: {
        term: {
          description: 'Numeric value (or unknown) to represent the number of years a person has been smoking.\n',
          termDef: {
            cde_id: 3137957,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Person Smoking Duration Year Count',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3137957&version=1.0',
          },
        },
        type: 'number',
      },
    },
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Exposure',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  family_history: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'clinical',
    description: 'Record of a patient\'s background regarding cancer events of blood relatives.\n',
    id: 'family_history',
    links: [
      {
        backref: 'family_histories',
        label: 'describes',
        multiplicity: 'many_to_one',
        name: 'cases',
        required: true,
        target_type: 'case',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      cases: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      relationship_age_at_diagnosis: {
        term: {
          description: 'The age (in years) when the patient\'s relative was first diagnosed.\n',
          termDef: {
            cde_id: 5300571,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Relative Diagnosis Age Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5300571&version=1.0',
          },
        },
        type: 'number',
      },
      relationship_gender: {
        enum: [
          'female',
          'male',
          'unknown',
          'unspecified',
          'not reported',
        ],
        term: {
          description: 'Text designations that identify gender. Gender is described as the assemblage of properties that distinguish people on the basis of their societal roles. [Explanatory Comment 1: Identification of gender is based upon self-report and may come from a form, questionnaire, interview, etc.]\n',
          termDef: {
            cde_id: 2200604,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Person Gender Text Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2200604&version=3.0',
          },
        },
      },
      relationship_primary_diagnosis: {
        term: {
          description: 'Text term for the structural pattern of cancer cells used to define a microscopic diagnosis.\n',
          termDef: {
            cde_id: 3081934,
            cde_version: 3.0,
            source: 'caDSR',
            term: 'Neoplasm Histologic Type Name',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3081934&version=3.0',
          },
        },
        type: 'string',
      },
      relationship_type: {
        term: {
          description: 'The subgroup that describes the state of connectedness between members of the unit of society organized around kinship ties.\n',
          termDef: {
            cde_id: 2690165,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Family Member Relationship Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2690165&version=2.0',
          },
        },
        type: 'string',
      },
      relative_with_cancer_history: {
        enum: [
          'yes',
          'no',
          'unknown',
          'not reported',
        ],
        term: {
          description: 'Indicator to signify whether or not an individual\'s biological relative has been diagnosed with another type of cancer.\n',
          termDef: {
            cde_id: 3901752,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Other Cancer Biological Relative History Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3901752&version=1.0',
          },
        },
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'family_history',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Family History',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  keyword: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'administrative',
    description: 'A keyword for a project.',
    id: 'keyword',
    links: [
      {
        backref: 'keywords',
        label: 'describe',
        multiplicity: 'many_to_many',
        name: 'projects',
        required: true,
        target_type: 'project',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      keyword_name: {
        description: 'The name of the keyword.',
        type: 'string',
      },
      project_id: {
        type: 'string',
      },
      projects: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'keyword',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'projects',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Keyword',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  metaschema: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    allOf: [
      {
        $ref: 'http://json-schema.org/draft-04/schema#',
      },
    ],
    definitions: {
      link: {
        additionalProperties: false,
        properties: {
          backref: {
            type: 'string',
          },
          label: {
            type: 'string',
          },
          multiplicity: {
            enum: [
              'one_to_one',
              'one_to_many',
              'many_to_one',
              'many_to_many',
            ],
            type: 'string',
          },
          name: {
            type: 'string',
          },
          required: {
            type: 'boolean',
          },
          target_type: {
            type: 'string',
          },
        },
        required: [
          'name',
          'target_type',
          'backref',
          'label',
          'multiplicity',
          'required',
        ],
        type: 'object',
      },
      link_subgroup: {
        properties: {
          exclusive: {
            type: 'boolean',
          },
          required: {
            type: 'boolean',
          },
          subgroup: {
            items: {
              $ref: '#/definitions/link',
            },
            type: 'array',
          },
        },
        required: [
          'exclusive',
          'required',
          'subgroup',
        ],
      },
      validator_def: {
        properties: {
          link_to_type: {
            type: 'string',
          },
          multiplicity: {
            enum: [
              'one_to_one',
              'one_to_many',
              'many_to_one',
              'many_to_many',
            ],
            type: 'string',
          },
        },
        required: [
          'property',
          'function',
        ],
        title: 'Define a validator to be used on a property',
        type: 'object',
      },
    },
    id: 'metaschema',
    properties: {
      category: {
        enum: [
          'administrative',
          'analysis',
          'biospecimen',
          'clinical',
          'data',
          'data_bundle',
          'data_file',
          'index_file',
          'metadata_file',
          'notation',
          'qc_bundle',
          'TBD',
        ],
        type: 'string',
      },
      links: {
        items: {
          oneOf: [
            {
              $ref: '#/definitions/link',
            },
            {
              $ref: '#/definitions/link_subgroup',
            },
          ],
        },
        title: 'Define a link to other GDC entities',
        type: 'array',
      },
      submittable: {
        type: 'boolean',
      },
      system_properties: {
        type: 'array',
      },
      unique_keys: {
        items: {
          items: {
            type: 'string',
          },
          type: 'array',
        },
        type: 'array',
      },
      validators: {
        items: {
          $ref: '#/definitions/validator_def',
        },
        type: [
          'array',
          'null',
        ],
      },
    },
    required: [
      'category',
      'program',
      'project',
      'uniqueKeys',
      'links',
      'validators',
      'systemProperties',
      'id',
    ],
    title: 'GDC JSON schema extension',
  },
  program: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'administrative',
    description: 'A broad framework of goals to be achieved. (NCIt C52647)\n',
    id: 'program',
    links: [],
    program: '*',
    project: '*',
    properties: {
      dbgap_accession_number: {
        description: 'The dbgap accession number provided for the program.',
        type: 'string',
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      name: {
        description: 'Full name/title of the program.',
        type: 'string',
      },
      type: {
        type: 'string',
      },
    },
    required: [
      'name',
      'dbgap_accession_number',
    ],
    submittable: false,
    systemProperties: [
      'id',
    ],
    title: 'Program',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'name',
      ],
    ],
    validators: null,
  },
  project: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'administrative',
    constraints: null,
    description: 'Any specifically defined piece of work that is undertaken or attempted to meet a single requirement. (NCIt C47885)\n',
    id: 'project',
    links: [
      {
        backref: 'projects',
        label: 'member_of',
        multiplicity: 'many_to_one',
        name: 'programs',
        required: true,
        target_type: 'program',
      },
    ],
    program: '*',
    project: '*',
    properties: {
      availability_mechanism: {
        description: 'Mechanism by which the project will be made avilable.',
        type: 'string',
      },
      availability_type: {
        description: 'Is the project open or restricted?',
        enum: [
          'Open',
          'Restricted',
        ],
      },
      code: {
        description: 'Unique identifier for the project.',
        type: 'string',
      },
      date_collected: {
        description: 'The date or date range in which the project data was collected.',
        type: 'string',
      },
      dbgap_accession_number: {
        description: 'The dbgap accession number provided for the project.',
        type: 'string',
      },
      id: {
        description: 'UUID for the project.',
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      intended_release_date: {
        description: 'Tracks a Project\'s intended release date.',
        format: 'date-time',
        type: 'string',
      },
      investigator_affiliation: {
        description: 'The investigator\'s affiliation with respect to a research institution.',
        type: 'string',
      },
      investigator_name: {
        description: 'Name of the principal investigator for the project.',
        type: 'string',
      },
      name: {
        description: 'Display name/brief description for the project.',
        type: 'string',
      },
      programs: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
        description: 'Indicates that the project is logically part of the indicated project.\n',
      },
      releasable: {
        default: false,
        description: 'A project can only be released by the user when `releasable` is true.\n',
        type: 'boolean',
      },
      released: {
        default: false,
        description: 'To release a project is to tell the GDC to include all submitted\nentities in the next GDC index.\n',
        type: 'boolean',
      },
      state: {
        default: 'open',
        description: 'The possible states a project can be in.  All but `open` are\nequivalent to some type of locked state.\n',
        enum: [
          'open',
          'review',
          'submitted',
          'processing',
          'closed',
          'legacy',
        ],
      },
      support_id: {
        description: 'The ID of the source providing support/grant resources.',
        type: 'string',
      },
      support_source: {
        description: 'The name of source providing support/grant resources.',
        type: 'string',
      },
      type: {
        type: 'string',
      },
    },
    required: [
      'code',
      'name',
      'programs',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'state',
      'released',
      'releasable',
      'intended_release_date',
    ],
    title: 'Project',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'code',
      ],
    ],
    validators: null,
  },
  publication: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'administrative',
    description: 'Publication for a project.',
    id: 'publication',
    links: [
      {
        backref: 'publications',
        label: 'refers_to',
        multiplicity: 'many_to_many',
        name: 'projects',
        required: true,
        target_type: 'project',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      doi: {
        type: 'string',
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      pmid: {
        type: 'string',
      },
      project_id: {
        type: 'string',
      },
      projects: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'publication',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'projects',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Publication',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  read_group: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'biospecimen',
    description: 'Sequencing reads from one lane of an NGS experiment.',
    id: 'read_group',
    links: [
      {
        backref: 'read_groups',
        label: 'derived_from',
        multiplicity: 'many_to_one',
        name: 'aliquots',
        required: true,
        target_type: 'aliquot',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      RIN: {
        term: {
          description: 'A numerical assessment of the integrity of RNA based on the entire electrophoretic trace of the RNA sample including the presence or absence of degradation products.\n',
          termDef: {
            cde_id: 5278775,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Biospecimen RNA Integrity Number Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5278775&version=1.0',
          },
        },
        type: 'number',
      },
      adapter_name: {
        term: {
          description: 'Name of the sequencing adapter.\n',
        },
        type: 'string',
      },
      adapter_sequence: {
        term: {
          description: 'Base sequence of the sequencing adapter.\n',
        },
        type: 'string',
      },
      aliquots: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      barcoding_applied: {
        description: 'True/False: was barcoding applied?',
        type: 'boolean',
      },
      base_caller_name: {
        term: {
          description: 'Name of the base caller.\n',
        },
        type: 'string',
      },
      base_caller_version: {
        term: {
          description: 'Version of the base caller.\n',
        },
        type: 'string',
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      experiment_name: {
        term: {
          description: 'Submitter-defined name for the experiment.\n',
        },
        type: 'string',
      },
      flow_cell_barcode: {
        term: {
          description: 'Flow Cell Barcode.\n',
        },
        type: 'string',
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      includes_spike_ins: {
        term: {
          description: 'Spike-in included?\n',
        },
        type: 'boolean',
      },
      instrument_model: {
        enum: [
          '454 GS FLX Titanium',
          'AB SOLiD 4',
          'AB SOLiD 2',
          'AB SOLiD 3',
          'Complete Genomics',
          'Illumina HiSeq X Ten',
          'Illumina HiSeq X Five',
          'Illumina Genome Analyzer II',
          'Illumina Genome Analyzer IIx',
          'Illumina HiSeq 2000',
          'Illumina HiSeq 2500',
          'Illumina HiSeq 4000',
          'Illumina MiSeq',
          'Illumina NextSeq',
          'Ion Torrent PGM',
          'Ion Torrent Proton',
          'PacBio RS',
          'Ion S5 XL System, Ion 530 Chip',
          'Other',
        ],
        terms: {
          description: 'Numeric value that represents the sample dimension that is greater than the shortest dimension and less than the longest dimension, measured in millimeters.\n',
          termDef: {
            cde_id: 5432604,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Intermediate Dimension Millimeter Measurement',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432604&version=1.0',
          },
        },
      },
      is_paired_end: {
        term: {
          description: 'Are the reads paired end?\n',
        },
        type: 'boolean',
      },
      library_name: {
        term: {
          description: 'Name of the library.\n',
        },
        type: 'string',
      },
      library_preparation_kit_catalog_number: {
        term: {
          description: 'Catalog of Library Preparation Kit\n',
        },
        type: 'string',
      },
      library_preparation_kit_name: {
        term: {
          description: 'Name of Library Preparation Kit\n',
        },
        type: 'string',
      },
      library_preparation_kit_vendor: {
        term: {
          description: 'Vendor of Library Preparation Kit\n',
        },
        type: 'string',
      },
      library_preparation_kit_version: {
        term: {
          description: 'Version of Library Preparation Kit\n',
        },
        type: 'string',
      },
      library_selection: {
        enum: [
          'Hybrid_Selection',
          'PCR',
          'Affinity_Enrichment',
          'Poly-T_Enrichment',
          'RNA_Depletion',
          'Other',
        ],
        term: {
          description: 'Library Selection Method\n',
        },
      },
      library_strand: {
        enum: [
          'Unstranded',
          'First_Stranded',
          'Second_Stranded',
        ],
        term: {
          description: 'Library stranded-ness.\n',
        },
      },
      library_strategy: {
        enum: [
          'WGS',
          'WXS',
          'RNA-Seq',
          'ChIP-Seq',
          'miRNA-Seq',
          'Bisulfite-Seq',
          'Validation',
          'Amplicon',
          'Other',
        ],
        term: {
          description: 'Library strategy.\n',
        },
      },
      platform: {
        enum: [
          'Illumina',
          'SOLiD',
          'LS454',
          'Ion Torrent',
          'Complete Genomics',
          'PacBio',
          'Other',
        ],
        term: {
          description: 'Name of the platform used to obtain data.\n',
        },
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      read_group_name: {
        description: 'Read Group Name',
        type: 'string',
      },
      read_length: {
        type: 'integer',
      },
      sequencing_center: {
        term: {
          description: 'Name of the center that provided the sequence files.\n',
        },
        type: 'string',
      },
      sequencing_date: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      size_selection_range: {
        term: {
          description: 'Range of size selection.\n',
        },
        type: 'string',
      },
      spike_ins_concentration: {
        term: {
          description: 'Spike in concentration.\n',
        },
        type: 'string',
      },
      spike_ins_fasta: {
        term: {
          description: 'Name of the FASTA file that contains the spike-in sequences.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: 'string',
      },
      target_capture_kit_catalog_number: {
        term: {
          description: 'Catalog of Target Capture Kit.\n',
        },
        type: 'string',
      },
      target_capture_kit_name: {
        term: {
          description: 'Name of Target Capture Kit.\n',
        },
        type: 'string',
      },
      target_capture_kit_target_region: {
        term: {
          description: 'Target Capture Kit BED file.\n',
        },
        type: 'string',
      },
      target_capture_kit_vendor: {
        term: {
          description: 'Vendor of Target Capture Kit.\n',
        },
        type: 'string',
      },
      target_capture_kit_version: {
        term: {
          description: 'Version of Target Capture Kit.\n',
        },
        type: 'string',
      },
      to_trim_adapter_sequence: {
        term: {
          description: 'Does the user suggest adapter trimming?\n',
        },
        type: 'boolean',
      },
      type: {
        enum: [
          'read_group',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'type',
      'submitter_id',
      'aliquots',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
    ],
    title: 'Read Group',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  read_group_qc: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'notation',
    description: 'GDC QC run metadata.',
    id: 'read_group_qc',
    links: [
      {
        exclusive: true,
        required: true,
        subgroup: [
          {
            backref: 'read_group_qcs',
            label: 'data_from',
            multiplicity: 'one_to_one',
            name: 'submitted_aligned_reads_files',
            required: false,
            target_type: 'submitted_aligned_reads',
          },
          {
            backref: 'read_group_qcs',
            label: 'data_from',
            multiplicity: 'one_to_many',
            name: 'submitted_unaligned_reads_files',
            required: false,
            target_type: 'submitted_unaligned_reads',
          },
        ],
      },
      {
        backref: 'read_group_qcs',
        label: 'generated_from',
        multiplicity: 'many_to_one',
        name: 'read_groups',
        required: true,
        target_type: 'read_group',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      adapter_content: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      basic_statistics: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      encoding: {
        term: {
          description: 'Version of ASCII encoding of quality values found in the file.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'Encoding',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/1%20Basic%20Statistics.html',
          },
        },
        type: 'string',
      },
      fastq_name: {
        term: {
          description: 'The name (or part of a name) of a file (of any type).\n',
        },
        type: 'string',
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      kmer_content: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      overrepresented_sequences: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      per_base_n_content: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      per_base_sequence_content: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      per_base_sequence_quality: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      per_sequence_gc_content: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      per_sequence_quality_score: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      per_tile_sequence_quality: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      percent_gc_content: {
        maximum: 100,
        minimum: 0,
        term: {
          description: 'The overall %GC of all bases in all sequences.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: '%GC',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/1%20Basic%20Statistics.html',
          },
        },
        type: 'integer',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      read_groups: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      sequence_duplication_levels: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      sequence_length_distribution: {
        enum: [
          'FAIL',
          'PASS',
          'WARN',
        ],
        term: {
          description: 'State classification given by FASTQC for the metric. Metric specific details about the states are available on their website.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'QC Metric State',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/',
          },
        },
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitted_aligned_reads_files: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      submitted_unaligned_reads_files: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      total_sequences: {
        term: {
          description: 'A count of the total number of sequences processed.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: 'FastQC',
            term: 'Total Sequences',
            term_url: 'http://www.bioinformatics.babraham.ac.uk/tables/fastqc/Help/3%20Analysis%20Modules/1%20Basic%20Statistics.html',
          },
        },
        type: 'integer',
      },
      type: {
        enum: [
          'read_group_qc',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      workflow_end_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      workflow_link: {
        description: 'Link to Github hash for the CWL workflow used.',
        type: 'string',
      },
      workflow_start_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      workflow_type: {
        enum: [
          'Read Group Quality Control',
        ],
        term: {
          description: 'Generic name for the workflow used to analyze a data set.\n',
        },
      },
      workflow_version: {
        description: 'Major version for a GDC workflow.',
        type: 'string',
      },
    },
    required: [
      'submitter_id',
      'workflow_link',
      'type',
      'percent_gc_content',
      'encoding',
      'total_sequences',
      'basic_statistics',
      'per_base_sequence_quality',
      'per_tile_sequence_quality',
      'per_sequence_quality_score',
      'per_base_sequence_content',
      'per_sequence_gc_content',
      'per_base_n_content',
      'sequence_length_distribution',
      'sequence_duplication_levels',
      'overrepresented_sequences',
      'adapter_content',
      'kmer_content',
      'read_groups',
    ],
    submittable: false,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
    ],
    title: 'Read Group QC',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  sample: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'biospecimen',
    description: 'Any material sample taken from a biological entity for testing, diagnostic, propagation, treatment or research purposes, including a sample obtained from a living organism or taken from the biological object after halting of all its life functions. Biospecimen can contain one or more components including but not limited to cellular molecules, cells, tissues, organs, body fluids, embryos, and body excretory products.\n',
    id: 'sample',
    links: [
      {
        backref: 'samples',
        label: 'derived_from',
        multiplicity: 'many_to_one',
        name: 'cases',
        required: true,
        target_type: 'case',
      },
      {
        backref: 'samples',
        label: 'related_to',
        multiplicity: 'many_to_one',
        name: 'diagnoses',
        required: false,
        target_type: 'diagnosis',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      biospecimen_anatomic_site: {
        enum: [
          'Abdomen',
          'Abdominal Wall',
          'Acetabulum',
          'Adenoid',
          'Adipose',
          'Adrenal',
          'Alveolar Ridge',
          'Amniotic Fluid',
          'Ampulla Of Vater',
          'Anal Sphincter',
          'Ankle',
          'Anorectum',
          'Antecubital Fossa',
          'Antrum',
          'Anus',
          'Aorta',
          'Aortic Body',
          'Appendix',
          'Aqueous Fluid',
          'Arm',
          'Artery',
          'Ascending Colon',
          'Ascending Colon Hepatic Flexure',
          'Auditory Canal',
          'Autonomic Nervous System',
          'Axilla',
          'Back',
          'Bile Duct',
          'Bladder',
          'Blood',
          'Blood Vessel',
          'Bone',
          'Bone Marrow',
          'Bowel',
          'Brain',
          'Brain Stem',
          'Breast',
          'Broad Ligament',
          'Bronchiole',
          'Bronchus',
          'Brow',
          'Buccal Cavity',
          'Buccal Mucosa',
          'Buttock',
          'Calf',
          'Capillary',
          'Cardia',
          'Carina',
          'Carotid Artery',
          'Carotid Body',
          'Cartilage',
          'Cecum',
          'Cell-Line',
          'Central Nervous System',
          'Cerebellum',
          'Cerebral Cortex',
          'Cerebrospinal Fluid',
          'Cerebrum',
          'Cervical Spine',
          'Cervix',
          'Chest',
          'Chest Wall',
          'Chin',
          'Clavicle',
          'Clitoris',
          'Colon',
          'Colon - Mucosa Only',
          'Common Duct',
          'Conjunctiva',
          'Connective Tissue',
          'Dermal',
          'Descending Colon',
          'Diaphragm',
          'Duodenum',
          'Ear',
          'Ear Canal',
          'Ear, Pinna (External)',
          'Effusion',
          'Elbow',
          'Endocrine Gland',
          'Epididymis',
          'Epidural Space',
          'Esophagogastric Junction',
          'Esophagus',
          'Esophagus - Mucosa Only',
          'Eye',
          'Fallopian Tube',
          'Femoral Artery',
          'Femoral Vein',
          'Femur',
          'Fibroblasts',
          'Fibula',
          'Finger',
          'Floor Of Mouth',
          'Fluid',
          'Foot',
          'Forearm',
          'Forehead',
          'Foreskin',
          'Frontal Cortex',
          'Frontal Lobe',
          'Fundus Of Stomach',
          'Gallbladder',
          'Ganglia',
          'Gastroesophageal Junction',
          'Gastrointestinal Tract',
          'Groin',
          'Gum',
          'Hand',
          'Hard Palate',
          'Head & Neck',
          'Head - Face Or Neck, Nos',
          'Heart',
          'Hepatic',
          'Hepatic Duct',
          'Hepatic Vein',
          'Hip',
          'Hippocampus',
          'Humerus',
          'Hypopharynx',
          'Ileum',
          'Ilium',
          'Index Finger',
          'Ischium',
          'Islet Cells',
          'Jaw',
          'Jejunum',
          'Joint',
          'Kidney',
          'Knee',
          'Lacrimal Gland',
          'Large Bowel',
          'Laryngopharynx',
          'Larynx',
          'Leg',
          'Leptomeninges',
          'Ligament',
          'Lip',
          'Liver',
          'Lumbar Spine',
          'Lung',
          'Lymph Node',
          'Lymph Node(s) Axilla',
          'Lymph Node(s) Cervical',
          'Lymph Node(s) Distant',
          'Lymph Node(s) Epitrochlear',
          'Lymph Node(s) Femoral',
          'Lymph Node(s) Hilar',
          'Lymph Node(s) Iliac-Common',
          'Lymph Node(s) Iliac-External',
          'Lymph Node(s) Inguinal',
          'Lymph Node(s) Internal Mammary',
          'Lymph Node(s) Mammary',
          'Lymph Node(s) Mesenteric',
          'Lymph Node(s) Occipital',
          'Lymph Node(s) Paraaortic',
          'Lymph Node(s) Parotid',
          'Lymph Node(s) Pelvic',
          'Lymph Node(s) Popliteal',
          'Lymph Node(s) Regional',
          'Lymph Node(s) Retroperitoneal',
          'Lymph Node(s) Scalene',
          'Lymph Node(s) Splenic',
          'Lymph Node(s) Subclavicular',
          'Lymph Node(s) Submandibular',
          'Lymph Node(s) Supraclavicular',
          'Lymph Nodes(s) Mediastinal',
          'Mandible',
          'Maxilla',
          'Mediastinal Soft Tissue',
          'Mediastinum',
          'Mesentery',
          'Mesothelium',
          'Middle Finger',
          'Mitochondria',
          'Muscle',
          'Nails',
          'Nasal Cavity',
          'Nasal Soft Tissue',
          'Nasopharynx',
          'Neck',
          'Nerve',
          'Nerve(s) Cranial',
          'Occipital Cortex',
          'Ocular Orbits',
          'Omentum',
          'Oral Cavity',
          'Oral Cavity - Mucosa Only',
          'Oropharynx',
          'Other',
          'Ovary',
          'Palate',
          'Pancreas',
          'Paraspinal Ganglion',
          'Parathyroid',
          'Parotid Gland',
          'Patella',
          'Pelvis',
          'Penis',
          'Pericardium',
          'Periorbital Soft Tissue',
          'Peritoneal Cavity',
          'Peritoneum',
          'Pharynx',
          'Pineal',
          'Pineal Gland',
          'Pituitary Gland',
          'Placenta',
          'Pleura',
          'Popliteal Fossa',
          'Prostate',
          'Pylorus',
          'Rectosigmoid Junction',
          'Rectum',
          'Retina',
          'Retro-Orbital Region',
          'Retroperitoneum',
          'Rib',
          'Ring Finger',
          'Round Ligament',
          'Sacrum',
          'Salivary Gland',
          'Scalp',
          'Scapula',
          'Sciatic Nerve',
          'Scrotum',
          'Seminal Vesicle',
          'Shoulder',
          'Sigmoid Colon',
          'Sinus',
          'Sinus(es), Maxillary',
          'Skeletal Muscle',
          'Skin',
          'Skull',
          'Small Bowel',
          'Small Bowel - Mucosa Only',
          'Small Finger',
          'Soft Tissue',
          'Spinal Column',
          'Spinal Cord',
          'Spleen',
          'Splenic Flexure',
          'Sternum',
          'Stomach',
          'Stomach - Mucosa Only',
          'Subcutaneous Tissue',
          'Synovium',
          'Temporal Cortex',
          'Tendon',
          'Testis',
          'Thigh',
          'Thoracic Spine',
          'Thorax',
          'Throat',
          'Thumb',
          'Thymus',
          'Thyroid',
          'Tibia',
          'Tongue',
          'Tonsil',
          'Tonsil (Pharyngeal)',
          'Trachea / Major Bronchi',
          'Transverse Colon',
          'Trunk',
          'Umbilical Cord',
          'Ureter',
          'Urethra',
          'Urinary Tract',
          'Uterus',
          'Uvula',
          'Vagina',
          'Vas Deferens',
          'Vein',
          'Venous',
          'Vertebra',
          'Vulva',
          'White Blood Cells',
          'Wrist',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term that represents the name of the primary disease site of the submitted tumor sample.\n',
          termDef: {
            cde_id: 4742851,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Submitted Tumor Sample Primary Anatomic Site',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4742851&version=1.0',
          },
        },
      },
      cases: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      clinical_time_point: {
        description: 'Time point in the clinical stage at which the sample was collected.',
        type: 'string',
      },
      collection_datetime: {
        description: 'Datetime at which the sample was collected.',
        type: 'string',
      },
      collection_temperature: {
        description: 'Temperature in centigrade at which the sample was collected.',
        type: 'number',
      },
      composition: {
        enum: [
          'Buccal Cells',
          'Buffy Coat',
          'Bone Marrow Components',
          'Bone Marrow Components NOS',
          'Control Analyte',
          'Cell',
          'Circulating Tumor Cell (CTC)',
          'Derived Cell Line',
          'EBV Immortalized',
          'Fibroblasts from Bone Marrow Normal',
          'Granulocytes',
          'Human Original Cells',
          'Lymphocytes',
          'Mononuclear Cells from Bone Marrow Normal',
          'Peripheral Blood Components NOS',
          'Pleural Effusion',
          'Plasma',
          'Peripheral Whole Blood',
          'Serum',
          'Saliva',
          'Sputum',
          'Solid Tissue',
          'Whole Bone Marrow',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term that represents the cellular composition of the sample.\n',
          termDef: {
            cde_id: 5432591,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Biospecimen Cellular Composition Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432591&version=1.0',
          },
        },
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      ctc_concentration: {
        description: 'Concentration of the CTCs in the sample; units CTCs/mL.',
        type: 'number',
      },
      current_weight: {
        term: {
          description: 'Numeric value that represents the current weight of the sample, measured  in milligrams.\n',
          termDef: {
            cde_id: 5432606,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Current Weight Milligram Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432606&version=1.0',
          },
        },
        type: 'number',
      },
      days_to_collection: {
        term: {
          description: 'Time interval from the date of biospecimen collection to the date of initial pathologic diagnosis, represented as a calculated number of days.\n',
          termDef: {
            cde_id: 3008340,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Biospecimen Collection Date Less Initial Pathologic Diagnosis Date Calculated Day Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3008340&version=1.0',
          },
        },
        type: 'integer',
      },
      days_to_sample_procurement: {
        term: {
          description: 'The number of days from the date the patient was diagnosed to the date of the procedure that produced the sample.\n',
        },
        type: 'integer',
      },
      diagnoses: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      diagnosis_pathologically_confirmed: {
        enum: [
          'Yes',
          'No',
          'Unknown',
        ],
        term: {
          ref: '_terms.yaml#/diagnosis_pathologically_confirmed',
        },
      },
      freezing_method: {
        term: {
          description: 'Text term that represents the method used for freezing the sample.\n',
          termDef: {
            cde_id: 5432607,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Freezing Method Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432607&version=1.0',
          },
        },
        type: 'string',
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      initial_weight: {
        term: {
          description: 'Numeric value that represents the initial weight of the sample, measured in milligrams.\n',
          termDef: {
            cde_id: 5432605,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Initial Weight Milligram Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432605&version=1.0',
          },
        },
        type: 'number',
      },
      intermediate_dimension: {
        terms: {
          description: 'Intermediate dimension of the sample, in millimeters.\n',
        },
        type: 'string',
      },
      is_ffpe: {
        term: {
          description: 'Indicator to signify whether or not the tissue sample was fixed in formalin and embedded in paraffin (FFPE).\n',
          termDef: {
            cde_id: 4170557,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Specimen Processing Formalin Fixed Paraffin Embedded Tissue Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4170557&version=1.0',
          },
        },
        type: 'boolean',
      },
      longest_dimension: {
        terms: {
          description: 'Numeric value that represents the longest dimension of the sample, measured in millimeters.\n',
          termDef: {
            cde_id: 5432602,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Longest Dimension Millimeter Measurement',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432602&version=1.0',
          },
        },
        type: 'string',
      },
      method_of_sample_procurement: {
        enum: [
          'Abdomino-perineal Resection of Rectum',
          'Anterior Resection of Rectum',
          'Aspirate',
          'Biopsy',
          'Blood Draw',
          'Bone Marrow Aspirate',
          'Core Biopsy',
          'Cystectomy',
          'Endo Rectal Tumor Resection',
          'Endoscopic Biopsy',
          'Endoscopic Mucosal Resection (EMR)',
          'Enucleation',
          'Excisional Biopsy',
          'Fine Needle Aspiration',
          'Full Hysterectomy',
          'Gross Total Resection',
          'Hand Assisted Laparoscopic Radical Nephrectomy',
          'Hysterectomy NOS',
          'Incisional Biopsy',
          'Indeterminant',
          'Laparoscopic Biopsy',
          'Laparoscopic Partial Nephrectomy',
          'Laparoscopic Radical Nephrectomy',
          'Laparoscopic Radical Prostatectomy with Robotics',
          'Laparoscopic Radical Prostatectomy without Robotics',
          'Left Hemicolectomy',
          'Lobectomy',
          'Local Resection (Exoresection; wall resection)',
          'Lumpectomy',
          'Modified Radical Mastectomy',
          'Needle Biopsy',
          'Open Craniotomy',
          'Open Partial Nephrectomy',
          'Open Radical Nephrectomy',
          'Open Radical Prostatectomy',
          'Orchiectomy',
          'Other',
          'Other Surgical Resection',
          'Pan-Procto Colectomy',
          'Pneumonectomy',
          'Right Hemicolectomy',
          'Sigmoid Colectomy',
          'Simple Mastectomy',
          'Subtotal Resection',
          'Surgical Resection',
          'Thoracoscopic Biopsy',
          'Total Colectomy',
          'Total Mastectomy',
          'Transplant',
          'Transurethral resection (TURBT)',
          'Transverse Colectomy',
          'Tumor Resection',
          'Wedge Resection',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'The method used to procure the sample used to extract analyte(s).\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: null,
            term: 'Method of Sample Procurement',
            term_url: null,
          },
        },
      },
      oct_embedded: {
        term: {
          description: 'Indicator of whether or not the sample was embedded in Optimal Cutting Temperature (OCT) compound.\n',
          termDef: {
            cde_id: 5432538,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Optimal Cutting Temperature Compound Embedding Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432538&version=1.0',
          },
        },
        type: 'string',
      },
      pathology_report_uuid: {
        description: 'UUID of the related pathology report.',
        type: 'string',
      },
      preservation_method: {
        enum: [
          'Cryopreserved',
          'FFPE',
          'Fresh',
          'OCT',
          'Snap Frozen',
          'Frozen',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term that represents the method used to preserve the sample.\n',
          termDef: {
            cde_id: 5432521,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Preservation Method Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432521&version=1.0',
          },
        },
      },
      processing_datetime: {
        description: 'Datetime at which the sample was processed.',
        type: 'string',
      },
      project_id: {
        type: 'string',
      },
      sample_type: {
        enum: [
          'Additional Metastatic',
          'Additional - New Primary',
          'Blood Derived Cancer - Bone Marrow, Post-treatment',
          'Blood Derived Cancer - Peripheral Blood, Post-treatment',
          'Blood Derived Normal',
          'Bone Marrow Normal',
          'Buccal Cell Normal',
          'Cell Line Derived Xenograft Tissue',
          'Cell Lines',
          'cfDNA',
          'Circulating Tumor Cell (CTC)',
          'Control Analyte',
          'ctDNA',
          'DNA',
          'EBV Immortalized Normal',
          'FFPE Recurrent',
          'FFPE Scrolls',
          'Fibroblasts from Bone Marrow Normal',
          'GenomePlex (Rubicon) Amplified DNA',
          'Granulocytes',
          'Human Tumor Original Cells',
          'Metastatic',
          'Mononuclear Cells from Bone Marrow Normal',
          'Primary Blood Derived Cancer - Peripheral Blood',
          'Recurrent Blood Derived Cancer - Peripheral Blood',
          'Pleural Effusion',
          'Primary Blood Derived Cancer - Bone Marrow',
          'Primary Tumor',
          'Primary Xenograft Tissue',
          'Post neo-adjuvant therapy',
          'Recurrent Blood Derived Cancer - Bone Marrow',
          'Recurrent Tumor',
          'Repli-G (Qiagen) DNA',
          'Repli-G X (Qiagen) DNA',
          'RNA',
          'Slides',
          'Solid Tissue Normal',
          'Total RNA',
          'Xenograft Tissue',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term to describe the source of a biospecimen used for a laboratory test.\n',
          termDef: {
            cde_id: 3111302,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Specimen Type Collection Biospecimen Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3111302&version=2.0',
          },
        },
        type: 'string',
      },
      sample_type_id: {
        enum: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '20',
          '40',
          '41',
          '42',
          '50',
          '60',
          '61',
          '99',
        ],
        term: {
          description: 'The accompanying sample type id for the sample type.\n',
        },
        type: 'string',
      },
      sample_volume: {
        description: 'The volume of the sample in mL.',
        type: 'number',
      },
      shortest_dimension: {
        term: {
          description: 'Numeric value that represents the shortest dimension of the sample, measured in millimeters.\n',
          termDef: {
            cde_id: 5432603,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Short Dimension Millimeter Measurement',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432603&version=1.0',
          },
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      storage_duration: {
        description: 'Numeric duration for which a sample was stored before testing/experimentation. Requires accompanying storage_duration_unit submission.\n',
        type: 'number',
      },
      storage_duration_unit: {
        description: 'Unit of time for which the storage duration took place.',
        enum: [
          'Seconds',
          'Minutes',
          'Hours',
          'Days',
        ],
      },
      submitter_id: {
        description: 'The legacy barcode used before prior to the use UUIDs, varies by project. For TCGA this is bcrsamplebarcode.\n',
        type: [
          'string',
          'null',
        ],
      },
      time_between_clamping_and_freezing: {
        term: {
          description: 'Numeric representation of the elapsed time between the surgical clamping of blood supply and freezing of the sample, measured in minutes.\n',
          termDef: {
            cde_id: 5432611,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Clamping and Freezing Elapsed Minute Time',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432611&version=1.0',
          },
        },
        type: 'string',
      },
      time_between_excision_and_freezing: {
        term: {
          description: 'Numeric representation of the elapsed time between the excision and freezing of the sample, measured in minutes.\n',
          termDef: {
            cde_id: 5432612,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Excision and Freezing Elapsed Minute Time',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432612&version=1.0',
          },
        },
        type: 'string',
      },
      tissue_type: {
        enum: [
          'Tumor',
          'Normal',
          'Abnormal',
          'Peritumoral',
          'Contrived',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term that represents a description of the kind of tissue collected with respect to disease status or proximity to tumor tissue.\n',
          termDef: {
            cde_id: 5432687,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tissue Sample Description Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432687&version=1.0',
          },
        },
      },
      tube_type: {
        description: 'The kind of tube used to collect the sample(s) taken from a biological entity for testing, diagnostic, propagation, treatment or research purposes.',
        enum: [
          'EDTA',
          'CellSave',
          'Streck',
          'Acid Citrate Dextrose (ACD)',
        ],
      },
      tumor_code: {
        enum: [
          'Non cancerous tissue',
          'Diffuse Large B-Cell Lymphoma (DLBCL)',
          'Lung Cancer (all types)',
          'Lung Adenocarcinoma',
          'Non-small Cell Lung Carcinoma (NSCLC)',
          'Colon Cancer (all types)',
          'Breast Cancer (all types)',
          'Cervical Cancer (all types)',
          'Anal Cancer (all types)',
          'Acute lymphoblastic leukemia (ALL)',
          'Acute myeloid leukemia (AML)',
          'Induction Failure AML (AML-IF)',
          'Neuroblastoma (NBL)',
          'Osteosarcoma (OS)',
          'Ewing sarcoma',
          'Wilms tumor (WT)',
          'Clear cell sarcoma of the kidney (CCSK)',
          'Rhabdoid tumor (kidney) (RT)',
          'CNS, ependymoma',
          'CNS, glioblastoma (GBM)',
          'CNS, rhabdoid tumor',
          'CNS, low grade glioma (LGG)',
          'CNS, medulloblastoma',
          'CNS, other',
          'NHL, anaplastic large cell lymphoma',
          'NHL, Burkitt lymphoma (BL)',
          'Rhabdomyosarcoma',
          'Soft tissue sarcoma, non-rhabdomyosarcoma',
          'Castration-Resistant Prostate Cancer (CRPC)',
          'Prostate Cancer',
          'Hepatocellular Carcinoma (HCC)',
        ],
        term: {
          description: 'Diagnostic tumor code of the tissue sample source.\n',
        },
        type: 'string',
      },
      tumor_code_id: {
        enum: [
          '00',
          '01',
          '02',
          '03',
          '04',
          '10',
          '20',
          '21',
          '30',
          '40',
          '41',
          '50',
          '51',
          '52',
          '60',
          '61',
          '62',
          '63',
          '64',
          '65',
          '70',
          '71',
          '80',
          '81',
        ],
        term: {
          description: 'BCR-defined id code for the tumor sample.\n',
        },
        type: 'string',
      },
      tumor_descriptor: {
        description: 'A description of the tumor from which the sample was derived.',
        enum: [
          'Metastatic',
          'Not Applicable',
          'Primary',
          'Recurrence',
          'Xenograft',
          'NOS',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text that describes the kind of disease present in the tumor specimen as related to a specific timepoint.\n',
          termDef: {
            cde_id: 3288124,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Tumor Tissue Disease Description Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=3288124&version=1.0',
          },
        },
      },
      type: {
        type: 'string',
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      wbc_count: {
        description: 'Count of the white blood cells in a sample.',
        type: 'integer',
      },
    },
    required: [
      'submitter_id',
      'cases',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Sample',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  sample_expectation: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'biospecimen',
    description: 'Any mutations or other values for a paricular sample that are expected to be observed through experimentation.\n',
    id: 'sample_expectation',
    links: [
      {
        backref: 'sample_expectations',
        label: 'expected_of',
        multiplicity: 'many_to_one',
        name: 'samples',
        required: true,
        target_type: 'sample',
      },
    ],
    namespace: 'http://bloodprofilingatlas.org/bpa/',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      expected_aa_change: {
        description: 'The amino acid reference, position, and alt combo (e.g. V600E).',
        type: 'string',
      },
      expected_allelic_fraction: {
        description: 'Relative frequency of the expected allele.',
        type: 'number',
      },
      expected_copy_number: {
        description: 'The expected copy number ratio at the expected locus.',
        type: 'number',
      },
      expected_mutation_alt: {
        description: 'Expected mutated bases/amino acids in the sample.',
        type: 'string',
      },
      expected_mutation_chromosome: {
        description: 'The chromosome on which the mutation should be located.',
        type: 'string',
      },
      expected_mutation_gene: {
        description: 'The gene in which the mutation is expected to occur.',
        type: 'string',
      },
      expected_mutation_position: {
        description: 'The amino acid or base position of the expected mutation.',
        type: 'string',
      },
      expected_mutation_reference: {
        description: 'Identifier for the bases/amino acids in the reference genome.',
        type: 'string',
      },
      expected_mutation_type: {
        description: 'The type of mutation expected in the sample. (e.g. missense, indel, etc)',
        type: 'string',
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      project_id: {
        type: 'string',
      },
      samples: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'sample_expectation',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'samples',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Sample Expectation',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  slide: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'biospecimen',
    description: 'A digital image, microscopic or otherwise, of any sample, portion, or sub-part thereof. (GDC)\n',
    id: 'slide',
    links: [
      {
        backref: 'slides',
        label: 'derived_from',
        multiplicity: 'many_to_many',
        name: 'samples',
        required: true,
        target_type: 'sample',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      number_proliferating_cells: {
        term: {
          description: 'Numeric value that represents the count of proliferating cells determined during pathologic review of the sample slide(s).\n',
          termDef: {
            cde_id: 5432636,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Pathology Review Slide Proliferating Cell Count',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432636&version=1.0',
          },
        },
        type: 'integer',
      },
      percent_eosinophil_infiltration: {
        term: {
          description: 'Numeric value to represent the percentage of infiltration by eosinophils in a tumor sample or specimen.\n',
          termDef: {
            cde_id: 2897700,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Specimen Eosinophilia Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897700&version=2.0',
          },
        },
        type: 'number',
      },
      percent_granulocyte_infiltration: {
        term: {
          description: 'Numeric value to represent the percentage of infiltration by granulocytes in a tumor sample or specimen.\n',
          termDef: {
            cde_id: 2897705,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Specimen Granulocyte Infiltration Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897705&version=2.0',
          },
        },
        type: 'number',
      },
      percent_inflam_infiltration: {
        term: {
          description: 'Numeric value to represent local response to cellular injury, marked by capillary dilatation, edema and leukocyte infiltration; clinically, inflammation is manifest by reddness, heat, pain, swelling and loss of function, with the need to heal damaged tissue.\n',
          termDef: {
            cde_id: 2897695,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Specimen Inflammation Change Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897695&version=1.0',
          },
        },
        type: 'number',
      },
      percent_lymphocyte_infiltration: {
        term: {
          description: 'Numeric value to represent the percentage of infiltration by lymphocytes in a solid tissue normal sample or specimen.\n',
          termDef: {
            cde_id: 2897710,
            cde_version: 2.0,
            source: 'caDSR',
            term: 'Specimen Lymphocyte Infiltration Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2897710&version=2.0',
          },
        },
        type: 'number',
      },
      percent_monocyte_infiltration: {
        term: {
          description: 'Numeric value to represent the percentage of monocyte infiltration in a sample or specimen.\n',
          termDef: {
            cde_id: 5455535,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Specimen Monocyte Infiltration Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5455535&version=1.0',
          },
        },
        type: 'number',
      },
      percent_necrosis: {
        term: {
          description: 'Numeric value to represent the percentage of cell death in a malignant tumor sample or specimen.\n',
          termDef: {
            cde_id: 2841237,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Malignant Neoplasm Necrosis Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841237&version=1.0',
          },
        },
        type: 'number',
      },
      percent_neutrophil_infiltration: {
        term: {
          description: 'Numeric value to represent the percentage of infiltration by neutrophils in a tumor sample or specimen.\n',
          termDef: {
            cde_id: 2841267,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Malignant Neoplasm Neutrophil Infiltration Percentage Cell Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841267&version=1.0',
          },
        },
        type: 'number',
      },
      percent_normal_cells: {
        term: {
          description: 'Numeric value to represent the percentage of normal cell content in a malignant tumor sample or specimen.\n',
          termDef: {
            cde_id: 2841233,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Malignant Neoplasm Normal Cell Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841233&version=1.0',
          },
        },
        type: 'number',
      },
      percent_stromal_cells: {
        term: {
          description: 'Numeric value to represent the percentage of reactive cells that are present in a malignant tumor sample or specimen but are not malignant such as fibroblasts, vascular structures, etc.\n',
          termDef: {
            cde_id: 2841241,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Malignant Neoplasm Stromal Cell Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841241&version=1.0',
          },
        },
        type: 'number',
      },
      percent_tumor_cells: {
        term: {
          description: 'Numeric value that represents the percentage of infiltration by granulocytes in a sample.\n',
          termDef: {
            cde_id: 5432686,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Specimen Tumor Cell Percentage Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5432686&version=1.0',
          },
        },
        type: 'number',
      },
      percent_tumor_nuclei: {
        term: {
          description: 'Numeric value to represent the percentage of tumor nuclei in a malignant neoplasm sample or specimen.\n',
          termDef: {
            cde_id: 2841225,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Malignant Neoplasm Neoplasm Nucleus Percentage Cell Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2841225&version=1.0',
          },
        },
        type: 'number',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      run_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      run_name: {
        description: 'Name, number, or other identifier given to this slide\'s run.',
        type: 'string',
      },
      samples: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      section_location: {
        term: {
          description: 'Tissue source of the slide.\n',
        },
        type: 'string',
      },
      slide_identifier: {
        description: 'Unique identifier given to the this slide.',
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        type: 'string',
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'samples',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Slide',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  slide_count: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'notation',
    description: 'Information pertaining to processed results obtained from slides; often in the form of countItems.\n',
    id: 'slide_count',
    links: [
      {
        backref: 'slide_counts',
        label: 'data_from',
        multiplicity: 'many_to_many',
        name: 'slides',
        required: true,
        target_type: 'slide',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      biomarker_signal: {
        description: 'Numeric quantification of the biomarker signal.',
        type: 'number',
      },
      cell_count: {
        description: 'Raw count of a particular cell type.',
        type: 'integer',
      },
      cell_identifier: {
        description: 'An alternative identifier for a given cell type.',
        type: 'string',
      },
      cell_type: {
        description: 'The type of cell being counted or measured.',
        type: 'string',
      },
      ck_signal: {
        description: 'Numeric quantification of the CK signal.',
        type: 'number',
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      project_id: {
        type: 'string',
      },
      slides: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'slide_count',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'slides',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
    ],
    title: 'Slide Count',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  slide_image: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'data_file',
    description: 'Data file containing image of a slide.\n',
    id: 'slide_image',
    links: [
      {
        backref: 'slide_images',
        label: 'data_from',
        multiplicity: 'one_to_one',
        name: 'slides',
        required: true,
        target_type: 'slide',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      cell_count: {
        description: 'Count of the cell type being imaged or otherwise analysed.',
        type: 'integer',
      },
      cell_type: {
        description: 'The type of cell being imaged or otherwised analysed.',
        type: 'string',
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      data_category: {
        enum: [
          'Biospecimen',
        ],
        term: {
          description: 'Broad categorization of the contents of the data file.\n',
        },
      },
      data_format: {
        term: {
          description: 'Format of the data files.\n',
        },
        type: 'string',
      },
      data_type: {
        term: {
          description: 'Specific content type of the data file.\n',
        },
        type: 'string',
      },
      error_type: {
        enum: [
          'file_size',
          'file_format',
          'md5sum',
        ],
        term: {
          description: 'Type of error for the data file object.\n',
        },
      },
      experimental_strategy: {
        description: 'Classification of the slide type with respect to its experimental use.',
        enum: [
          'Diagnostic Slide',
          'Tissue Slide',
        ],
      },
      file_name: {
        term: {
          description: 'The name (or part of a name) of a file (of any type).\n',
        },
        type: 'string',
      },
      file_size: {
        term: {
          description: 'The size of the data file (object) in bytes.\n',
        },
        type: 'number',
      },
      file_state: {
        default: 'registered',
        enum: [
          'registered',
          'uploading',
          'uploaded',
          'validating',
          'validated',
          'submitted',
          'processing',
          'processed',
          'released',
          'error',
        ],
        term: {
          description: 'The current state of the data file object.\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      md5sum: {
        term: {
          description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      slides: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      state_comment: {
        description: 'Optional comment about why the file is in the current state, mainly for invalid state.\n',
        type: 'string',
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'slide_image',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'file_name',
      'file_size',
      'md5sum',
      'data_category',
      'data_type',
      'data_format',
      'experimental_strategy',
      'slides',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
      'file_state',
      'error_type',
    ],
    title: 'Slide Image',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  submitted_aligned_reads: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'data_file',
    description: 'Data file containing aligned reads that are used as input to GDC workflows.\n',
    id: 'submitted_aligned_reads',
    links: [
      {
        backref: 'submitted_aligned_reads_files',
        label: 'data_from',
        multiplicity: 'one_to_many',
        name: 'read_groups',
        required: true,
        target_type: 'read_group',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      data_category: {
        enum: [
          'Sequencing Data',
          'Sequencing Reads',
          'Raw Sequencing Data',
        ],
        term: {
          description: 'Broad categorization of the contents of the data file.\n',
        },
      },
      data_format: {
        enum: [
          'BAM',
          'BED',
        ],
        term: {
          description: 'Format of the data files.\n',
        },
      },
      data_type: {
        enum: [
          'Aligned Reads',
          'Alignment Coordinates',
        ],
        term: {
          description: 'Specific content type of the data file.\n',
        },
      },
      error_type: {
        enum: [
          'file_size',
          'file_format',
          'md5sum',
        ],
        term: {
          description: 'Type of error for the data file object.\n',
        },
      },
      experimental_strategy: {
        enum: [
          'WGS',
          'WXS',
          'Low Pass WGS',
          'Validation',
          'RNA-Seq',
          'miRNA-Seq',
          'Total RNA-Seq',
        ],
        term: {
          description: 'The sequencing strategy used to generate the data file.\n',
        },
      },
      file_name: {
        term: {
          description: 'The name (or part of a name) of a file (of any type).\n',
        },
        type: 'string',
      },
      file_size: {
        term: {
          description: 'The size of the data file (object) in bytes.\n',
        },
        type: 'number',
      },
      file_state: {
        default: 'registered',
        enum: [
          'registered',
          'uploading',
          'uploaded',
          'validating',
          'validated',
          'submitted',
          'processing',
          'processed',
          'released',
          'error',
        ],
        term: {
          description: 'The current state of the data file object.\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      md5sum: {
        term: {
          description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      read_groups: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      state_comment: {
        description: 'Optional comment about why the file is in the current state, mainly for invalid state.\n',
        type: 'string',
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'submitted_aligned_reads',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'file_name',
      'file_size',
      'data_format',
      'md5sum',
      'data_category',
      'data_type',
      'experimental_strategy',
      'read_groups',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
      'file_state',
      'error_type',
    ],
    title: 'Submitted Aligned Reads',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  submitted_copy_number: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'data_file',
    description: 'Data file containing normalized copy number information from an aliquot.\n',
    id: 'submitted_copy_number',
    links: [
      {
        exclusive: true,
        required: true,
        subgroup: [
          {
            backref: 'submitted_copy_number_files',
            label: 'derived_from',
            multiplicity: 'one_to_one',
            name: 'aliquots',
            required: false,
            target_type: 'aliquot',
          },
          {
            backref: 'submitted_copy_number_files',
            label: 'derived_from',
            multiplicity: 'many_to_many',
            name: 'read_groups',
            required: false,
            target_type: 'read_group',
          },
        ],
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      aliquots: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      data_category: {
        term: {
          description: 'Broad categorization of the contents of the data file.\n',
        },
        type: 'string',
      },
      data_format: {
        term: {
          description: 'Format of the data files.\n',
        },
        type: 'string',
      },
      data_type: {
        term: {
          description: 'Specific content type of the data file.\n',
        },
        type: 'string',
      },
      error_type: {
        enum: [
          'file_size',
          'file_format',
          'md5sum',
        ],
        term: {
          description: 'Type of error for the data file object.\n',
        },
      },
      experimental_strategy: {
        term: {
          description: 'The sequencing strategy used to generate the data file.\n',
        },
        type: 'string',
      },
      file_name: {
        term: {
          description: 'The name (or part of a name) of a file (of any type).\n',
        },
        type: 'string',
      },
      file_size: {
        term: {
          description: 'The size of the data file (object) in bytes.\n',
        },
        type: 'number',
      },
      file_state: {
        default: 'registered',
        enum: [
          'registered',
          'uploading',
          'uploaded',
          'validating',
          'validated',
          'submitted',
          'processing',
          'processed',
          'released',
          'error',
        ],
        term: {
          description: 'The current state of the data file object.\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      md5sum: {
        term: {
          description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      read_groups: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      state_comment: {
        description: 'Optional comment about why the file is in the current state, mainly for invalid state.\n',
        type: 'string',
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'submitted_copy_number',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'file_name',
      'file_size',
      'data_format',
      'md5sum',
      'data_category',
      'data_type',
      'experimental_strategy',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
      'file_state',
      'error_type',
    ],
    title: 'Submitted Copy Number',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  submitted_somatic_mutation: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'data_file',
    description: 'Data file containing somatic mutation calls from a read group.\n',
    id: 'submitted_somatic_mutation',
    links: [
      {
        backref: 'submitted_somatic_mutations',
        label: 'derived_from',
        multiplicity: 'many_to_many',
        name: 'read_groups',
        required: true,
        target_type: 'read_group',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      data_category: {
        term: {
          description: 'Broad categorization of the contents of the data file.\n',
        },
        type: 'string',
      },
      data_format: {
        term: {
          description: 'Format of the data files.\n',
        },
        type: 'string',
      },
      data_type: {
        term: {
          description: 'Specific content type of the data file.\n',
        },
        type: 'string',
      },
      error_type: {
        enum: [
          'file_size',
          'file_format',
          'md5sum',
        ],
        term: {
          description: 'Type of error for the data file object.\n',
        },
      },
      experimental_strategy: {
        term: {
          description: 'The sequencing strategy used to generate the data file.\n',
        },
        type: 'string',
      },
      file_name: {
        term: {
          description: 'The name (or part of a name) of a file (of any type).\n',
        },
        type: 'string',
      },
      file_size: {
        term: {
          description: 'The size of the data file (object) in bytes.\n',
        },
        type: 'number',
      },
      file_state: {
        default: 'registered',
        enum: [
          'registered',
          'uploading',
          'uploaded',
          'validating',
          'validated',
          'submitted',
          'processing',
          'processed',
          'released',
          'error',
        ],
        term: {
          description: 'The current state of the data file object.\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      md5sum: {
        term: {
          description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      read_groups: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      state_comment: {
        description: 'Optional comment about why the file is in the current state, mainly for invalid state.\n',
        type: 'string',
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'submitted_somatic_mutation',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'file_name',
      'file_size',
      'data_format',
      'md5sum',
      'data_category',
      'data_type',
      'experimental_strategy',
      'read_groups',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
      'file_state',
      'error_type',
    ],
    title: 'Submitted Somatic Mutation',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  submitted_unaligned_reads: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'data_file',
    description: 'Data file containing unaligned reads that have not been GDC Harmonized.',
    id: 'submitted_unaligned_reads',
    links: [
      {
        backref: 'submitted_unaligned_reads_files',
        label: 'data_from',
        multiplicity: 'many_to_one',
        name: 'read_groups',
        required: true,
        target_type: 'read_group',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      data_category: {
        enum: [
          'Sequencing Data',
          'Sequencing Reads',
          'Raw Sequencing Data',
        ],
        term: {
          description: 'Broad categorization of the contents of the data file.\n',
        },
      },
      data_format: {
        enum: [
          'BAM',
          'FASTQ',
        ],
        term: {
          description: 'Format of the data files.\n',
        },
      },
      data_type: {
        enum: [
          'Unaligned Reads',
        ],
        term: {
          description: 'Specific content type of the data file.\n',
        },
      },
      error_type: {
        enum: [
          'file_size',
          'file_format',
          'md5sum',
        ],
        term: {
          description: 'Type of error for the data file object.\n',
        },
      },
      experimental_strategy: {
        enum: [
          'WGS',
          'WXS',
          'Low Pass WGS',
          'Validation',
          'RNA-Seq',
          'miRNA-Seq',
          'Total RNA-Seq',
        ],
        term: {
          description: 'The sequencing strategy used to generate the data file.\n',
        },
      },
      file_name: {
        term: {
          description: 'The name (or part of a name) of a file (of any type).\n',
        },
        type: 'string',
      },
      file_size: {
        term: {
          description: 'The size of the data file (object) in bytes.\n',
        },
        type: 'number',
      },
      file_state: {
        default: 'registered',
        enum: [
          'registered',
          'uploading',
          'uploaded',
          'validating',
          'validated',
          'submitted',
          'processing',
          'processed',
          'released',
          'error',
        ],
        term: {
          description: 'The current state of the data file object.\n',
        },
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      md5sum: {
        term: {
          description: 'The 128-bit hash value expressed as a 32 digit hexadecimal number used as a file\'s digital fingerprint.\n',
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      read_groups: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      state_comment: {
        description: 'Optional comment about why the file is in the current state, mainly for invalid state.\n',
        type: 'string',
      },
      submitter_id: {
        description: 'The file ID assigned by the submitter.',
        type: [
          'string',
          'null',
        ],
      },
      type: {
        enum: [
          'submitted_unaligned_reads',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    required: [
      'submitter_id',
      'file_name',
      'file_size',
      'md5sum',
      'data_category',
      'data_type',
      'data_format',
      'experimental_strategy',
      'read_groups',
    ],
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'created_datetime',
      'updated_datetime',
      'state',
      'file_state',
      'error_type',
    ],
    title: 'Submitted Unaligned Reads',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
  treatment: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    category: 'clinical',
    description: 'Record of the administration and intention of therapeutic agents provided to a patient to alter the course of a pathologic process.\n',
    id: 'treatment',
    links: [
      {
        backref: 'treatments',
        label: 'describes',
        multiplicity: 'many_to_one',
        name: 'diagnoses',
        required: true,
        target_type: 'diagnosis',
      },
    ],
    namespace: 'http://gdc.nci.nih.gov',
    program: '*',
    project: '*',
    properties: {
      created_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
      days_to_treatment: {
        term: {
          description: 'Number of days from date of initial pathologic diagnosis that treatment began.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: null,
            term: 'Days to Treatment Start',
            term_url: null,
          },
        },
        type: 'number',
      },
      days_to_treatment_end: {
        term: {
          description: 'Time interval from the date of the initial pathologic diagnosis to the date of treatment end, represented as a calculated number of days.\n',
          termDef: {
            cde_id: 5102431,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Treatment End Subtract First Pathologic Diagnosis Day Calculation Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5102431&version=1.0',
          },
        },
        type: 'number',
      },
      days_to_treatment_start: {
        term: {
          description: 'Time interval from the date of the initial pathologic diagnosis to the start of treatment, represented as a calculated number of days.\n',
          termDef: {
            cde_id: 5102411,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Treatment Start Subtract First Pathologic Diagnosis Time Day Calculation Value',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5102411&version=1.0',
          },
        },
        type: 'number',
      },
      diagnoses: {
        anyOf: [
          {
            items: {
              additionalProperties: true,
              maxItems: 1,
              minItems: 1,
              properties: {
                id: {
                  pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                  term: {
                    description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                    termDef: {
                      cde_id: 'C54100',
                      cde_version: null,
                      source: 'NCIt',
                      term: 'Universally Unique Identifier',
                      term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                    },
                  },
                  type: 'string',
                },
                submitter_id: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          {
            additionalProperties: true,
            properties: {
              id: {
                pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                term: {
                  description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
                  termDef: {
                    cde_id: 'C54100',
                    cde_version: null,
                    source: 'NCIt',
                    term: 'Universally Unique Identifier',
                    term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
                  },
                },
                type: 'string',
              },
              submitter_id: {
                type: 'string',
              },
            },
            type: 'object',
          },
        ],
      },
      id: {
        pattern: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
        systemAlias: 'node_id',
        term: {
          description: 'A 128-bit identifier. Depending on the mechanism used to generate it, it is either guaranteed to be different from all other UUIDs/GUIDs generated until 3400 AD or extremely likely to be different. Its relatively small size lends itself well to sorting, ordering, and hashing of all sorts, storing in databases, simple allocation, and ease of programming in general.\n',
          termDef: {
            cde_id: 'C54100',
            cde_version: null,
            source: 'NCIt',
            term: 'Universally Unique Identifier',
            term_url: 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=16.02d&ns=NCI_Thesaurus&code=C54100',
          },
        },
        type: 'string',
      },
      project_id: {
        term: {
          description: 'Unique ID for any specific defined piece of work that is undertaken or attempted to meet a single requirement.\n',
        },
        type: 'string',
      },
      state: {
        default: 'validated',
        downloadable: [
          'uploaded',
          'md5summed',
          'validating',
          'validated',
          'error',
          'invalid',
          'released',
        ],
        oneOf: [
          {
            enum: [
              'uploading',
              'uploaded',
              'md5summing',
              'md5summed',
              'validating',
              'error',
              'invalid',
              'suppressed',
              'redacted',
              'live',
            ],
          },
          {
            enum: [
              'validated',
              'submitted',
              'released',
            ],
          },
        ],
        public: [
          'live',
        ],
        term: {
          description: 'The current state of the object.\n',
        },
      },
      submitter_id: {
        type: [
          'string',
          'null',
        ],
      },
      therapeutic_agents: {
        term: {
          description: 'Text identification of the individual agent(s) used as part of a prior treatment regimen.\n',
          termDef: {
            cde_id: 2975232,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Prior Therapy Regimen Text',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2975232&version=1.0',
          },
        },
        type: 'string',
      },
      treatment_anatomic_site: {
        enum: [
          'Abdomen, total',
          'Arm',
          'Ascites',
          'Axillary',
          'Body, total',
          'Bone',
          'Bone, non-spine',
          'Brain, focal',
          'Brain, whole',
          'Brain-C2',
          'Breast',
          'Cervical',
          'Chest Wall',
          'Effusion',
          'Epitrochlear',
          'Eye',
          'Femoral',
          'Gastrointestinal, Colon',
          'Gastrointestinal, Gallbladder',
          'Gastrointestinal, Intestine',
          'Gastrointestinal, Liver',
          'Gastrointestinal, NOS',
          'Gastrointestinal, Pancreas',
          'Gastrointestinal, Rectum',
          'Gastrointestinal, Stomach',
          'Genitourinary, Bladder',
          'Genitourinary, Kidney',
          'Genitourinary, NOS',
          'Genitourinary, Prostate',
          'Genitourinary, Prostate and Seminal Vesicles',
          'Head',
          'Head, Face, or Neck',
          'Hilar',
          'Iliac-common',
          'Iliac-external',
          'Inguinal',
          'Internal Mammary Nodes',
          'Leg',
          'Lung',
          'Lymph Nodes',
          'Lymph node, distant (specify site)',
          'Lymph node, locoregional (specify site)',
          'Mantle',
          'Mediastinal',
          'Mediastinum',
          'Mesenteric',
          'Occipital',
          'Other',
          'Paraaortic',
          'Parametrium',
          'Parotid',
          'Pelvis',
          'Popliteal',
          'Primary tumor site',
          'Prostate',
          'Prostate Bed',
          'Prostate, Seminal Vesicles and Lymph Nodes',
          'Rectum',
          'Retroperitoneal',
          'Sacrum',
          'Seminal vesicles',
          'Shoulder',
          'Skin, lower extremity, local',
          'Skin, total',
          'Skin, trunk, local',
          'Skin, upper extremity, local',
          'Spine',
          'Spine, whole',
          'Splenic',
          'Submandibular',
          'Supraclavicular',
          'Supraclavicular/Axillary Level 3',
          'Thorax',
          'Trunk',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'The anatomic site or field targeted by a treatment regimen or single agent therapy.\n',
          termDef: {
            cde_id: null,
            cde_version: null,
            source: null,
            term: 'Treatment Anatomic Site',
            term_url: null,
          },
        },
      },
      treatment_intent_type: {
        term: {
          description: 'Text term to identify the reason for the administration of a treatment regimen. [Manually-curated]\n',
          termDef: {
            cde_id: 2793511,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Treatment Regimen Intent Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=2793511&version=1.0',
          },
        },
        type: 'string',
      },
      treatment_or_therapy: {
        enum: [
          'yes',
          'no',
          'unknown',
          'not reported',
        ],
        term: {
          description: 'A yes/no/unknown/not applicable indicator related to the administration of therapeutic agents received before the body specimen was collected.\n',
          termDef: {
            cde_id: 4231463,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Therapeutic Procedure Prior Specimen Collection Administered Yes No Unknown Not Applicable Indicator',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=4231463&version=1.0',
          },
        },
      },
      treatment_outcome: {
        enum: [
          'Complete Response',
          'Partial Response',
          'Treatment Ongoing',
          'Treatment Stopped Due to Toxicity',
          'Unknown',
        ],
        term: {
          description: 'Text term that describes the patient\u00bfs final outcome after the treatment was administered.\n',
          termDef: {
            cde_id: 5102383,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Treatment Outcome Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5102383&version=1.0',
          },
        },
      },
      treatment_type: {
        enum: [
          'Ablation',
          'Chemotherapy',
          'Concurrent Chemoradiation',
          'Cryoablation',
          'Embolization',
          'Hormone Therapy',
          'Internal Radiation',
          'Immunotherapy (Including Vaccines)',
          'Other',
          'Pharmaceutical Therapy',
          'Radiation Therapy',
          'Stem Cell Treatment',
          'Surgery',
          'Targeted Molecular Therapy',
          'Unknown',
          'Not Reported',
          'Not Allowed To Collect',
        ],
        term: {
          description: 'Text term that describes the kind of treatment administered.\n',
          termDef: {
            cde_id: 5102381,
            cde_version: 1.0,
            source: 'caDSR',
            term: 'Treatment Method Type',
            term_url: 'https://cdebrowser.nci.nih.gov/CDEBrowser/search?elementDetails=9&FirstTimer=0&PageId=ElementDetailsGroup&publicId=5102381&version=1.0',
          },
        },
      },
      type: {
        enum: [
          'treatment',
        ],
      },
      updated_datetime: {
        oneOf: [
          {
            format: 'date-time',
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        term: {
          description: 'A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n',
        },
      },
    },
    submittable: true,
    systemProperties: [
      'id',
      'project_id',
      'state',
      'created_datetime',
      'updated_datetime',
    ],
    title: 'Treatment',
    type: 'object',
    uniqueKeys: [
      [
        'id',
      ],
      [
        'project_id',
        'submitter_id',
      ],
    ],
    validators: null,
  },
};

export default dict;
