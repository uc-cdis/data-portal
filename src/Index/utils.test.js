import {
  getChunkedPeregrineRequestUrls,
  mergeChunkedChartData,
} from './utils';
import { datasetUrl } from '../localconf';

const urlPrefix = `${datasetUrl}?nodes=`;

describe('the load homepage chart data flow', () => {
  it('provides accurate non-chunked queries', () => {
    const testList1 = [];
    const testList2 = ['aliquot'];
    const testList3 = ['aliquot', 'sample_snp_array'];

    expect(getChunkedPeregrineRequestUrls(testList1, 15)).toEqual([urlPrefix]);
    expect(getChunkedPeregrineRequestUrls(testList2, 15)).toEqual([`${urlPrefix}aliquot`]);
    expect(getChunkedPeregrineRequestUrls(testList3, 15)).toEqual([`${urlPrefix}aliquot,sample_snp_array`]);
  });

  it('provides accurate chunked queries', () => {
    const testList4 = ['aggregated_snp_array', 'aligned_reads', 'allele_expression', 'copy_number_variation', 'exon_expression', 'gene_expression,imaging_file', 'reference_file', 'simple_germline_variation', 'snp_array_variation', 'submitted_aligned_reads', 'submitted_cnv_array', 'submitted_snp_array', 'submitted_unaligned_reads', 'transcript_expression', 'subject', 'study', 'aliquot'];
    const testList5 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];

    // testList4 is of length 17; chunk size is 15
    expect(getChunkedPeregrineRequestUrls(testList4, 15)).toEqual([
      `${urlPrefix}aggregated_snp_array,aligned_reads,allele_expression,copy_number_variation,exon_expression,gene_expression,imaging_file,reference_file,simple_germline_variation,snp_array_variation,submitted_aligned_reads,submitted_cnv_array,submitted_snp_array,submitted_unaligned_reads,transcript_expression,subject`,
      `${urlPrefix}study,aliquot`,
    ]);

    // testList5 is of length 35
    expect(getChunkedPeregrineRequestUrls(testList5, 15)).toEqual([
      `${urlPrefix}1,2,3,4,5,6,7,8,9,10,11,12,13,14,15`,
      `${urlPrefix}16,17,18,19,20,21,22,23,24,25,26,27,28,29,30`,
      `${urlPrefix}31,32,33,34,35`,
    ]);

    // Try out a different chunk size
    expect(getChunkedPeregrineRequestUrls(testList5, 30)).toEqual([
      `${urlPrefix}1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30`,
      `${urlPrefix}31,32,33,34,35`,
    ]);
  });

  it('correctly merges chunked chart data results', () => {
    const chunk1 = [{ 'project-a': { 'node-1': 17, 'node-2': 9 }, 'project-b': { 'node-1': 2, 'node-2': 0 } }];
    const chunk2 = [{ 'project-a': { 'node-3': 3, 'node-4': 13 }, 'project-b': { 'node-3': 6, 'node-4': 2 } }];

    expect(mergeChunkedChartData([chunk1, chunk2])).toEqual({
      'project-a': {
        'node-1': 17, 'node-2': 9, 'node-3': 3, 'node-4': 13,
      },
      'project-b': {
        'node-1': 2, 'node-2': 0, 'node-3': 6, 'node-4': 2,
      },
    });
  });
});
