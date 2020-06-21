import { 
  loadHomepageChartDataFromDatasets, 
  getChunkedPeregrineRequestUrls, 
  mergeChunkedChartData 
} from './utils';
import { homepageChartNodes, datasetUrl } from '../localconf';

var urlPrefix = datasetUrl + '?nodes=';

describe('the load homepage chart data flow', () => {
  it('provides accurate non-chunked queries', () => {
    let testList1 = [];
    let testList2 = ['aliquot'];
    let testList3 = ['aliquot', 'sample_snp_array'];
    
    expect(getChunkedPeregrineRequestUrls(testList1)).toEqual([urlPrefix]);
    expect(getChunkedPeregrineRequestUrls(testList2)).toEqual([urlPrefix + 'aliquot']);
    expect(getChunkedPeregrineRequestUrls(testList3)).toEqual([urlPrefix + 'aliquot,sample_snp_array']);
  })

  it('provides accurate chunked queries', () => {
    let testList4 = ['aggregated_snp_array', 'aligned_reads', 'allele_expression', 'copy_number_variation', 'exon_expression', 'gene_expression,imaging_file', 'reference_file', 'simple_germline_variation', 'snp_array_variation', 'submitted_aligned_reads', 'submitted_cnv_array', 'submitted_snp_array', 'submitted_unaligned_reads', 'transcript_expression', 'subject', 'study', 'aliquot']
    let testList5 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];
    
    // testList4 is of length 17; chunk size is 15
    expect(getChunkedPeregrineRequestUrls(testList4)).toEqual([
      urlPrefix + 'aggregated_snp_array,aligned_reads,allele_expression,copy_number_variation,exon_expression,gene_expression,imaging_file,reference_file,simple_germline_variation,snp_array_variation,submitted_aligned_reads,submitted_cnv_array,submitted_snp_array,submitted_unaligned_reads,transcript_expression,subject',
      urlPrefix + 'study,aliquot'
    ]);

    // testList5 is of length 35
    expect(getChunkedPeregrineRequestUrls(testList5)).toEqual([
      urlPrefix + '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
      urlPrefix + '16,17,18,19,20,21,22,23,24,25,26,27,28,29,30',
      urlPrefix + '31,32,33,34,35'
    ]);
  })

  it('correctly merges chunked chart data results', () => {
    let chunk1 = [{'project-a': {'node-1': 17, 'node-2': 9}, 'project-b': {'node-1': 2, 'node-2': 0}}];
    let chunk2 = [{'project-a': {'node-3': 3, 'node-4': 13}, 'project-b': {'node-3': 6, 'node-4': 2}}];
    
    expect(mergeChunkedChartData([chunk1, chunk2])).toEqual({
      'project-a': {'node-1': 17, 'node-2': 9, 'node-3': 3, 'node-4': 13}, 
      'project-b': {'node-1': 2, 'node-2': 0, 'node-3': 6, 'node-4': 2}
    });
  })
});