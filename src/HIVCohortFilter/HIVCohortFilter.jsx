import React from 'react';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { PTCCase, ECCase, LTNPCase } from './HIVCohortCases';

class HIVCohortFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caseToRender: 'PTC',
    };
    this.selectedCase = this.selectedCase.bind(this);
    this.updateCase = this.updateCase.bind(this);
  }

  selectedCase() {
    if (this.state.caseToRender === 'PTC') {
      return (<PTCCase />);
    }
    if (this.state.caseToRender === 'EC') {
      return (<ECCase />);
    }
    return (<LTNPCase />);
  }

  updateCase(caseToSwitchTo) {
    this.setState({ caseToRender: caseToSwitchTo });
  }

  render() {
    return (
      <div className='hiv-cohort-filter'>
        <Dropdown buttonType='secondary' id='hiv-cohort-filter__case-selection-dropdown'>
          <Dropdown.Button rightIcon='dropdown' buttonType='secondary' displaySelectedOption='true'>
            {this.state.caseToRender} Cohort Selection
          </Dropdown.Button>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => this.updateCase('PTC')}>
              PTC Cohort Selection
            </Dropdown.Item>
            <Dropdown.Item onClick={() => this.updateCase('EC')}>
              EC Cohort Selection
            </Dropdown.Item>
            <Dropdown.Item onClick={() => this.updateCase('LTNP')}>
              LTNP Cohort Selection
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {this.selectedCase()}
      </div>
    );
  }
}

export default HIVCohortFilter;
