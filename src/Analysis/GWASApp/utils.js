const marinerRequestBody = {
  demo: {
    input: {
      genotype_cutoff: '0.2',
      phenotype_file: {
        class: 'File',
        location: 'USER/hapmap-ceu-all.simulated.pheno',
      },
      threads: '2',
      bfile: {
        class: 'File',
        location: 'USER/hapmap-ceu-all.bed',
      },
      memory: '4000',
      sample_cutoff: '0.04',
      maf_cutoff: '0.05',
      output_basename: 'hapmap_test_run',
    },
    manifest: [],
    workflow: {
      cwlVersion: 'v1.0',
      $graph: [
        {
          cwlVersion: 'v1.0',
          inputs: [
            {
              inputBinding: {
                prefix: '--maf',
              },
              type: [
                'float',
                'null',
              ],
              id: '#plink_filter/maf_cutoff',
            },
            {
              default: true,
              inputBinding: {
                prefix: '--make-bed',
              },
              type: 'boolean',
              id: '#plink_filter/make_bed',
            },
            {
              inputBinding: {
                prefix: '--out',
              },
              type: 'string',
              id: '#plink_filter/out_path_pre',
            },
            {
              doc: 'Memory in MiB',
              inputBinding: {
                prefix: '--memory',
              },
              type: 'long',
              id: '#plink_filter/memory',
            },
            {
              default: 4,
              inputBinding: {
                prefix: '--threads',
              },
              type: 'int',
              id: '#plink_filter/threads',
            },
            {
              secondaryFiles: [
                '^.bim',
                '^.fam',
              ],
              inputBinding: {
                prefix: '--bfile',
                valueFrom: '$(self.dirname + "/" + self.nameroot)',
              },
              type: 'File',
              id: '#plink_filter/bfile',
            },
            {
              inputBinding: {
                prefix: '--mind',
              },
              type: [
                'float',
                'null',
              ],
              id: '#plink_filter/sample_cutoff',
            },
            {
              inputBinding: {
                prefix: '--geno',
              },
              type: [
                'float',
                'null',
              ],
              id: '#plink_filter/geno_cutoff',
            },
          ],
          requirements: [
            {
              dockerPull: 'quay.io/cdis/plink:v2.00a2.3',
              class: 'DockerRequirement',
            },
            {
              class: 'InlineJavascriptRequirement',
            },
            {
              coresMin: 2,
              coresMax: 2,
              ramMin: 4000,
              ramMax: 4000,
              class: 'ResourceRequirement',
            },
          ],
          outputs: [
            {
              secondaryFiles: [
                '^.bim',
                '^.fam',
              ],
              outputBinding: {
                glob: '$(inputs.out_path_pre + \'.bed\')',
              },
              type: 'File',
              id: '#plink_filter/filtered_bfile',
            },
          ],
          baseCommand: ['/opt/plink2'],
          class: 'CommandLineTool',
          id: '#plink_filter',
        },
        {
          cwlVersion: 'v1.0',
          inputs: [
            {
              doc: 'Memory in MiB',
              inputBinding: {
                prefix: '--memory',
              },
              type: 'long',
              id: '#get_missing_info/memory',
            },
            {
              default: 4,
              inputBinding: {
                prefix: '--threads',
              },
              type: 'int',
              id: '#get_missing_info/threads',
            },
            {
              secondaryFiles: [
                '^.bim',
                '^.fam',
              ],
              inputBinding: {
                prefix: '--bfile',
                valueFrom: '$(self.dirname + "/" + self.nameroot)',
              },
              type: 'File',
              id: '#get_missing_info/bfile',
            },
            {
              inputBinding: {
                prefix: '--out',
              },
              type: 'string',
              id: '#get_missing_info/out_path_pre',
            },
          ],
          requirements: [
            {
              dockerPull: 'quay.io/cdis/plink:v2.00a2.3',
              class: 'DockerRequirement',
            },
            {
              class: 'InlineJavascriptRequirement',
            },
            {
              coresMin: 2,
              coresMax: 2,
              ramMin: 4000,
              ramMax: 4000,
              class: 'ResourceRequirement',
            },
          ],
          outputs: [
            {
              outputBinding: {
                glob: '$(inputs.out_path_pre + \'.vmiss\')',
              },
              type: 'File',
              id: '#get_missing_info/v_missing_info',
            },
            {
              outputBinding: {
                glob: '$(inputs.out_path_pre + \'.smiss\')',
              },
              type: 'File',
              id: '#get_missing_info/s_missing_info',
            },
          ],
          baseCommand: [
            '/opt/plink2',
            '--missing',
          ],
          class: 'CommandLineTool',
          id: '#get_missing_info',
        },
        {
          cwlVersion: 'v1.0',
          inputs: [
            {
              doc: 'Memory in MiB',
              inputBinding: {
                prefix: '--memory',
              },
              type: 'long',
              id: '#plink_glm/memory',
            },
            {
              default: 4,
              inputBinding: {
                prefix: '--threads',
              },
              type: 'int',
              id: '#plink_glm/threads',
            },
            {
              secondaryFiles: [
                '^.bim',
                '^.fam',
              ],
              inputBinding: {
                prefix: '--bfile',
                valueFrom: '$(self.dirname + "/" + self.nameroot)',
              },
              type: 'File',
              id: '#plink_glm/bfile',
            },
            {
              inputBinding: {
                prefix: '--glm',
              },
              type: {
                items: 'string',
                type: 'array',
              },
              id: '#plink_glm/glm',
            },
            {
              inputBinding: {
                prefix: '--covar',
              },
              type: [
                'File',
                'null',
              ],
              id: '#plink_glm/covar',
            },
            {
              inputBinding: {
                prefix: '--pheno',
              },
              type: [
                'File',
                'null',
              ],
              id: '#plink_glm/pheno',
            },
            {
              inputBinding: {
                prefix: '--out',
              },
              type: 'string',
              id: '#plink_glm/out_path_pre',
            },
          ],
          requirements: [
            {
              dockerPull: 'quay.io/cdis/plink:v2.00a2.3',
              class: 'DockerRequirement',
            },
            {
              class: 'InlineJavascriptRequirement',
            },
            {
              coresMin: 2,
              coresMax: 2,
              ramMin: 4000,
              ramMax: 4000,
              class: 'ResourceRequirement',
            },
          ],
          outputs: [
            {
              outputBinding: {
                glob: '$(inputs.out_path_pre + \'.*.glm.linear\')',
              },
              type: {
                items: 'File',
                type: 'array',
              },
              id: '#plink_glm/glm_linear_results',
            },
            {
              outputBinding: {
                glob: '$(inputs.out_path_pre + \'.*.glm.logistic\')',
              },
              type: {
                items: 'File',
                type: 'array',
              },
              id: '#plink_glm/glm_logistic_results',
            },
          ],
          baseCommand: ['/opt/plink2'],
          class: 'CommandLineTool',
          id: '#plink_glm',
        },
        {
          cwlVersion: 'v1.0',
          inputs: [
            {
              doc: 'Memory in MiB',
              inputBinding: {
                position: 0,
                prefix: '--memory',
              },
              type: 'long',
              id: '#plink_adjust/memory',
            },
            {
              default: 4,
              inputBinding: {
                position: 1,
                prefix: '--threads',
              },
              type: 'int',
              id: '#plink_adjust/threads',
            },
            {
              inputBinding: {
                position: 2,
                prefix: '--adjust-file',
              },
              type: 'File',
              id: '#plink_adjust/adjust_file',
            },
            {
              inputBinding: {
                position: 3,
                prefix: 'test=',
                separate: false,
              },
              type: 'string',
              id: '#plink_adjust/test_name',
            },
            {
              inputBinding: {
                position: 4,
                prefix: '--out',
              },
              type: 'string',
              id: '#plink_adjust/out_path_pre',
            },
          ],
          requirements: [
            {
              dockerPull: 'quay.io/cdis/plink:v2.00a2.3',
              class: 'DockerRequirement',
            },
            {
              class: 'InlineJavascriptRequirement',
            },
            {
              coresMin: 2,
              coresMax: 2,
              ramMin: 4000,
              ramMax: 4000,
              class: 'ResourceRequirement',
            },
          ],
          outputs: [
            {
              outputBinding: {
                glob: '$(inputs.out_path_pre + \'.adjusted\')',
              },
              type: 'File',
              id: '#plink_adjust/adjusted_results',
            },
          ],
          baseCommand: ['/opt/plink2'],
          class: 'CommandLineTool',
          id: '#plink_adjust',
        },
        {
          cwlVersion: 'v1.0',
          inputs: [
            {
              type: 'float',
              id: '#main/genotype_cutoff',
            },
            {
              type: 'float',
              id: '#main/maf_cutoff',
            },
            {
              type: 'float',
              id: '#main/sample_cutoff',
            },
            {
              type: 'string',
              id: '#main/output_basename',
            },
            {
              type: 'int',
              id: '#main/threads',
            },
            {
              type: 'long',
              id: '#main/memory',
            },
            {
              type: 'File',
              id: '#main/phenotype_file',
            },
            {
              secondaryFiles: [
                '^.bim',
                '^.fam',
              ],
              type: 'File',
              id: '#main/bfile',
            },
          ],
          requirements: [
            {
              class: 'InlineJavascriptRequirement',
            },
            {
              class: 'StepInputExpressionRequirement',
            },
            {
              class: 'ScatterFeatureRequirement',
            },
          ],
          outputs: [
            {
              type: {
                items: 'File',
                type: 'array',
              },
              outputSource: '#main/do_association/glm_linear_results',
              id: '#main/raw_association_results_linear',
            },
            {
              type: {
                items: 'File',
                type: 'array',
              },
              outputSource: '#main/do_association/glm_logistic_results',
              id: '#main/raw_association_results_logistic',
            },
            {
              type: {
                items: 'File',
                type: 'array',
              },
              outputSource: '#main/do_adjust_linear/adjusted_results',
              id: '#main/adjusted_association_results_linear',
            },
            {
              type: {
                items: 'File',
                type: 'array',
              },
              outputSource: '#main/do_adjust_logistic/adjusted_results',
              id: '#main/adjusted_association_results_logistic',
            },
            {
              type: 'File',
              outputSource: '#main/filter_samples/filtered_bfile',
              id: '#main/filtered_bfile',
            },
            {
              type: 'File',
              outputSource: '#main/get_missing_metrics/v_missing_info',
              id: '#main/filtered_variant_miss_metrics',
            },
            {
              type: 'File',
              outputSource: '#main/get_missing_metrics/s_missing_info',
              id: '#main/filtered_sample_miss_metrics',
            },
          ],
          id: '#main',
          steps: [
            {
              out: [
                '#main/filter_samples/filtered_bfile',
              ],
              run: '#plink_filter',
              id: '#main/filter_samples',
              in: [
                {
                  source: '#main/memory',
                  id: '#main/filter_samples/memory',
                },
                {
                  source: '#main/threads',
                  id: '#main/filter_samples/threads',
                },
                {
                  source: '#main/filter_genotypes/filtered_bfile',
                  id: '#main/filter_samples/bfile',
                },
                {
                  source: '#main/sample_cutoff',
                  id: '#main/filter_samples/sample_cutoff',
                },
                {
                  source: '#main/output_basename',
                  valueFrom: '$(self + \'.filter_geno_samp\')',
                  id: '#main/filter_samples/out_path_pre',
                },
              ],
            },
            {
              out: [
                '#main/get_missing_metrics/v_missing_info',
                '#main/get_missing_metrics/s_missing_info',
              ],
              run: '#get_missing_info',
              id: '#main/get_missing_metrics',
              in: [
                {
                  source: '#main/memory',
                  id: '#main/get_missing_metrics/memory',
                },
                {
                  source: '#main/threads',
                  id: '#main/get_missing_metrics/threads',
                },
                {
                  source: '#main/filter_samples/filtered_bfile',
                  id: '#main/get_missing_metrics/bfile',
                },
                {
                  source: '#main/output_basename',
                  valueFrom: '$(self + \'.filter_geno_samp\')',
                  id: '#main/get_missing_metrics/out_path_pre',
                },
              ],
            },
            {
              out: [
                '#main/do_association/glm_linear_results',
                '#main/do_association/glm_logistic_results',
              ],
              run: '#plink_glm',
              id: '#main/do_association',
              in: [
                {
                  source: '#main/threads',
                  id: '#main/do_association/threads',
                },
                {
                  source: '#main/filter_samples/filtered_bfile',
                  id: '#main/do_association/bfile',
                },
                {
                  default: [
                    'sex',
                    'hide-covar',
                  ],
                  id: '#main/do_association/glm',
                },
                {
                  source: '#main/phenotype_file',
                  id: '#main/do_association/pheno',
                },
                {
                  source: '#main/output_basename',
                  valueFrom: '$(self + \'.filter_geno_samp\')',
                  id: '#main/do_association/out_path_pre',
                },
                {
                  source: '#main/memory',
                  id: '#main/do_association/memory',
                },
              ],
            },
            {
              run: '#plink_adjust',
              id: '#main/do_adjust_linear',
              in: [
                {
                  source: '#main/do_association/glm_linear_results',
                  valueFrom: '$(self.basename)',
                  id: '#main/do_adjust_linear/out_path_pre',
                },
                {
                  source: '#main/memory',
                  id: '#main/do_adjust_linear/memory',
                },
                {
                  source: '#main/threads',
                  id: '#main/do_adjust_linear/threads',
                },
                {
                  source: '#main/do_association/glm_linear_results',
                  id: '#main/do_adjust_linear/adjust_file',
                },
                {
                  default: 'ADD',
                  id: '#main/do_adjust_linear/test_name',
                },
              ],
              scatterMethod: 'dotproduct',
              scatter: [
                '#main/do_adjust_linear/adjust_file',
                '#main/do_adjust_linear/out_path_pre',
              ],
              out: [
                '#main/do_adjust_linear/adjusted_results',
              ],
            },
            {
              run: '#plink_adjust',
              id: '#main/do_adjust_logistic',
              in: [
                {
                  source: '#main/memory',
                  id: '#main/do_adjust_logistic/memory',
                },
                {
                  source: '#main/threads',
                  id: '#main/do_adjust_logistic/threads',
                },
                {
                  source: '#main/do_association/glm_logistic_results',
                  id: '#main/do_adjust_logistic/adjust_file',
                },
                {
                  default: 'ADD',
                  id: '#main/do_adjust_logistic/test_name',
                },
                {
                  source: '#main/do_association/glm_logistic_results',
                  valueFrom: '$(self.basename)',
                  id: '#main/do_adjust_logistic/out_path_pre',
                },
              ],
              scatterMethod: 'dotproduct',
              scatter: [
                '#main/do_adjust_logistic/adjust_file',
                '#main/do_adjust_logistic/out_path_pre',
              ],
              out: [
                '#main/do_adjust_logistic/adjusted_results',
              ],
            },
            {
              out: [
                '#main/filter_genotypes/filtered_bfile',
              ],
              run: '#plink_filter',
              id: '#main/filter_genotypes',
              in: [
                {
                  source: '#main/output_basename',
                  valueFrom: '$(self + \'.filter_geno\')',
                  id: '#main/filter_genotypes/out_path_pre',
                },
                {
                  source: '#main/memory',
                  id: '#main/filter_genotypes/memory',
                },
                {
                  source: '#main/threads',
                  id: '#main/filter_genotypes/threads',
                },
                {
                  source: '#main/bfile',
                  id: '#main/filter_genotypes/bfile',
                },
                {
                  source: '#main/maf_cutoff',
                  id: '#main/filter_genotypes/maf_cutoff',
                },
                {
                  source: '#main/genotype_cutoff',
                  id: '#main/filter_genotypes/geno_cutoff',
                },
              ],
            },
          ],
          class: 'Workflow',
        },
      ],
    },
  },
};

export default marinerRequestBody;
