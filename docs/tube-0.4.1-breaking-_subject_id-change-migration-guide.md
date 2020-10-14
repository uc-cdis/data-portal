Tube 0.4.1 has a breaking change that causes all fields named `{index}_id` to be replaced with `_{index}_id`.
https://github.com/uc-cdis/tube/commit/dfcfd512f5cbe69e0a0ead84b0151417c88ebc40#diff-c03e4605886891e20137f944855ecd8cR202

E.g. If the `data` index has data type `subject`, then this causes the `subject.subject_id` fields to become `subject._subject_id`. Likewise if the data type is `case`, `case.case_id` -> `case._case_id`. If the data type is `file`, `file.file_id` -> `file._file_id`. You get the idea.

To migrate a commons to the new version of tube, follow these steps:
1. Make a list of all the `doc_type` fields in etlMapping.yaml.
2. Change any instance of `{doc_type}_id` to `_{doc_type}_id` in gitops.json and etlMapping.yaml. (E.g. if `doc_type` is `subject`, replace all instances of `subject_id` in etlMapping.yaml and gitops.json with `_subject_id` )
3. If there is no change to the etlMapping in the PR, manually add a comment to the etlMapping or change the order of two props in order to force gitops-sync to run the ETL.
