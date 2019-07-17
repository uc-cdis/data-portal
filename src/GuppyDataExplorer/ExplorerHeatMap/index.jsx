import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
// import echarts from 'echarts';  // TODO remove?
import { EditorBorderRight } from 'material-ui/svg-icons';
import './ExplorerHeatMap.less';

// const yAxisVars = ["subject_id", "age_at_visit", "Abacavir_since_last_visit", "Abacavir_at_visit", "drug_taken_frequency_6mons", "therapy_type_since_last_visit", "therapy_type_at_visit", "Terazol_since_last_visit", "Terazol_at_visit", "year_CD4_collected", "Cholesterol(mg/dL)", "CD8_positive_cells", "viral_load", "cocuse", "drink_category", "highest_education", "emotion_wellness", "employ", "income", "insurance", "paidsex"]; //, "visit_number"];
let yAxisVars = ["age_at_visit", "Abacavir_since_last_visit", "Abacavir_at_visit", "drug_taken_frequency_6mons", "therapy_type_since_last_visit"].sort().reverse().concat(["subject_id"]); // reverse alpha order. "subject_id" always first

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

class ExplorerHeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.maxCellValue = 0, // updated when data is received
    this.state = {
      xAxisVar: 'visit_number', // TODO: configurable
      showCellLabel: false // Note: if true by default, hover on cell displays label - maybe because of tooltip initialization? TODO: remove this note if remove the "show labels" checkbox
    };
  }

  /**
   * @returns transformed data in format [[x index, y index, value], ...]
   */
  getData = () => {
    if (!this.props.data) { // from ExplorerVisualization
      console.error('did not receive guppy data from ExplorerVisualization. using fake data')
      // doc_count: # of NON-missing values
      let data_from_query = [
        {
          key: 0,
          doc_count: 2,
          age_at_visit: {
            doc_count: Math.floor(Math.random() * 2)
          },
          Abacavir_since_last_visit: {
            doc_count: Math.floor(Math.random() * 2)
          },
          Abacavir_at_visit: {
            doc_count: Math.floor(Math.random() * 2)
          },drug_taken_frequency_6mons: {
            doc_count: Math.floor(Math.random() * 2)
          },
          therapy_type_since_last_visit: {
            doc_count: Math.floor(Math.random() * 2)
          }
        },
        {
        key: 1,
        doc_count: 10,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 10)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        }},
        {
        key: 2,
        doc_count: 3,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 3)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        }},
        {
        key: 3,
        doc_count: 11,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 11)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 11)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 11)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 11)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 11)
        }},
        {
        key: 4,
        doc_count: 17,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 17)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 17)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 17)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 17)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 17)
        }},
        {
        key: 5,
        doc_count: 3,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 3)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        }},
        {
        key: 6,
        doc_count: 12,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 12)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 12)
        }},
        {
        key: 7,
        doc_count: 3,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 3)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        }},
        {
        key: 8,
        doc_count: 10,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 10)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        }},
        {
        key: 9,
        doc_count: 14,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 14)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 14)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 14)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 14)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 14)
        }},
        {
        key: 10,
        doc_count: 19,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 19)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 19)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 19)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 19)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 19)
        }},
        {
        key: 11,
        doc_count: 20,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 20)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 20)
        }},
        {
        key: 12,
        doc_count: 15,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 15)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        }},
        {
        key: 13,
        doc_count: 5,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 5)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 5)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 5)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 5)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 5)
        }},
        {
        key: 14,
        doc_count: 8,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 8)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 8)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 8)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 8)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 8)
        }},
        {
        key: 15,
        doc_count: 15,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 15)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        }},
        {
        key: 16,
        doc_count: 11,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 11)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 11)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 11)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 11)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 11)
        }},
        {
        key: 17,
        doc_count: 2,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 2)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 2)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 2)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 2)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 2)
        }},
        {
        key: 18,
        doc_count: 6,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 6)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 6)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 6)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 6)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 6)
        }},
        {
        key: 19,
        doc_count: 10,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 10)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        }},
        {
        key: 20,
        doc_count: 12,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 12)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 12)
        }},
        {
        key: 21,
        doc_count: 2,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 2)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 2)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 2)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 2)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 2)
        }},
        {
        key: 22,
        doc_count: 10,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 10)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        }},
        {
        key: 23,
        doc_count: 9,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 9)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 9)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 9)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 9)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 9)
        }},
        {
        key: 24,
        doc_count: 3,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 3)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        }},
        {
        key: 25,
        doc_count: 15,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 15)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        }},
        {
        key: 26,
        doc_count: 14,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 14)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 14)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 14)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 14)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 14)
        }},
        {
        key: 27,
        doc_count: 16,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 16)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 16)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 16)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 16)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 16)
        }},
        {
        key: 28,
        doc_count: 17,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 17)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 17)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 17)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 17)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 17)
        }},
        {
        key: 29,
        doc_count: 20,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 20)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 20)
        }},
        {
        key: 30,
        doc_count: 16,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 16)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 16)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 16)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 16)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 16)
        }},
        {
        key: 31,
        doc_count: 15,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 15)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        }},
        {
        key: 32,
        doc_count: 10,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 10)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 10)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 10)
        }},
        {
        key: 33,
        doc_count: 20,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 20)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 20)
        }},
        {
        key: 34,
        doc_count: 20,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 20)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 20)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 20)
        }},
        {
        key: 35,
        doc_count: 1,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 1)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 1)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 1)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 1)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 1)
        }},
        {
        key: 36,
        doc_count: 2,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 2)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 2)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 2)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 2)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 2)
        }},
        {
        key: 37,
        doc_count: 17,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 17)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 17)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 17)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 17)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 17)
        }},
        {
        key: 38,
        doc_count: 19,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 19)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 19)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 19)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 19)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 19)
        }},
        {
        key: 39,
        doc_count: 5,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 5)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 5)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 5)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 5)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 5)
        }},
        {
        key: 40,
        doc_count: 4,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 4)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 4)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 4)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 4)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 4)
        }},
        {
        key: 41,
        doc_count: 18,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 18)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 18)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 18)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 18)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 18)
        }},
        {
        key: 42,
        doc_count: 7,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 7)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 7)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 7)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 7)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 7)
        }},
        {
        key: 43,
        doc_count: 15,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 15)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 15)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 15)
        }},
        {
        key: 44,
        doc_count: 6,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 6)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 6)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 6)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 6)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 6)
        }},
        {
        key: 45,
        doc_count: 3,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 3)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 3)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 3)
        }},
        {
        key: 46,
        doc_count: 12,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 12)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 12)
        }},
        {
        key: 47,
        doc_count: 12,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 12)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 12)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 12)
        }},
        {
        key: 48,
        doc_count: 1,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 1)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 1)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 1)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 1)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 1)
        }},
        {
        key: 49,
        doc_count: 9,
        age_at_visit: {
        doc_count: Math.floor(Math.random() * 9)
        },
        Abacavir_since_last_visit: {
        doc_count: Math.floor(Math.random() * 9)
        },
        Abacavir_at_visit: {
        doc_count: Math.floor(Math.random() * 9)
        },drug_taken_frequency_6mons: {
        doc_count: Math.floor(Math.random() * 9)
        },
        therapy_type_since_last_visit: {
        doc_count: Math.floor(Math.random() * 9)
        }
        },
      ]
        
      // x axis: visit_number
      // y axis: var
      let transformed_data = [];
      data_from_query.map(details => {
        let xIndex = details.key
        yAxisVars.map(varName => {
          let rate = details[varName].doc_count / details.doc_count;
          rate = round(rate, 2) // || '-'; // 2 decimals / zero -> empty // Note: if '-' for zeros, there is no tooltip to know which x/y is zero
          transformed_data.push([xIndex, yAxisVars.indexOf(varName), rate]);
        });
      });
      return transformed_data;
    }

    const number_of_decimals = 1;
    const precision = Math.pow(10, number_of_decimals);

    let transformed_data = [];
    this.maxCellValue = 0;

    this.props.data.map(details => {
      let xIndex = details.key;

      yAxisVars.map(varName => {
        let rate;
        if (varName == "subject_id") { // TODO: configurable
          rate = details[varName].count / this.props.nodeTotalCount;
        }
        else {
          rate = details[varName].count / details.count;
        }
        // Note: if '-' for zeros, there is no tooltip about which x/y is zero
        rate = round(rate, 2); // || '-'; // 2 decimals / zero -> empty
        transformed_data.push([
          xIndex,
          yAxisVars.indexOf(varName),
          rate // round with 2 decimals in cells
        ]);
        if (rate > this.maxCellValue) {
          // round UP with 1 decimal in legend
          this.maxCellValue = Math.ceil(rate * precision) / precision;
        }
      });
    });
    return transformed_data;
  };

  /**
   * See echarts docs at https://echarts.apache.org/en/option.html
   */
  getOptions = (data) => {
    let xAxisVar = this.state.xAxisVar;
    return {
      tooltip: {
        position: 'top',
        formatter: function (params) {
          // params = [x, y, value]
          let yAxisVar = yAxisVars[params.data[1]];
          return `variable: ${yAxisVar}<br/>${xAxisVar}: ${params.data[0]}<br/>data percentage: ${params.data[2]}`;
        }
      },
      // toolbox: {
      //   dataZoom: {
      //   }
      // },
      grid: {
        height: '50%',
        y: '10%', // gap between x axis and legend
        containLabel: true // axis labels are cut off if not grid.containLabel
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        name: xAxisVar,
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: '18' // default (used for other axis) is 12
        }
        // splitArea: {
        //   show: true
        // }
      },
      yAxis: {
        type: 'category',
        data: yAxisVars,
        axisTick: {
          show: false
        },
        // splitArea: {
        //   show: true
        // }
      },
      visualMap: {
        min: 0,
        max: this.maxCellValue, // round up (1 decimal) of max value
        precision: 2, // 2 decimals in label
        calculable: true, // handles on legend to adjust selected range
        orient: 'horizontal',
        left: 'center', // horizontal alignment
        // left: 'right',
        // orient: 'vertical',
        // left: 'right',
        // top: 'top',
        // bottom: '15%', // does not seem to work well with grid.y
        align: 'right', // position of bar relatively to handles and label
        inRange: {
          color: ['#EBF7FB', '#3188C6'] // [smallest value, greatest value]
        }
      },
      series: [{
        type: 'heatmap',
        data: data,
        label: {
          normal: {
            show: this.state.showCellLabel
          }
        }
      }]
    };
  };
  
  render() {
    let data = this.getData()
    return (
      <React.Fragment>
       {/* <div className={'checkbox'}>
         <input
          // TODO remove this checkbox (or use CheckBox component if we keep this)
          type='checkbox'
          // id={this.props.id}
          value={this.state.showCellLabel}
          checked={this.state.showCellLabel}
          onChange={
            () => this.setState({showCellLabel: !this.state.showCellLabel})
          }
        /> show cell labels
      </div> */}
      {
        data && data.length && (
          <div className={`explorer-heat-map`}>
            <div className={`explorer-heat-map__title--align-center h4-typo`}>
              Data availability
            </div>
            <div className='explorer-heat-map__chart'>
              <ReactEcharts
                option={this.getOptions(data)}
              />
            </div>
          </div>
        )
      }
      </React.Fragment>
    );
  }
}

ExplorerHeatMap.propTypes = {
  data: PropTypes.array,
  nodeTotalCount: PropTypes.number, // Note: total number of subject_ids
};

ExplorerHeatMap.defaultProps = {
  data: {},
  nodeTotalCount: null,
};

export default ExplorerHeatMap;
