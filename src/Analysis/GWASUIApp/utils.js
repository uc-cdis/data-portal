export const argoWrapperBody = {
  "name": "argo-wrapper-workflow-3052773085",
  "arguments": {
    "parameters": [
      {
        "name": "pheno_csv_key",
        "value": "test_val"
      },
      {
        "name": "n_pcs",
        "default": "0",
        "value": "5"
      },
      {
        "name": "covariates",
        "value": "gender age Hare"
      },
      {
        "name": "out_prefix",
        "default": "genesis_vadc",
        "value": "test_out_prefix"
      },
      {
        "name": "outcome",
        "value": "test_outcome"
      },
      {
        "name": "outcome_is_binary",
        "default": "FALSE",
        "value": "TRUE",
        "enum": [
          "TRUE",
          "FALSE"
        ]
      },
      {
        "name": "pca_file",
        "value": "/commons-data/pcs.RData"
      },
      {
        "name": "relatedness_matrix_file",
        "value": "/commons-data/KINGmatDeg3.RData"
      },
      {
        "name": "genome_build",
        "default": "hg19",
        "value": "hg19",
        "enum": [
          "hg38",
          "hg19"
        ]
      },
      {
        "name": "n_segments",
        "value": "0"
      },
      {
        "name": "segment_length",
        "default": "10000",
        "value": "10000"
      },
      {
        "name": "variant_block_size",
        "default": "1024",
        "value": "1024"
      },
      {
        "name": "mac_threshold",
        "value": "0"
      },
      {
        "name": "maf_threshold",
        "value": "1.01"
      },
      {
        "name": "imputation_score_cutoff",
        "value": "2.02"
      }
    ]
  },
  "phase": "Succeeded",
  "progress": "1/1",
  "startedAt": "2022-03-24T17:37:50Z",
  "finishedAt": "2022-03-24T17:38:10Z"
}
