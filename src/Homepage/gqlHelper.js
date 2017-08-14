import Relay from 'react-relay/classic';
import {app,dev} from '../localconf.js';

/**
 * Little helper to re-use parsed graphql
 */
export class Cache {
  constructor() {
    this._cache = {};
  }

  /**
   * Little helper memooizes gqlBuilder() under key
   * on the first call for key, then returns the cached
   * value for subsequent calls.
   * 
   * @param {String} key 
   * @param {()=>Relay.QL} gqlBuilder
   * @return Relay.QL 
   */
  get( key, gqlBuilder ) {
    if ( ! this._cache.hasOwnProperty(key) ) {
      this._cache[key] = gqlBuilder();
    }
    return this._cache[key];
    
  }
}

const cacheSingleton = new Cache();


/**
 * GraphQL helper for "Experiment" based dictionaries
 */
class ExperimentGQLHelper {
  constructor() {
    this._cache = cacheSingleton;
  }

  
  /**
   * Return Relay.QL fragment on viewer that queries the
   * total number of file-type nodes for the helper's dictionary.
   */
  get numFilesTotalFragment() {
    return this._cache.get( "exp_numFilesTotalFragment",
      () => Relay.QL`
        fragment on viewer {
          fileCount1:_slide_image_count
          fileCount2:_submitted_aligned_reads_count
          fileCount3:_submitted_copy_number_count
          fileCount4:_submitted_methylation_count
          fileCount5:_submitted_somatic_mutation_count
          fileCount6:_submitted_unaligned_reads_count
        }`
      );
  }


  /**
   * Returns Relay fragment configured to accept a project_id via a $name QL variable
   */
  get numFilesByProjectFragment() {
      return this._cache.get( "exp_numFilesByProjectFragment", 
        () => Relay.QL`
          fragment on viewer {
            fileCount1:_slide_image_count( project_id:$name )
            fileCount2:_submitted_aligned_reads_count( project_id:$name )
            fileCount3:_submitted_copy_number_count( project_id:$name )
            fileCount4:_submitted_methylation_count( project_id:$name )
            fileCount5:_submitted_somatic_mutation_count( project_id:$name )
            fileCount6:_submitted_unaligned_reads_count( project_id:$name )
          }`
        );
  }


  /**
   * Fragment attached to RelayProjectTable's TR (table row)
   */
  get projectTableTRFragment() {
    return this._cache.get( "exp_projectTableTRFragment", 
      () => Relay.QL`
        fragment on viewer {
          project(project_id: $name) {
            name:project_id
            experimentCount:_experiments_count
          }
          caseCount:_case_count( project_id: $name )
          aliquotCount:_aliquot_count( project_id: $name )
          ${this.numFilesByProjectFragment}
        }`
      );
  }

  /**
   * Fragment attached to RelayProjectDashboard
   */
  get projectDashboardFragment() {
    return this._cache.get( "exp_projectDashboardFragment", 
      () => Relay.QL`
        fragment on viewer {
            project(first: 10000) {
              project_id
              code
              _experiments_count
            }
            _case_count
            _experiment_count
            _aliquot_count
            ${this.numFilesTotalFragment}         
        }`
      );
  }
}

const expHelperSingleton = new ExperimentGQLHelper();

/**
 * GQL for "Study" based dictionaries
 */
class StudyGQLHelper {
  constructor() {
    this._cache = cacheSingleton;
    this._expHelper = expHelperSingleton;
  }

  
  /**
   * Same query as ExperimentGQLHelper
   */
  get numFilesTotalFragment() {
    return this._expHelper.numFilesTotalFragment;
  }


  /**
   * Same query as ExperimentGQLHelper
   */
  get numFilesByProjectFragment() {
      return this._expHelper.numFilesByProjectFragment;
  }


  /**
   * Fragment attached to RelayProjectTable's TR (table row)
   */
  get projectTableTRFragment() {
    return this._cache.get( "study_projectTableTRFragment", 
      () => Relay.QL`
        fragment on viewer {
          project(project_id: $name) {
            name:project_id
            experimentCount:_studies_count
          }
          caseCount:_case_count( project_id: $name )
          aliquotCount:_aliquot_count( project_id: $name )
          ${this.numFilesByProjectFragment}
        }`
      );
  }

  /**
   * Fragment attached to RelayProjectDashboard
   */
  get projectDashboardFragment() {
    return this._cache.get( "study_projectDashboardFragment",
      () => Relay.QL`
        fragment on viewer {
            project(first: 10000) {
              project_id
              code
              _studies_count
            }
            _case_count
            _experiment_count: _study_count
            _aliquot_count
            ${this.numFilesTotalFragment}
        }`
      );
  }
}

const studyHelperSingleton = new StudyGQLHelper();


/**
 * bhc (data.brainhealthcommons.org) has some of its own file types - otherwise
 */
class BHCGQLHelper {
  constructor() {
    this._cache = cacheSingleton;
    this._studyHelper = studyHelperSingleton;
  }


  
  /**
   * Same query as ExperimentGQLHelper
   */
  get numFilesTotalFragment() {
    return this._cache.get( "bhc_numFilesTotalFragment",
      () => Relay.QL`fragment on viewer {
        fileCount7:_app_checkup_count
        fileCount8:_cell_image_count          
        fileCount9:_clinical_checkup_count          
        fileCount10:_derived_checkup_count          
        fileCount11:_mass_cytometry_assay_count
        fileCount12:_mass_cytometry_image_count
        fileCount13:_mri_result_count
        fileCount14:_sensor_checkup_count
        fileCount15:_test_result_count          
        ${this._studyHelper.numFilesTotalFragment}
        }` );
  }


  /**
   * Same query as ExperimentGQLHelper
   */
  get numFilesByProjectFragment() {
    return this._cache.get( "bhc_numFilesByProject",
      () => Relay.QL`fragment on viewer {
          fileCount7:_app_checkup_count( project_id:$name )
          fileCount8:_cell_image_count( project_id:$name )          
          fileCount9:_clinical_checkup_count( project_id:$name )          
          fileCount10:_derived_checkup_count( project_id:$name )          
          fileCount11:_mass_cytometry_assay_count( project_id:$name )
          fileCount12:_mass_cytometry_image_count( project_id:$name )
          fileCount13:_mri_result_count( project_id:$name )
          fileCount14:_sensor_checkup_count( project_id:$name )
          fileCount15:_test_result_count( project_id:$name )          
          ${this._studyHelper.numFilesTotalFragment}
        }` );
  }


  /**
   * Fragment attached to RelayProjectTable's TR (table row)
   */
  get projectTableTRFragment() {
    return this._cache.get( "bhc_projectTableTRFragment", 
      () => Relay.QL`
        fragment on viewer {
          project(project_id: $name) {
            name:project_id
            experimentCount:_studies_count
          }
          caseCount:_case_count( project_id: $name )
          aliquotCount:_aliquot_count( project_id: $name )
          ${this.numFilesByProjectFragment}
        }`
      );
  }

  /**
   * Fragment attached to RelayProjectDashboard
   */
  get projectDashboardFragment() {
    return this._cache.get( "bhc_projectDashboardFragment",
    () => Relay.QL`
      fragment on viewer {
          project(first: 10000) {
            project_id
            code
            _studies_count
          }
          _case_count
          _experiment_count: _study_count
          _aliquot_count
          ${this.numFilesTotalFragment}
      }`
    );
  }
}

const bhcSingleton = new BHCGQLHelper();

/**
 * App-aware GQLHelper - delegates to the appropriate helper for the given app
 */
export class GQLHelper {
  /**
   * Goofy little utility - scans data for keys matching 'fileCount\d+' or 'fileData\d+',
   * and returns a { fileCount: sum-of-fileCounts, fileData:[] concatenation of data }
   * 
   * @param {Object} data
   * @return {{fileCount:sum,fileData:Array}} 
   */
  static extractFileInfo( data ) {
    const fileCount = Object.keys( data ).filter( key => key.indexOf( "fileCount" ) === 0 ).map( key => data[key] 
    ).reduce( (acc,it) => acc + it, 0 );
    const fileData = Object.keys( data ).filter( key => key.indexOf( "fileData" ) === 0 ).map( key => data[key] 
    ).reduce( 
      (acc,it) => { let result=acc; if( Array.isArray( it ) ) { result = acc.concat( it ) } else { acc.push(it ); } return result }, 
      [] 
    );
    return { fileCount: fileCount, fileData: fileData };
  }


  /**
   * Little singleton factory - returns the appropriate helper for the app
   */
  static getGQLHelper( appName=app ) {
    if ( appName === "bhc" ) {
      return bhcSingleton;
    } else if ( appName === "bpa" && !dev ) {
      return studyHelperSingleton;
    }
    
    return expHelperSingleton;
  }

}


