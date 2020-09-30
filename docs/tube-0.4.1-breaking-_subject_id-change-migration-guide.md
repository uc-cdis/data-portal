Tube 0.4.1 has a breaking change that causes all fields named `{index}_id` to be replaced with `_{index}_id`.
https://github.com/uc-cdis/tube/commit/dfcfd512f5cbe69e0a0ead84b0151417c88ebc40#diff-c03e4605886891e20137f944855ecd8cR202

If the Data index is of data type `subject`, then this causes all commons' `subject_id` fields to become `_subject_id`, requiring changes to the portal config where those fields are referenced.

Changes required:
> NOTE Assumes data type is `subject`, if it is `case` do `case_id` -> `_case_id` instead
- Any references to `subject_id` as a field in the `dataExplorerConfig.charts` or `dataExplorerConfig.filters` block should be changed from `subject_id` -> `_subject_id`
- `dataExplorerConfig.manifestMapping.referenceIdFieldInDataIndex` should be changed from `subject_id` -> `_subject_id`
> NOTE **huge gotcha**: `dataExplorerConfig.manifestMapping.referenceIdFieldInResourceIndex`, should NOT change from `subject_id` -> `_subject_id` -- it should remain as `subject_id`. This is because this is actually referring to the *subject_id field in the File index*, which remains unchanged as `subject_id`.
- `fileExplorerConfig.manifestMapping.resourceIdField` should be changed from `subject_id` -> `_subject_id`

If there are any other instances of `subject_id` that show up in the portal config, you may also need to change those if they refer to `subject._subject_id` and not `file.subject_id`.
