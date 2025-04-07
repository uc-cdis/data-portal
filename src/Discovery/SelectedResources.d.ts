/* eslint-disable camelcase */
interface Tag {
    name: string;
    category: string;
  }
  interface Investigator {
    investigator_last_name: string;
    investigator_first_name: string;
    investigator_middle_initial: string;
  }
  interface DataRepository {
    repository_name: string;
    repository_study_ID: string;
    repository_study_link: string;
    repository_persistent_ID: string;
  }
  interface StudyMetadata {
    data: {
      data_type: string[];
      data_source: string[];
      data_orientation: string[];
      subject_data_level_available: string[];
      subject_data_unit_of_analysis: string[];
      subject_data_unit_of_collection: string[];
      subject_geographic_data_level_available: string[];
      subject_geographic_data_level_collected: string[];
      subject_data_unit_of_analysis_expected_number: number;
      subject_data_unit_of_collection_expected_number: number;
    };
    citation: {
      funding: string[];
      investigators: Investigator[];
      study_collections: string[];
      heal_funded_status: string;
      heal_platform_citation: string;
      study_collection_status: string;
      heal_platform_persistent_ID: string;
    };
    findings: {
      primary_publications: string[];
      primary_study_findings: string[];
      secondary_publications: string[];
    };
    study_type: {
      study_stage: string[];
      study_type_design: string[];
      study_subject_type: string[];
      study_primary_or_secondary: string;
      study_observational_or_experimental: string;
    };
    minimal_info: {
      study_name: string;
      study_description: string;
      alternative_study_name: string;
      alternative_study_description: string;
    };
    data_availability: {
      produce_data: string;
      produce_other: string;
      data_available: string;
      data_restricted: string;
      data_release_status: string;
      data_collection_status: string;
      data_release_start_date: string;
      data_release_finish_date: string;
      data_collection_start_date: string;
      data_collection_finish_date: string;
    };
    metadata_location: {
      data_repositories: DataRepository[];
      nih_reporter_link: string;
      nih_application_id: number;
      other_study_websites: string[];
      clinical_trials_study_ID: string;
      cedar_study_level_metadata_template_instance_ID: string;
    };
    contacts_and_registrants: {
      contacts: string[];
      registrants: string[];
    };
    study_translational_focus: {
      study_translational_focus: string;
      study_translational_topic_grouping: string[];
    };
    human_subject_applicability: {
      age_applicability: string[];
      gender_applicability: string[];
      geographic_applicability: string[];
      biological_sex_applicability: string[];
      sexual_identity_applicability: string[];
      irb_vulnerability_conditions_applicability: string[];
    };
    human_condition_applicability: {
      condition_category: string[];
      all_other_condition: string[];
      all_outcome_condition: string[];
      pain_causal_condition: string[];
      condition_investigation_stage_or_type: string[];
      all_treatment_or_study_target_condition: string[];
      pain_treatment_or_study_target_condition: string[];
    };
    human_treatment_applicability: {
      treatment_mode: string[];
      treatment_type: string[];
      treatment_novelty: string[];
      treatment_application_level: string[];
      treatment_investigation_stage_or_type: string[];
    };
  }
export interface Resource {
    tags: Tag[];
    authz: string;
    _hdp_uid: string;
    __manifest: string;
    institutions: string;
    year_awarded: string;
    is_registered: boolean;
    project_title: string;
    project_number: string;
    study_metadata: StudyMetadata;
    dataset_1_title: string;
    dataset_2_title: string;
    dataset_3_title: string;
    dataset_4_title: string;
    dataset_5_title: string;
    related_studies: string[];
    administering_ic: string;
    advSearchFilters: { key: string; value: string }[];
    research_program: string;
    data_availability: string;
    investigators_name: string[];
    registration_authz: string;
    registrant_username: string;
    research_focus_area: string;
    time_of_registration: string;
    external_file_metadata: { file_id: string; file_retriever: string }[];
    study_description_summary: string;
    __accessible: number;
  }

export type SelectedResources = Resource[];
