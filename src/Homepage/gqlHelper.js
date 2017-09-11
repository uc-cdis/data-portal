import Relay from 'react-relay';



/**
 * GraphQL helper ... :-)
 */
export class GQLHelper {
  constructor( dictionary ) {
    this.dictonary = dictionary;
  }


  /**
   * Return Relay.QL fragment on viewer that queries the
   * total number of file-type nodes for the helper's dictionary.
   */
  get numFilesTotalFragment() {
    if ( this._totalFilesQuery ) {
      return this._totalFilesQuery;
    }
    const tableNames = [ 
      "_submitted_aligned_reads_count", 
      "_submitted_copy_number_count", 
      "_submitted_methylation_count",
      "_submitted_somatic_mutation_count",
      "_submitted_unaligned_reads_count"
    ];
    
    this._totalFilesQuery = Relay.QL`
      fragment on viewer {
        fileCount1:_slide_image_count
        fileCount2:_submitted_aligned_reads_count
        fileCount3:_submitted_copy_number_count
        fileCount4:_submitted_methylation_count
        fileCount5:_submitted_somatic_mutation_count
        fileCount6:_submitted_unaligned_reads_count
      }`;
    
      /*
      const gqlStr=tableNames.join( "\n" );
        
      this._totalFilesQuery = Relay.QL`
        fragment on viewer {
          ${gqlStr}
        }`;
        */

      return this._totalFilesQuery;
  }


  /**
   * Returns Relay fragment configured to accept a project_id via a $name QL variable
   */
  get numFilesByProjectFragment() {
    if ( this._projFilesQuery ) {
      return this._projFilesQuery;
    }
    const tableNames = [ 
      "_submitted_aligned_reads_count", 
      "_submitted_copy_number_count", 
      "_submitted_methylation_count",
      "_submitted_somatic_mutation_count",
      "_submitted_unaligned_reads_count"
    ];
    
    this._projFilesQuery = Relay.QL`
      fragment on viewer {
        fileCount1:_slide_image_count( project_id:$name )
        fileCount2:_submitted_aligned_reads_count( project_id:$name )
        fileCount3:_submitted_copy_number_count( project_id:$name )
        fileCount4:_submitted_methylation_count( project_id:$name )
        fileCount5:_submitted_somatic_mutation_count( project_id:$name )
        fileCount6:_submitted_unaligned_reads_count( project_id:$name )
      }`;
    
      /*
      const gqlStr=tableNames.join( "\n" );
        
      this._totalFilesQuery = Relay.QL`
        fragment on viewer {
          ${gqlStr}
        }`;
        */

      return this._projFilesQuery;
  }


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
}

