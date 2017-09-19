import Relay from 'react-relay/classic';
import {app,dev} from '../localconf.js';
import {graphql} from 'react-relay';


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
 * bhc (data.brainhealthcommons.org) has some of its own file types - otherwise
 */
class BHCGQLHelper {
  constructor() {
    this._cache = cacheSingleton;
  }


  
  /**
   * Fetch the initial list of projects and global node counts
   */
  get homepageQuery() {
    return this._cache.get( "bhc_homepageQuery",
      () =>         graphql`query gqlHelper_bhcProjectList_Query {
        projectList: project(first: 10000) {
          name: project_id
          code
          experimentCount: _studies_count
        }
        caseCount: _case_count
        experimentCount: _study_count
        aliquotCount: _aliquot_count
        fileCount1:_slide_image_count
        fileCount2:_submitted_aligned_reads_count
        fileCount3:_submitted_copy_number_count
        fileCount4:_submitted_methylation_count
        fileCount5:_submitted_somatic_mutation_count
        fileCount6:_submitted_unaligned_reads_count
        fileCount7:_app_checkup_count
        fileCount8:_cell_image_count          
        fileCount9:_clinical_checkup_count          
        fileCount10:_derived_checkup_count          
        fileCount11:_mass_cytometry_assay_count
        fileCount12:_mass_cytometry_image_count
        fileCount13:_mri_result_count
        fileCount14:_sensor_checkup_count
        fileCount15:_test_result_count
    }`
  );
  }


  /**
   * Fetch details of a particular project
   */
  get projectDetailQuery() {
    return this._cache.get( "bhc_projectDetailQuery",
      () => graphql`query gqlHelper_bhcProjectDetails_Query( $name: [String] ) {
        project( project_id:$name ) {
          name: project_id
          code
          experimentCount: _studies_count
        }
        caseCount: _case_count( project_id:$name )
        experimentCount: _study_count( project_id:$name )
        aliquotCount: _aliquot_count( project_id:$name )
        fileCount1:_slide_image_count( project_id:$name )
        fileCount2:_submitted_aligned_reads_count( project_id:$name )
        fileCount3:_submitted_copy_number_count( project_id:$name )
        fileCount4:_submitted_methylation_count( project_id:$name )
        fileCount5:_submitted_somatic_mutation_count( project_id:$name )
        fileCount6:_submitted_unaligned_reads_count( project_id:$name )
        fileCount7:_app_checkup_count( project_id:$name )
        fileCount8:_cell_image_count( project_id:$name )          
        fileCount9:_clinical_checkup_count( project_id:$name )          
        fileCount10:_derived_checkup_count( project_id:$name )          
        fileCount11:_mass_cytometry_assay_count( project_id:$name )
        fileCount12:_mass_cytometry_image_count( project_id:$name )
        fileCount13:_mri_result_count( project_id:$name )
        fileCount14:_sensor_checkup_count( project_id:$name )
        fileCount15:_test_result_count( project_id:$name )
    }` );
  }
  
}

const bhcSingleton = new BHCGQLHelper();

//----------------------------------------------

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
    } else {
      // TODO - compile-time gql generation based on dictionary
      throw new Error( "Currently only support BHC dictionary" );
    }
  }
  
}


