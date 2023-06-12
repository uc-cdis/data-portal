const MockedSuccessJSON = {
  name: 'gwas-workflow-2139489957',
  wf_name: 'TestJDRMar29-1130AM',
  arguments: {
    parameters: [
      { name: 'n_pcs', value: '3' },
      {
        name: 'variables',
        value:
          '[\n{\n"variable_type": "concept",\n"concept_id": 2000000873,\n"concept_name": "Attribute8"\n}\n]',
      },
      { name: 'out_prefix', default: 'genesis_vadc', value: '1680107488624' },
      {
        name: 'outcome',
        value:
          '{\n"variable_type": "concept",\n"concept_id": 2000000873,\n"concept_name": "Attribute8"\n}',
      },
      { name: 'hare_population', value: 'non-Hispanic Black' },
      { name: 'hare_concept_id', default: '2000007027', value: '2000007027' },
      { name: 'maf_threshold', value: '0.01' },
      { name: 'imputation_score_cutoff', value: '0.3' },
      { name: 'template_version', value: 'gwas-template' },
      { name: 'source_id', value: '2' },
      { name: 'source_population_cohort', value: '9' },
      { name: 'workflow_name', value: 'TestJDRMar29-1130AM' },
      {
        name: 'genome_build',
        default: 'hg19',
        value: 'hg19',
        enum: ['hg38', 'hg19'],
      },
      { name: 'pca_file', value: '/commons-data/pcs.RData' },
      {
        name: 'relatedness_matrix_file',
        value: '/commons-data/KINGmatDeg3.RData',
      },
      { name: 'n_segments', value: '0' },
      { name: 'segment_length', default: '2000', value: '2000' },
      { name: 'variant_block_size', default: '1024', value: '100' },
      { name: 'mac_threshold', value: '0' },
      {
        name: 'gds_files',
        value:
          '["/commons-data/gds/chr1.merged.vcf.gz.gds", "/commons-data/gds/chr2.merged.vcf.gz.gds", "/commons-data/gds/chr3.merged.vcf.gz.gds", "/commons-data/gds/chr4.merged.vcf.gz.gds", "/commons-data/gds/chr5.merged.vcf.gz.gds", "/commons-data/gds/chr6.merged.vcf.gz.gds", "/commons-data/gds/chr7.merged.vcf.gz.gds", "/commons-data/gds/chr8.merged.vcf.gz.gds", "/commons-data/gds/chr9.merged.vcf.gz.gds", "/commons-data/gds/chr10.merged.vcf.gz.gds", "/commons-data/gds/chr11.merged.vcf.gz.gds", "/commons-data/gds/chr12.merged.vcf.gz.gds", "/commons-data/gds/chr13.merged.vcf.gz.gds", "/commons-data/gds/chr14.merged.vcf.gz.gds", "/commons-data/gds/chr15.merged.vcf.gz.gds", "/commons-data/gds/chr16.merged.vcf.gz.gds", "/commons-data/gds/chr17.merged.vcf.gz.gds", "/commons-data/gds/chr18.merged.vcf.gz.gds", "/commons-data/gds/chr19.merged.vcf.gz.gds", "/commons-data/gds/chr20.merged.vcf.gz.gds", "/commons-data/gds/chr21.merged.vcf.gz.gds", "/commons-data/gds/chr22.merged.vcf.gz.gds"]',
      },
      { name: 'internal_api_env', default: 'default', value: 'qa-mickey' },
    ],
  },
  phase: 'Succeeded',
  progress: '9/9',
  submittedAt: '2023-03-29T16:31:28Z',
  startedAt: '2023-03-29T16:31:28Z',
  finishedAt: '2023-03-29T16:44:39Z',
  outputs: {
    parameters: [
      {
        name: 'gwas_archive_index',
        value:
          '{\n    "baseid": "656910a9-3e97-4ad8-8e7d-da9a67193d41",\n    "did": "c9421423-3650-4748-8573-7e19543f10e0",\n    "rev": "409f7d47"\n}',
      },
      {
        name: 'manhattan_plot_index',
        value:
          '{\n    "baseid": "e6283201-0e02-483e-980a-9d321d05ebc3",\n    "did": "733993c2-3238-4779-8b4b-a3d744dadba0",\n    "rev": "102de8d6"\n}',
      },
      {
        name: 'attrition_json_index',
        value:
          '{\n    "baseid": "e6283201-0e02-483e-980a-9d321d05ebc4",\n    "did": "733993c2-3238-4779-8b4b-a3d744dadba1",\n    "rev": "102de8d6"\n}',
      },
    ],
  },
};
export default MockedSuccessJSON;
